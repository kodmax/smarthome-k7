import banner from './card-banners/interest-rates.jpg'
import ApolloCard from '../apollo-card/ApolloCard'
import { Graph } from './components/Graph'
import TablePlaceholder from './components/TablePlaceholder'
import useUpdate from '../feed/use-update'
import { type FC } from 'react'

export const Wibor: FC<Record<string, never>> = () => {
    const [reading, updatedAt] = useUpdate<any>('irs')

    return (
        <ApolloCard cardId='interest-rates' banner={banner} updatedAt={updatedAt}>
            { !reading ? (<TablePlaceholder rows={4} graph={true} value={true} />) : (
                <table className='apollo-data-table'>
                    <tbody>
                        <tr>
                            <td>Stopa ref.</td>
                            <td style={{ width: '4em', padding: 0 }}><Graph data={reading['NBP Ref.'].history} scaleX={30} scaleY={1} valueKey='rate' /></td>
                            <td>{reading['NBP Ref.'].current} %</td>
                        </tr>
                        <tr>
                            <td>Wibor 1M</td>
                            <td style={{ width: '4em', padding: 0 }}><Graph data={reading['WIBOR 1M'].history} scaleX={30} scaleY={1} valueKey='rate' /></td>
                            <td>{reading['WIBOR 1M'].current} %</td>
                        </tr>
                        <tr>
                            <td>Wibor 3M</td>
                            <td style={{ width: '4em', padding: 0 }}><Graph data={reading['WIBOR 3M'].history} scaleX={30} scaleY={1} valueKey='rate' /></td>
                            <td>{reading['WIBOR 3M'].current} %</td>
                        </tr>
                        <tr>
                            <td>Wibor 6M</td>
                            <td style={{ width: '4em', padding: 0 }}><Graph data={reading['WIBOR 6M'].history} scaleX={30} scaleY={1} valueKey='rate' /></td>
                            <td>{reading['WIBOR 6M'].current} %</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </ApolloCard>
    )
}
