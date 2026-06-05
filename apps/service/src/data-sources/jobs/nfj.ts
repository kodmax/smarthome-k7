import { myFetch } from '../../fetch'
import { JSDOM } from 'jsdom'
import { Job, Skill } from '.'

import { getTextContent } from '../utils/get-text-context'
import { noUwantedSkills } from './filters'

type Details = {
    logoUrl: string
    skills: Skill[]
}

const getDetails = async (url: string): Promise<Details> => {
    return myFetch(url, { accept: 'text/html' })
        .then(resp => resp.toString('utf-8')).then(async html => {
            const document = new JSDOM(html).window.document

            return {
                skills: Array.from(document.querySelectorAll('section[branch="musts"] li')).map(li => ({
                    name: li.textContent?.trim() ?? '', level: 4
                })),
                logoUrl: document.querySelector('img[src*=logos]')?.getAttribute('src') ?? ''
            }
        })
}

const nfj: (salary: number) => Promise<Job[]> = async (salary) => {
    const url = `https://nofluffjobs.com/pl/praca-zdalna/React?criteria=employment%3Db2b%20%20salary%3Epln${salary}m&page=1`
    return myFetch(url, { accept: 'text/html' })
        .then(resp => resp.toString('utf-8')).then(async html => {
            const document = new JSDOM(html).window.document
            const offers: Array<Job> = []

            for (const advert of Array.from(document.querySelectorAll('nfj-postings-list > .list-container > a'))) {
                try {
                    const advert_url = new URL(advert.getAttribute('href') ?? '', 'https://nofluffjobs.com/').toString()
                    const { skills, logoUrl } = await getDetails(advert_url)
    
                    const salary = getTextContent(advert, '.salary').replace(/\s/g, '')
                    const [plnFrom, plnTo] = salary.substring(0, salary.length - 3).split('–')
    
                    offers.push({
                        advert_url,
                        title: getTextContent(advert, '.posting-title__position'),
                        id: advert.getAttribute('id') ?? '',
    
                        company_name: getTextContent(advert, '.posting-title__company'),
                        salary: { plnFrom: +plnFrom, plnTo: +plnTo },
                        company_logo_url: logoUrl,
                        skills
                    })
    
                } catch (e) {
                    // ignore
                }
            }

            return offers.filter(job =>
                noUwantedSkills(job.skills)
            )
        })
}

export { nfj }
