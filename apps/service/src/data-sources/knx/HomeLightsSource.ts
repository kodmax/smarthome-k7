import { CacheAgeUnit, DataSourceDefinition } from '@repo/feeds'
import { homeLights, homeLightsById } from '@repo/knx-schema'
import { LightsFeed } from '@repo/types'
import { DPT_Generic_B1, DPT_Switch, KnxReading, type KnxLink } from 'js-knx'
import { Inject } from '@/di'

export class HomeLightsSource extends DataSourceDefinition<LightsFeed> {
  @Inject('knx')
  declare private readonly knx: KnxLink

  private readonly sets = new Map<string, DPT_Switch>()
  private readonly statuses = new Map<string, DPT_Generic_B1>()
  private readonly readings: Partial<Record<string, KnxReading<number>>> = {}

  public constructor(push: (content?: LightsFeed) => void, reportError: (e: Error) => void) {
    super(push, reportError)

    for (const circuit of homeLights) {
      this.sets.set(circuit.id, this.knx.group(circuit.set))

      const status = this.knx.group(circuit.status)
      this.statuses.set(circuit.id, status)
      status.addWriteListener(reading => {
        this.readings[circuit.id] = reading
        this.push(this.buildFeed())
      })
    }
  }

  private buildFeed(): LightsFeed {
    return {
      circuits: Object.fromEntries(
        homeLights
          .filter(circuit => this.readings[circuit.id] !== undefined)
          .map(circuit => [circuit.id, { reading: this.readings[circuit.id] as KnxReading<number> }]),
      ),
    }
  }

  public getId(): string {
    return 'lights'
  }

  public isVolatile(): boolean {
    return true
  }

  public getCacheTTL(): number {
    return CacheAgeUnit.HOUR
  }

  public getSourceMetricType() {
    return 'knx' as const
  }

  public async getData(): Promise<LightsFeed> {
    for (const circuit of homeLights) {
      const status = this.statuses.get(circuit.id)
      if (status === undefined) {
        throw new Error(`Light circuit status group not initialized: "${circuit.id}"`)
      }

      this.readings[circuit.id] = await status.read()
    }

    return this.buildFeed()
  }

  public async handleCommand(command: string, args: string): Promise<void> {
    if (command !== 'set') {
      return
    }

    const [circuitId, state] = args.trim().split(/\s+/)
    if (circuitId === undefined || state === undefined) {
      throw new Error(`Invalid lights set command: "${args}"`)
    }

    if (homeLightsById[circuitId] === undefined) {
      throw new Error(`Unknown light circuit: "${circuitId}"`)
    }

    const setDp = this.sets.get(circuitId)
    if (setDp === undefined) {
      throw new Error(`Light circuit set group not initialized: "${circuitId}"`)
    }

    switch (state) {
      case 'on':
        await setDp.write(1)
        return
      case 'off':
        await setDp.write(0)
        return
      default:
        throw new Error(`Invalid light state: "${state}" (expected on or off)`)
    }
  }
}
