import type { LightsFeed } from '@repo/types'
import { homeLights, homeLightsById } from '@repo/knx-schema'

const ROOM_LABELS: Record<string, string> = {
  dining_room: 'Jadalnia',
  kitchen: 'Kuchnia',
  bathroom: 'Łazienka',
  hallway: 'Hol',
  living_room: 'Salon',
  bedroom: 'Sypialnia',
}

function formatOnOff(value: number | undefined): string {
  if (value === 1) return 'włączone'
  if (value === 0) return 'wyłączone'
  return 'nieznany'
}

export function formatLights(feed: LightsFeed, room?: string): string {
  const circuits = room === undefined ? homeLights : homeLights.filter(circuit => circuit.room === room)

  if (circuits.length === 0) {
    const knownRooms = [...new Set(homeLights.map(circuit => circuit.room))].join(', ')
    return `Nieznany pokój "${room}". Dostępne: ${knownRooms}`
  }

  const lines: string[] = []
  let currentRoom = ''

  for (const circuit of circuits) {
    if (room === undefined && circuit.room !== currentRoom) {
      currentRoom = circuit.room
      const roomLabel = ROOM_LABELS[circuit.room] ?? circuit.room
      lines.push('', `${roomLabel} (${circuit.room}):`)
    }

    const reading = feed.circuits[circuit.id]?.reading.value
    lines.push(`  ${circuit.id}: ${formatOnOff(reading)}`)
  }

  return lines.join('\n').trim()
}

export function listLightCircuitIds(room?: string): string[] {
  const circuits = room === undefined ? homeLights : homeLights.filter(circuit => circuit.room === room)
  return circuits.map(circuit => circuit.id)
}

export function resolveLightCircuit(circuitId: string): { id: string; room: string } | undefined {
  const circuit = homeLightsById[circuitId]
  if (circuit === undefined) return undefined
  return { id: circuit.id, room: circuit.room }
}

export function formatControlLightResult(circuitId: string, state: 'on' | 'off', feed: LightsFeed): string {
  const circuit = homeLightsById[circuitId]
  const reading = feed.circuits[circuitId]?.reading.value
  const roomLabel = circuit !== undefined ? (ROOM_LABELS[circuit.room] ?? circuit.room) : circuitId

  return [
    `Wysłano: ${circuitId} → ${state === 'on' ? 'włącz' : 'wyłącz'}`,
    `Pokój: ${roomLabel}`,
    `Stan statusu: ${formatOnOff(reading)}`,
  ].join('\n')
}
