import { TableBody } from '@mui/material'
import { type FC } from 'react'
import { AirVentIcon, HeaterIcon, HeatingIcon, NightIcon, SunIcon, TemperatureIcon } from '@repo/assets'
import { ApolloDataTable, KnxReading, KnxStateIcon } from '@/card-components'
import { ApolloCard, useZoom } from '@repo/apollo-card'
import type { LucideIcon } from 'lucide-react'
import { TemperatureData } from '@repo/types'
import { useTranslations } from '@/i18n'

const icons: Record<string, LucideIcon> = {
  FrostProtection: AirVentIcon,
  Comfort: HeatingIcon,
  Standby: SunIcon,
  Economy: NightIcon,
}

export const Temperature: FC<Record<string, never>> = () => {
  const zoom = useZoom('indoor-temp')
  const { t } = useTranslations()
  const labels = t.dashboard.temperature

  return (
    <ApolloCard cardId='indoor-temp' title={labels.title} icon={TemperatureIcon}>
      <ApolloDataTable>
        <TableBody>
          <KnxReading
            bars={{ historyKey: 'today', highest: 30, lowest: 20, optimal: 24, color: true }}
            precision={2}
            feed='home.temp.bathroom-floor'
            label={labels.bathroomFloor}
            range={{ optimal: 25, lowest: 21, highest: 30 }}
            icon={
              zoom ? (
                <KnxStateIcon<TemperatureData>
                  icon={payload => icons[payload.mode.bathroom.text] ?? HeaterIcon}
                  id='heating'
                  active={payload => payload.status.lazienkaPodloga.value === 1}
                />
              ) : undefined
            }
          />
          <KnxReading
            bars={{ historyKey: 'today', highest: 30, lowest: 20, optimal: 24, color: true }}
            precision={2}
            feed='home.temp.livingroom'
            target={zoom ? payload => Number(payload.setpoint).toFixed(1) : undefined}
            label={labels.livingRoom}
            range={{ optimal: 25, lowest: 21, highest: 30 }}
            icon={
              zoom ? (
                <KnxStateIcon<TemperatureData>
                  icon={payload => icons[payload.mode.livingroom.text] ?? HeaterIcon}
                  id='heating'
                  active={payload => payload.status.salon.value === 1}
                />
              ) : undefined
            }
          />
          <KnxReading
            bars={{ historyKey: 'today', highest: 30, lowest: 20, optimal: 24, color: true }}
            precision={2}
            feed='home.temp.bedroom'
            target={zoom ? payload => Number(payload.setpoint).toFixed(1) : undefined}
            label={labels.bedroom}
            range={{ optimal: 25, lowest: 21, highest: 30 }}
            icon={
              zoom ? (
                <KnxStateIcon<TemperatureData>
                  icon={payload => icons[payload.mode.bedroom.text] ?? HeaterIcon}
                  id='heating'
                  active={payload => payload.status.sypialnia.value === 1}
                />
              ) : undefined
            }
          />
          <KnxReading
            bars={{ historyKey: 'today', highest: 30, lowest: 20, optimal: 24, color: true }}
            precision={2}
            feed='home.temp.bathroom'
            target={zoom ? payload => Number(payload.setpoint).toFixed(1) : undefined}
            label={labels.bathroom}
            range={{ optimal: 25, lowest: 21, highest: 30 }}
            icon={
              zoom ? (
                <KnxStateIcon<TemperatureData>
                  icon={payload => icons[payload.mode.bathroom.text] ?? HeaterIcon}
                  id='heating'
                  active={payload => payload.status.lazienka.value === 1}
                />
              ) : undefined
            }
          />
        </TableBody>
      </ApolloDataTable>
    </ApolloCard>
  )
}
