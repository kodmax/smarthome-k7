import { icons } from '@repo/weather-icons'
import { type FC } from 'react'
import styled from '@emotion/styled'
import { DayWrapper } from './WeekView'

export type DayWeatherForecast = {
    temp: { high: number; low: number }
    date: string
    dow: string
    icon: string
}

const Icon = styled('div')({
    width: '2.5em',
    height: '2.5em'
})

const Day: FC<{ forecast?: DayWeatherForecast }> = ({ forecast }) => {
    return (
        <DayWrapper>
            <div>
                <div style={{ display: 'flex', justifyContent: 'left', padding: '0.666em 0.666em 0' }}>
                    <div style= {{ paddingRight: '1em' }}>
                        <Icon style={ forecast ? { backgroundImage: `url('${icons [forecast.icon]}')`, backgroundSize: 'contain' } : { background: 'hsl(0deg 0% 50% / 10%)' }}></Icon>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        { forecast ? (
                            <>
                                <div>{Number(forecast.temp.high).toFixed(0)} / {Number(forecast.temp.low).toFixed(0)} °C</div>
                                <div style={{ fontSize: '0.7em' }}>{forecast.dow} {forecast.date}</div>
                            </>
                        ) : (
                            <>
                                <div style={{ background: 'hsl(0deg 0% 50% / 10%)', width: '5em' }}>&nbsp;</div>
                                <div style={{ fontSize: '0.7em', background: 'hsl(0deg 0% 50% / 10%)', width: '5em' }}>&nbsp;</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DayWrapper>
    )
}

const DayPlaceholder: FC = () => {
    return <Day />
}

export { Day, DayPlaceholder }
