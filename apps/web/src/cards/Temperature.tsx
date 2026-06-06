import { type FC, useState } from 'react'
import KnxReading from './components/KnxReading'
import zoomBanner from './card-banners/indoor-temp-zoom.jpg'
import banner from './card-banners/indoor-temp.jpg'
import ApolloCard from '../apollo-card/ApolloCard'
import KnxStateIcon from './components/KnxStateIcon'
import { Bedtime, Fireplace, LightMode, Air, type SvgIconComponent, ThermostatAuto } from '@mui/icons-material'

const icons: Record<string, SvgIconComponent> = {
  FrostProtection: Air,
  Comfort: Fireplace,
  Standby: LightMode,
  Economy: Bedtime,
}

export const Temperature: FC<Record<string, never>> = () => {
  const [updatedAt, setUpdatedAt] = useState<number>()

  return (
    <ApolloCard cardId='indoor-temp' banner={banner} zoomBanner={zoomBanner} updatedAt={updatedAt}>
      <table className='apollo-data-table'>
        <tbody>
          <KnxReading
            graph={{ historyKey: 'history', scaleX: 1, scaleY: 3 }}
            precision={2}
            onUpdate={setUpdatedAt}
            id='home.temp.bathroom-floor'
            label='Ba. floor'
            range={{ optimal: 25, lowest: 21, higest: 30 }}
            icon={
              <KnxStateIcon
                icon={payload => icons[payload.mode.bathroom.text] ?? ThermostatAuto}
                onUpdate={setUpdatedAt}
                id='heating'
                active={payload => payload.status.lazienkaPodloga.value === 1}
              />
            }
          />
          <KnxReading
            graph={{ historyKey: 'history', scaleX: 1, scaleY: 3 }}
            precision={2}
            onUpdate={setUpdatedAt}
            id='home.temp.livingroom'
            target={payload => Number(payload.setpoint).toFixed(1)}
            label='Livingroom'
            range={{ optimal: 25, lowest: 21, higest: 30 }}
            icon={
              <KnxStateIcon
                icon={payload => icons[payload.mode.livingroom.text] ?? ThermostatAuto}
                onUpdate={setUpdatedAt}
                id='heating'
                active={payload => payload.status.salon.value === 1}
              />
            }
          />
          <KnxReading
            graph={{ historyKey: 'history', scaleX: 1, scaleY: 3 }}
            precision={2}
            onUpdate={setUpdatedAt}
            id='home.temp.bedroom'
            target={payload => Number(payload.setpoint).toFixed(1)}
            label='Bedroom'
            range={{ optimal: 25, lowest: 21, higest: 30 }}
            icon={
              <KnxStateIcon
                icon={payload => icons[payload.mode.bedroom.text] ?? ThermostatAuto}
                onUpdate={setUpdatedAt}
                id='heating'
                active={payload => payload.status.sypialnia.value === 1}
              />
            }
          />
          <KnxReading
            graph={{ historyKey: 'history', scaleX: 1, scaleY: 3 }}
            precision={2}
            onUpdate={setUpdatedAt}
            id='home.temp.bathroom'
            target={payload => Number(payload.setpoint).toFixed(1)}
            label='Bathroom'
            range={{ optimal: 25, lowest: 21, higest: 30 }}
            icon={
              <KnxStateIcon
                icon={payload => icons[payload.mode.bathroom.text] ?? ThermostatAuto}
                onUpdate={setUpdatedAt}
                id='heating'
                active={payload => payload.status.lazienka.value === 1}
              />
            }
          />
        </tbody>
      </table>
    </ApolloCard>
  )
}
