import { NoFluffJobsAd } from './types'
import { config } from '../../../config'

export const getHybridPostings = async (): Promise<NoFluffJobsAd[]> => {
  const req = await fetch(
    'https://nofluffjobs.com/api/search/posting?pageFrom=1&withSalaryMatch=true&pageTo=1&pageSize=1000&salaryCurrency=PLN&salaryPeriod=month&region=pl&language=pl-PL',
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'no-cache',
        'content-type': 'application/infiniteSearch+json',
        'nfj-global-context':
          '{"region":"PL","lang":"pl","global_is_employer_logged_in":false,"global_is_candidate_logged_in":false,"global_internal_traffic":false,"global_partnerId":null,"global_partnerInternalTraffic":false,"global_url":"https://nofluffjobs.com/pl/praca-zdalna/frontend?criteria=city%3Dwarszawa%20%20keyword%3Djava-script","global_windowResolution":"1211x1289","global_pixelRatio":2,"global_screenWidth":2560,"global_screenHeight":1410,"global_deviceCategory":"desktop","global_deviceFamily":"Mac OS","global_userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36","global_company_domain":null,"global_salary_match_enabled":true}',
        pragma: 'no-cache',
        priority: 'u=1, i',
        'sec-ch-ua': '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        cookie: config.jobs.nfjCookie,
        Referer: 'https://nofluffjobs.com/pl/praca-zdalna/frontend?criteria=city%3Dwarszawa%20%20keyword%3Djava-script',
      },
      body: '{"criteriaSearch":{"country":[],"withSalaryMatch":[],"city":["hybrid","warszawa"],"more":[],"employment":[],"requirement":[],"salary":[],"jobPosition":[],"applicationStatus":[],"province":[],"company":[],"id":[],"category":["frontend"],"keyword":["java-script"],"jobLanguage":[],"seniority":[]},"pageSize":1000,"withSalaryMatch":true}',
      method: 'POST',
    },
  )

  return (await req.json()).postings as NoFluffJobsAd[]
}
