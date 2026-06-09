import { JobAd } from '@repo/types'
import { NoFluffJobsAd } from './types'
import { toJobAd } from './toJobAd'

const nfj: () => Promise<JobAd[]> = async () => {
  const req = await fetch(
    'https://nofluffjobs.com/api/search/posting?sort=salary-desc&withSalaryMatch=true&pageTo=1&pageSize=1000&salaryCurrency=PLN&salaryPeriod=month&region=pl&language=pl-PL',
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'no-cache',
        'content-type': 'application/infiniteSearch+json',
        'nfj-global-context':
          '{"region":"PL","lang":"pl","global_is_employer_logged_in":false,"global_is_candidate_logged_in":false,"global_internal_traffic":false,"global_partnerId":null,"global_partnerInternalTraffic":false,"global_url":"https://nofluffjobs.com/pl/warszawa/JavaScript?sort=salary-desc","global_windowResolution":"1211x1289","global_pixelRatio":2,"global_screenWidth":2560,"global_screenHeight":1410,"global_deviceCategory":"desktop","global_deviceFamily":"Mac OS","global_userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36","global_company_domain":null,"global_salary_match_enabled":true}',
        pragma: 'no-cache',
        priority: 'u=1, i',
      },
      body: '{"criteria":"","url":{"searchParam":"warszawa","searchParam2":"JavaScript"},"rawSearch":"warszawa JavaScript","pageSize":20,"withSalaryMatch":true}',
      method: 'POST',
    },
  )
  const postings = (await req.json()).postings as NoFluffJobsAd[]
  return postings.map(toJobAd)
}

export { nfj }
