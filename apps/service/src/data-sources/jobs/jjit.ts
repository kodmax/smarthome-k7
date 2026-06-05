import { myFetch } from '../../fetch'
import { FXRates, Job, PlnSalary, Skill } from '.';
import { noUwantedSkills } from './filters';

type SalaryCurrency = 'pln' | 'usd' | 'eur'
type Salary = { from: number; to: number; currency: SalaryCurrency }
type Location = {
    city: string
}
interface Details {
    skills: Skill[]
}

type Offer = {
    title: string
    id: string
    city: string
    skills: Skill[]
    remote: boolean
    employment_types: { type: string; salary: Salary }[]
    address_text: string
    company_logo_url: string
    company_name: string
    company_size: string
    display_offer: boolean
    experience_level: string
    workplace_type: string
    multilocation?: Location[]
    details?: Details
}

const jsDev: (skills: Offer['skills']) => boolean = skills => {
    return skills.some(skill =>
        skill.name.startsWith('React')
    )
}

const isB2b: (offer: Offer) => boolean = offer => {
    return offer.employment_types.find(et => et.type === 'b2b' && et.salary) !== void 0
}

const isFullyRemote: (offer: Offer) => boolean = offer =>
    offer.remote || offer.workplace_type === 'remote'

const isOfficeInBerlin: (offer: Offer) => boolean = offer =>
    offer.city === 'Berlin' ||
    offer.multilocation?.some(location => location.city === 'Berlin') ||
    offer.address_text.includes('Berlin') ||
    false

const salaryToPln = (salary: Salary, rates: { 'EUR/PLN': string, 'USD/PLN': string }): PlnSalary => {
    if (salary.currency === 'eur') {
        return {
            plnFrom: Math.round(salary.from * +rates['EUR/PLN']),
            plnTo: Math.round(salary.to * +rates['EUR/PLN'])
        }

    } else if (salary.currency === 'usd') {
        return {
            plnFrom: Math.round(salary.from * +rates['USD/PLN']),
            plnTo: Math.round(salary.to * +rates['USD/PLN'])
        }

    } else {
        return {
            plnFrom: salary.from,
            plnTo: salary.to
        }
    }
}

const jjit: (rates: FXRates) => Promise<Job[]> = async (rates) => {
    return myFetch('https://justjoin.it/api/offers', { accept: 'application/json' })
        .then(resp => JSON.parse(resp.toString('utf-8')))
        .then(async (offers: Offer[]) => {

            const jobs: Job[] = offers
                .filter(offer =>
                    offer.display_offer &&
                    jsDev(offer.skills) &&
                    noUwantedSkills(offer.skills) &&
                    isB2b(offer) &&
                    isFullyRemote(offer) &&
                    !isOfficeInBerlin(offer)
                )
                .map(offer => {
                    const b2b = offer.employment_types.find(et => et.type === 'b2b' && et.salary)
                    return {
                        advert_url: 'https://justjoin.it/offers/' + offer.id,
                        id: offer.id,
                        skills: offer.skills.sort((a, b) => b.level - a.level),
                        salary: b2b ? salaryToPln({
                            currency: b2b.salary.currency,
                            from: Math.round(b2b.salary.from),
                            to: Math.round(b2b.salary.to)
                        }, rates) : { plnFrom: 0, plnTo: 0 },
                        title: offer.title,
                        address_text: offer.address_text,
                        company_logo_url: offer.company_logo_url,
                        company_name: offer.company_name,
                    }
                })
                .filter(offer => offer.salary.plnFrom > 10000)
                .sort((a, b) => b.salary.plnTo - a.salary.plnTo)

            for (const top of jobs.slice(0, Math.floor(0.2 * jobs.length))) {
                const details = await myFetch('https://justjoin.it/api/offers/' + top.id)
                    .then(resp => JSON.parse(resp.toString('utf-8')) as Details)

                top.skills = details.skills.sort((a, b) => b.level - a.level)
            }

            return jobs.filter(offer => noUwantedSkills(offer.skills))
        })
}

export { jjit }
