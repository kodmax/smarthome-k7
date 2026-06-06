import { CacheAgeUnit, DataSourceDefinition } from 'apollo-ws'
import DateTime from '../../DateTime'
import db from '../../db'
import { fetchBtcPrice } from './btc'
import { fetchCoalPrice } from './coal'
import { fetchGoldPrice } from './gold'
import { fetchInflationData } from './inflation'
import { fetchNaturalGasPrice } from './natural-gas'
import { fetchOilPrice } from './oil'
import { Commodities } from './types'

export const source: DataSourceDefinition<Commodities> = {
  expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 30,
  cron: '15 * * * *',
  id: 'commodities',

  script: async () => {
    const [oil, ng, coal, btc, gold, inflation] = await Promise.all([
      fetchOilPrice(),
      fetchNaturalGasPrice(),
      fetchCoalPrice(),
      fetchBtcPrice(),
      fetchGoldPrice(),
      fetchInflationData(),
    ])

    const timeWindow = new DateTime(-30, CacheAgeUnit.DAYS).getDateTime()
    const now = new DateTime().getDateTime()
    const conn = await db.getConnection()

    try {
      await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [now, 'OIL/l', oil.l])
      await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [now, 'NG/GJ', ng.GJ])
      await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [now, 'COAL/t', coal.ton])
      await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [now, 'GOLD/g', gold.g])
      await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [now, 'BTC/USD', btc.usd])

      btc.history = await conn.query(
        'select price, datetime from commodities where name=? and datetime >= ? order by datetime; ',
        ['BTC/USD', timeWindow],
      )
      coal.history = await conn.query(
        'select price, datetime from commodities where name=? and datetime >= ? order by datetime; ',
        ['COAL/t', timeWindow],
      )
      gold.history = await conn.query(
        'select price, datetime from commodities where name=? and datetime >= ? order by datetime; ',
        ['GOLD/g', timeWindow],
      )
      oil.history = await conn.query(
        'select price, datetime from commodities where name=? and datetime >= ? order by datetime; ',
        ['OIL/l', timeWindow],
      )
      ng.history = await conn.query(
        'select price, datetime from commodities where name=? and datetime >= ? order by datetime; ',
        ['NG/GJ', timeWindow],
      )
    } finally {
      await conn.end()
    }

    return { inflation, oil, ng, coal, gold, btc }
  },
}

export type { Commodities }
