import { ApolloTableCell, ApolloTableRow } from '@/card-components'
import { icons } from './allergen-icons'
import { type FC } from 'react'
import { Warning } from './Warning'
import { AllergenData } from '@repo/types'
import { Icon } from './styled'

export const Allergen: FC<{ data: AllergenData }> = ({ data }) => {
  return (
    <ApolloTableRow>
      <ApolloTableCell>
        <Icon style={{ backgroundImage: `url("${icons[data.id]}")` }} /> {data.name}{' '}
        <Warning intensity={data.intensity} />
      </ApolloTableCell>
      <ApolloTableCell>{data.intensity}</ApolloTableCell>
    </ApolloTableRow>
  )
}
