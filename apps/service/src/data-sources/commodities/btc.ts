import { getNumberContent } from '../utils/get-number-content'
import { myFetch } from '../../fetch'
import { JSDOM } from 'jsdom'

type BtcPrice = {
    usd: string
    history?: History
}

const fetchBtcPrice = async (): Promise<BtcPrice> => {
    return myFetch('https://www.cnbc.com/quotes/BTC.BS=', { accept: 'text/html' }).then(response => response.toString('utf-8')).then(html => {
        const document = new JSDOM(html).window.document
        const usd = getNumberContent(document.body, '.QuoteStrip-lastPrice').toFixed(2)

        return {
            usd
        }
    })
}

export type { BtcPrice }
export { fetchBtcPrice }
