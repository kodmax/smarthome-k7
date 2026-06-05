import * as mariadb from "mariadb";

const pool = mariadb.createPool({
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
});

export default pool;

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
