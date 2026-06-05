import { styled } from '@mui/system'
import { icons } from './allergen-icons'
import { type FC } from 'react'

export type AllergenData = {
    intensity: string
    name: string
    id: string
}

const Warning: FC<{ intensity: string }> = ({ intensity }) => {
    if (intensity === 'Wysokie') {
        return (
            <span style={{ marginLeft: 2, color: 'hsl(0deg 100% 50%', fontWeight: 'bold' }}>⚠️</span>
        )

    } else {
        return null
    }
}

const Icon = styled('span')({
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    verticalAlign: 'middle',
    display: 'inline-block',
    marginRight: '0.2em',
    height: '1em',
    width: '1em'
})

export const Allergen: FC<{ data: AllergenData }> = ({ data }) => {
    return (
        <tr>
            <td>
                <Icon style={{ backgroundImage: `url('${icons [data.id]}')` }} /> {data.name} <Warning intensity={data.intensity} />
            </td>
            <td>
                {data.intensity}
            </td>
        </tr>
    )
}
