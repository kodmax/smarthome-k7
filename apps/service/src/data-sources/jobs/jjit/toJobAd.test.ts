import { describe, expect, it } from 'vitest'
import { toJobAd } from './toJobAd'
import { JustJoinAd } from './types'

const jjAd: JustJoinAd = {
  guid: '9c7585ec-bd78-43c7-8ae9-ee898c903012',
  slug: 'monday-com-software-engineering-team-lead-warszawa-javascript',
  title: 'Engineering Manager',
  workplaceType: 'hybrid',
  experienceLevel: 'manager',
  city: 'Warszawa',
  street: 'Koszykowa 61',
  companyName: 'monday.com',
  companyLogoThumbUrl:
    'https://imgproxy.justjoinit.tech/sQgzpDduSI0zS-UcDOGzDZTxJKQkAHYIujhI4twV9QE/h:200/w:200/plain/https://public.justjoin.it/companies/logos/original/02cc7c8b1d0284ab57c9626729673434e5197f24.png',
  employmentTypes: [
    {
      from: 50000,
      fromPerUnit: 50000,
      to: 67000,
      toPerUnit: 67000,
      currency: 'PLN',
      currencySource: 'original',
      type: 'permanent',
      unit: 'Month',
      gross: true,
    },
    {
      from: 13825,
      fromPerUnit: 13824.7573755081,
      to: 18525,
      toPerUnit: 18525.1748831808,
      currency: 'USD',
      currencySource: 'conversion',
      type: 'permanent',
      unit: 'Month',
      gross: true,
    },
    {
      from: 11771,
      fromPerUnit: 11770.7990018363,
      to: 15773,
      toPerUnit: 15772.8706624606,
      currency: 'EUR',
      currencySource: 'conversion',
      type: 'permanent',
      unit: 'Month',
      gross: true,
    },
    {
      from: 10792,
      fromPerUnit: 10792.1433196633,
      to: 14461,
      toPerUnit: 14461.4720483488,
      currency: 'CHF',
      currencySource: 'conversion',
      type: 'permanent',
      unit: 'Month',
      gross: true,
    },
    {
      from: 10218,
      fromPerUnit: 10217.6356391131,
      to: 13692,
      toPerUnit: 13691.6317564116,
      currency: 'GBP',
      currencySource: 'conversion',
      type: 'permanent',
      unit: 'Month',
      gross: true,
    },
  ],
  requiredSkills: [
    {
      name: 'AWS',
      level: 3,
    },
    {
      name: 'TypeScript',
      level: 3,
    },
    {
      name: 'Node.js',
      level: 3,
    },
    {
      name: 'React',
      level: 3,
    },
    {
      name: 'SQL',
      level: 3,
    },
    {
      name: 'SQS/SNS/Kafka',
      level: 1,
    },
    {
      name: 'NoSQL',
      level: 1,
    },
  ],
  niceToHaveSkills: [],
}

describe('toJobAd', () => {
  it('should convert justjoin ad to standard JobAd', () => {
    expect(toJobAd(jjAd)).toEqual({
      id: '9c7585ec-bd78-43c7-8ae9-ee898c903012',
      isUnwantedCompany: true,
      title: 'Engineering Manager',
      advertUrl: 'https://justjoin.it/job-offer/monday-com-software-engineering-team-lead-warszawa-javascript',
      companyLogoUrl:
        'https://imgproxy.justjoinit.tech/sQgzpDduSI0zS-UcDOGzDZTxJKQkAHYIujhI4twV9QE/h:200/w:200/plain/https://public.justjoin.it/companies/logos/original/02cc7c8b1d0284ab57c9626729673434e5197f24.png',
      companyName: 'monday.com',
      requiredSkills: ['AWS', 'TypeScript', 'Node.js', 'React', 'SQL', 'SQS/SNS/Kafka', 'NoSQL'],
      workplaceType: 'hybrid',
      employmentType: 'permanent',
      origin: 'jj',
      monthlySalaryRangeAfterTaxes: {
        from: 30000,
        to: 40200,
      },
    })
  })
})
