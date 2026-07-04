import { TableBody } from '@mui/material'
import { type FC } from 'react'
import { TemperatureIcon } from '@repo/assets'
import { ApolloDataTable, KnxReading, KnxStateIcon } from '@/card-components'
import { ApolloCard } from '@/apollo-card'
import { Bedtime, Fireplace, LightMode, Air, type SvgIconComponent, ThermostatAuto } from '@mui/icons-material'
import { TemperatureData } from '@repo/types'

const icons: Record<string, SvgIconComponent> = {
  FrostProtection: Air,
  Comfort: Fireplace,
  Standby: LightMode,
  Economy: Bedtime,
}

export const Temperature: FC<Record<string, never>> = () => {
  return (
    <ApolloCard cardId='indoor-temp' title='Temperatura' icon={TemperatureIcon}>
      <ApolloDataTable>
        <TableBody>
          <KnxReading
            bars={{ historyKey: 'today', highest: 30, lowest: 20, optimal: 24, color: true }}
            precision={2}
            feed='home.temp.bathroom-floor'
            label='Podłoga łazienki'
            range={{ optimal: 25, lowest: 21, highest: 30 }}
            icon={
              <KnxStateIcon<TemperatureData>
                icon={payload => icons[payload.mode.bathroom.text] ?? ThermostatAuto}
                id='heating'
                active={payload => payload.status.lazienkaPodloga.value === 1}
              />
            }
          />
          <KnxReading
            bars={{ historyKey: 'today', highest: 30, lowest: 20, optimal: 24, color: true }}
            precision={2}
            feed='home.temp.livingroom'
            target={payload => Number(payload.setpoint).toFixed(1)}
            label='Salon'
            range={{ optimal: 25, lowest: 21, highest: 30 }}
            icon={
              <KnxStateIcon<TemperatureData>
                icon={payload => icons[payload.mode.livingroom.text] ?? ThermostatAuto}
                id='heating'
                active={payload => payload.status.salon.value === 1}
              />
            }
          />
          <KnxReading
            bars={{ historyKey: 'today', highest: 30, lowest: 20, optimal: 24, color: true }}
            precision={2}
            feed='home.temp.bedroom'
            target={payload => Number(payload.setpoint).toFixed(1)}
            label='Sypialnia'
            range={{ optimal: 25, lowest: 21, highest: 30 }}
            icon={
              <KnxStateIcon<TemperatureData>
                icon={payload => icons[payload.mode.bedroom.text] ?? ThermostatAuto}
                id='heating'
                active={payload => payload.status.sypialnia.value === 1}
              />
            }
          />
          <KnxReading
            bars={{ historyKey: 'today', highest: 30, lowest: 20, optimal: 24, color: true }}
            precision={2}
            feed='home.temp.bathroom'
            target={payload => Number(payload.setpoint).toFixed(1)}
            label='Łazienka'
            range={{ optimal: 25, lowest: 21, highest: 30 }}
            icon={
              <KnxStateIcon<TemperatureData>
                icon={payload => icons[payload.mode.bathroom.text] ?? ThermostatAuto}
                id='heating'
                active={payload => payload.status.lazienka.value === 1}
              />
            }
          />
        </TableBody>
      </ApolloDataTable>
    </ApolloCard>
  )
}
