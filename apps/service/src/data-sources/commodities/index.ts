import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import DateTime from '../../DateTime'
import { Inject } from '@/di'
import type { Pool } from 'mariadb'
import { fetchBtcPrice } from './btc'
import { fetchCoalPrice } from './coal'
import { fetchGoldPrice } from './gold'
import { fetchInflationData } from './inflation'
import { fetchNaturalGasPrice } from './natural-gas'
import { fetchOilPrice } from './oil'
import { Commodities } from './types'

export class CommoditiesSource extends DataSourceDefinition<Commodities> {
  @Inject('db')
  declare private db: Pool
  getId() {
    return 'commodities'
  }

  getCron() {
    return '15 * * * *'
  }

  getCacheTTL() {
    return CacheAgeUnit.MINUTES * 30
  }

  async getData() {
    const [oil, ng, coal, btc, gold, inflation] = await Promise.all([
      fetchOilPrice(),
      fetchNaturalGasPrice(),
      fetchCoalPrice(),
      fetchBtcPrice(),
      fetchGoldPrice(),
      fetchInflationData(),
    ])

    const timeWindow = DateTime.shift(-30, DateTime.DAY).getDateTime()
    const now = DateTime.now().getDateTime()
    const conn = await this.db.getConnection()

    try {
      await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [now, 'OIL/l', oil.l])
      await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [now, 'NG/GJ', ng.GJ])
      await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [now, 'COAL/t', coal.ton])
      await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [now, 'GOLD/g', gold.g])
      await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [now, 'BTC/USD', btc.usd])

      return {
        inflation,
        oil: {
          ...oil,
          history: await conn.query(
            'select price, datetime from commodities where name=? and datetime >= ? order by datetime; ',
            ['OIL/l', timeWindow],
          ),
        },
        ng: {
          ...ng,
          history: await conn.query(
            'select price, datetime from commodities where name=? and datetime >= ? order by datetime; ',
            ['NG/GJ', timeWindow],
          ),
        },
        coal: {
          ...coal,
          history: await conn.query(
            'select price, datetime from commodities where name=? and datetime >= ? order by datetime; ',
            ['COAL/t', timeWindow],
          ),
        },
        gold: {
          ...gold,
          history: await conn.query(
            'select price, datetime from commodities where name=? and datetime >= ? order by datetime; ',
            ['GOLD/g', timeWindow],
          ),
        },
        btc: {
          ...btc,
          history: await conn.query(
            'select price, datetime from commodities where name=? and datetime >= ? order by datetime; ',
            ['BTC/USD', timeWindow],
          ),
        },
      }
    } finally {
      conn.release()
    }
  }
}

export type { Commodities }
