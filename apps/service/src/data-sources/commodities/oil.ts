import { getNumberContent } from '../utils/get-number-content'
import { myFetch } from '../../fetch'
import { JSDOM } from 'jsdom'

type OilPrice = {
    l: string
    history?: History
}

const fetchOilPrice = async (): Promise<OilPrice> => {
    return myFetch('https://www.cnbc.com/quotes/@CL.1', { accept: 'text/html' }).then(response => response.toString('utf-8')).then(html => {
        const document = new JSDOM(html).window.document

        return {
            l: (getNumberContent(document.body, '.QuoteStrip-lastPrice') / 159).toFixed(2)
        }
    })
}

export type { OilPrice }
export { fetchOilPrice }
