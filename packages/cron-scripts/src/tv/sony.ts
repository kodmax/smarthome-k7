#!/usr/bin/node
import { IpControl } from 'sony-bravia-ip-control'
import { requireEnv } from '#config/env'

const isNoSignal = async (sony: IpControl): Promise<boolean> => {
  const inputs = await sony.getCurrentExternalInputsStatus()
  const content = await sony.getPlayingContentInfo()

  const input = inputs.find(externalInput => externalInput.uri === content.uri)
  return input?.status === 'false'
}

const run = async (sony: IpControl) => {
  const power = await sony.getPowerStatus()
  if (power.status !== 'active') {
    return
  }

  if (await isNoSignal(sony)) {
    setTimeout(() => {
      isNoSignal(sony).then(noSignal => {
        if (noSignal) {
          return sony.setPowerStatus('standby')
        }
      })
    }, 60_000)
  }
}

await run(new IpControl(requireEnv('SONY_TV_IP'), requireEnv('SONY_TV_SECRET')))
