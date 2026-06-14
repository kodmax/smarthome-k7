import { icons } from './allergen-icons'
import { type FC } from 'react'
import { Warning } from './Warning'
import { AllergenData } from '@repo/types'
import { Icon } from './styled'

export const Allergen: FC<{ data: AllergenData }> = ({ data }) => {
  return (
    <tr>
      <td>
        <Icon style={{ backgroundImage: `url("${icons[data.id]}")` }} /> {data.name}{' '}
        <Warning intensity={data.intensity} />
      </td>
      <td>{data.intensity}</td>
    </tr>
  )
}
