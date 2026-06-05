import { type FC, useEffect } from 'react'
import { ColorIndicator } from './ColorIndication'
import { optimalHumidityRange } from '../../lib'
import { useUpdate } from '@repo/feed-client'

const Humidity: FC<{ label: string; onUpdate: (ts: number) => void }> = ({ label, onUpdate }) => {
    const [relativeHumidity, humUpdate] = useUpdate<{ value: number; text: string }>('home.air-quality.humidity')
    const [temp, tempUpdate] = useUpdate<{ value: number; text: string }>('home.temp.bedroom')

    useEffect(() => {
        onUpdate(new Date().getTime())
    }, [humUpdate, tempUpdate])

    if (relativeHumidity && temp) {
        return (<tr><td>{label}</td><td></td><td></td><td>
            <ColorIndicator instant={relativeHumidity.value} range={optimalHumidityRange} />
            {relativeHumidity.value.toFixed(0)}%
        </td></tr>)

    } else {
        return (<tr><td>{label}</td><td></td><td></td><td>--</td></tr>)
    }
}

export default Humidity
