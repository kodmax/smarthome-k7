import { type FC, useEffect } from 'react'
import { type SvgIconComponent } from '@mui/icons-material'
import { useUpdate } from '@repo/feed-client'
import type { KnxValue } from './KnxReading'

type KnxStateIconProps = {
    id: string
    onUpdate: (ts: number) => void
    active?: (payload: KnxValue) => boolean
    visible?: (payload: KnxValue) => boolean
    icon: (payload: KnxValue) => SvgIconComponent
    opacity?: (payload: any) => number
}
const KnxStateIcon: FC<KnxStateIconProps> = ({
    id,
    onUpdate,
    active = () => false,
    icon,
    opacity = () => 1,
    visible = () => true
}) => {
    const [reading, updatedAt] = useUpdate<KnxValue>(id)

    useEffect(() => {
        onUpdate(new Date().getTime())
    }, [updatedAt])

    if (reading) {
        const isActive = active(reading)
        const Icon = icon(reading)

        return (
            <Icon sx={{
                paddingRight: '0.1em',
                width: '0.7em',
                height: '0.7em',
                color: isActive ? 'red' : '#636363',
                fontSize: 'inherit',
                visibility: visible(reading) ? 'visible' : 'hidden',
                opacity: opacity(reading)
            }} />
        )

    } else {
        return null
    }
}

export default KnxStateIcon
