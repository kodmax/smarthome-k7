import { type FC } from 'react'
import banner from './card-banners/hourly.jpg'
import zoomBanner from './card-banners/hourly-zoom.jpg'
import { icons } from '@repo/weather-icons'
import ApolloCard from '../../apollo-card/ApolloCard'
import { styled } from '@mui/material'
import { useUpdate } from '@repo/feed-client'

export type HourWeatherForecast = {
    precipIcon: string
    precip: string
    temp: string
    icon: string
    hour: string
    sun: {
        altitude: number
        azimuth: number
    }
}

const AuraIcon = styled('span')({
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    position: 'absolute',
    display: 'block',

    left: 'calc(50% - 0.75em)',
    height: '1.5em',
    width: '1.5em',
    top: '0'
})

const PercipIcon = styled('span')({
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    display: 'inline-block',
    width: '0.666em',
    height: '0.666em'
})

export const HourlyWeatherForecast: FC<Record<string, never>> = () => {
    const [forecast, updatedAt] = useUpdate<{ hourly: HourWeatherForecast[] }>('weather', { hourly: [] })

    return (
        <ApolloCard cardId='hourly-weather-forecast' banner={banner} zoomBanner={zoomBanner} updatedAt={updatedAt}>
            <div style={{ textAlign: 'center', overflowX: 'auto' }}>
                <table style={{ marginLeft: 'auto', borderSpacing: '1em 0' }}>
                    <tbody>
                        <tr>
                            {forecast?.hourly.map((fc: HourWeatherForecast) => (
                                <td key={fc.hour} style={{ minWidth: '3em', maxWidth: '3em', fontSize: '0.7em' }}>{fc.hour}</td>
                            ))}
                        </tr>
                        <tr>
                            {forecast?.hourly.map((fc: HourWeatherForecast) => (
                                <td key={fc.hour} style={{ position: 'relative', overflow: 'visible' }}>
                                    <AuraIcon style={{ backgroundImage: `url('${icons [fc.icon]}')` }} />
                                    &nbsp;
                                </td>
                            ))}
                        </tr>
                        <tr>
                            {forecast?.hourly.map((fc: HourWeatherForecast) => (
                                <td key={fc.hour} style={{ fontSize: '0.7em' }}>{Number(fc.temp).toFixed(0)} °C</td>
                            ))}
                        </tr>
                        <tr>
                            {forecast?.hourly.map((fc: HourWeatherForecast) => (
                                <td key={fc.hour} style={{ fontSize: '0.7em', lineHeight: '1.2em' }}>
                                    <PercipIcon style={{ backgroundImage: `url('${icons [fc.precipIcon]}')` }} />
                                    <span>{fc.precip}</span>
                                </td>
                            ))}
                        </tr>
                        <tr>
                            {forecast?.hourly.map((fc: HourWeatherForecast) => (
                                <td key={fc.hour} style={{ fontSize: '0.5em' }}>{Number(fc.sun.altitude).toFixed(0)}°</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </ApolloCard>
    )
}
