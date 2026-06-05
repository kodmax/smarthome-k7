import { type FC } from 'react'

const TablePlaceholder: FC<{ rows: number; graph: boolean; value: boolean }> = ({ rows, graph, value }) => {
    return (
        <table style={{ width: '100%' }}>
            <tbody>
                { [...new Array(rows).keys()].map(i => (
                    <tr key={i}>
                        <td>
                            <span style={{ background: 'hsl(0deg 0% 50% / 10%)', width: graph ? '50%' : value ? '80%' : '100%', display: 'inline-block' }}>
                                &nbsp;
                            </span>
                        </td>
                        {!graph
                            ? null
                            : (<td style={{ width: '4em' }}>
                                <span style={{ background: 'hsl(0deg 0% 50% / 10%)', width: '80%', display: 'inline-block' }}>&nbsp;</span>
                            </td>)}
                        {!value
                            ? null
                            : (<td style={{ width: '20%' }}>
                                <span style={{ background: 'hsl(0deg 0% 50% / 10%)', width: '80%', display: 'inline-block' }}>&nbsp;</span>
                            </td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TablePlaceholder
