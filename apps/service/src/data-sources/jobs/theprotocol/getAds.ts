import { config } from '@/config'
import { SearchResults } from './types'

export const getAds = async () => {
  const req = await fetch(
    'https://apus-api.theprotocol.it/offers/_search?pageNumber=1&orderby.field=Relevance&pageSize=50',
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        priority: 'u=1, i',
        'sec-ch-ua': '"Google Chrome";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'x-application-name': 'theprotocol-offers',
        'x-application-version': '4.4.1358',
        'x-xsrf-token':
          'CfDJ8CHz4u6jVN9JqX72tBhZssrum24HOxX6QZD-YeOF_yJnVF8R_dR4AdwR4DA7pON-dHd3t7PBinifwPQ3LhxiyDW4lGRxfvZCFz7lVnKqkQYjYRcXnGZWJppOxth7iF4POU-NRX36eF5gYUgdd_Z-fiA',
        cookie: config.jobs.theprotocolCookie,
        Referer: 'https://theprotocol.it/filtry/react.js,javascript;t/1;s/warszawa;wp/zdalna,hybrydowa,stacjonarna;rw',
      },
      body: '{"typesOfContractIds":[],"positionLevelIds":[],"salaryFrom":"1","cities":["Warszawa"],"workModeCodes":["home-office","hybrid","full-office"],"onlyWithProjectDescription":false,"expectedTechnologies":["React.js","JavaScript"],"niceToHaveTechnologies":[],"excludedTechnologies":[],"regionsOfWorld":[],"keywords":[],"specializationsCodes":[],"isSupportingUkraine":false,"fromExternalLocations":true}',
      method: 'POST',
    },
  )

  if (!req.ok) {
    throw new Error('TheProtocol API request failed: ' + req.status)
  }

  const resp = (await req.json()) as SearchResults
  return resp.offers
}
