import * as mariadb from 'mariadb'
import { config } from './config'

const pool = mariadb.createPool({ ...config.db })

export default pool

// export default {
//     getConnection: () => ({
//         query: async (q: string, p: any[]): Promise<any[]> => {
//             console.log('QUERY:', q, p)

//             return []
//         },
//         end: async (): Promise<void> => {
//             console.log('CONN END')
//         }
//     })
// }
