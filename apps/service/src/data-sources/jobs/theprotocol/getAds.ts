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
        cookie:
          'gp__cfXfiDZP=9; gptrackCookie=0e51a8a7-922c-4754-8806-88a90ad51648; __utmz=other; cp_core=1; cp_personalized=1; cp_comfortable=1; cp_advertisement=1; cp_watch=1; cp_social=1; cookiesPolicy=v3; _gcl_au=1.1.639454522.1780986812; _ga=GA1.1.1552466243.1780986812; _twpid=tw.1780986811790.605583738664313295; _fbp=fb.1.1780986811840.893315799753303281; _hjSessionUser_2833973=eyJpZCI6ImQwY2M4OTM2LTdkMjgtNTJkNS1iNDg4LWQ4OThhYzRkYjRlYSIsImNyZWF0ZWQiOjE3ODA5ODY4MTE5MTksImV4aXN0aW5nIjp0cnVlfQ==; __cf_bm=FNCYENCEYAuS6JIgm3WDqmJiSFkRMkMDFkYdGUFdY4o-1781678678.6174457-1.0.1.1-By3p2YZ17WIgtIzED_.RWhS9MNhXFsGaff1mvL2aupHEfPPmo5MnQze0lNuzdNqTD2ow9IyiB_paBEIrbpRFhWAbwsbtDAQ_iYA4gtP4u_ALotAQXHyEgJsM6zvDlLqB; _cfuvid=LU3EiCe.Qkd9BxzoWYEEv4Er8_m_bp1Xtk2HCM4ExQY-1781678678.6174457-1.0.1.1-DCfB1jkIhZeEtNsxzOO6n6.f38No4Rt6QdzzjlcwuCY; _stemantiforgery=CfDJ8CHz4u6jVN9JqX72tBhZssqqZ9MCAOkHR7LOIKkNtSApaPOlUw5ynpNPPxqe_Z16kd33P3xrzhAXWP39KQ4PkXCuzliG8T9JLzqC2M33mmpxtEv-PWGUIN2foWY6XSvz_Vc-XuV54qXlbziL6qVynpY; _gcl_gs=2.1.k1$i1781678678$u72017750; _hjSession_2833973=eyJpZCI6ImI4NTVkMmRmLWIyYzYtNDA0Zi1iOThkLWYxNjMxYzMyYjFmZSIsImMiOjE3ODE2Nzg2Nzk3NDAsInMiOjEsInIiOjEsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; __gfp_64b=a4MQBEyUPiv1MMdPMf_wGtByheze8nW9fU4TvGeNlL7.c7|1780986783|2|||8:2:32; _rdt_uuid=1780986811793.9c614589-911e-45d5-bb6b-40fd0a76bce6; cto_bundle=zIDYk19hOGZPZ2tqSjM5bkNKUTk0SUkxejJtQWM1bDJNN0RwcUJSNWtlN1olMkZZbG0xSG9vWlRaTUZscCUyQmFtaHh4Yzd3YUxGcFRGb2NaQ1dTaXBmNkd2JTJGYnBTMW5kMHBoMElHM2hoMzczdnJXRk9KUWt0Mk40VWxucXBxUVlFazdOQlFYbGhhZDUzRUpLRE56dm42YU5GJTJCcnFpdyUzRCUzRA; XSRF-TOKEN=CfDJ8CHz4u6jVN9JqX72tBhZssrum24HOxX6QZD-YeOF_yJnVF8R_dR4AdwR4DA7pON-dHd3t7PBinifwPQ3LhxiyDW4lGRxfvZCFz7lVnKqkQYjYRcXnGZWJppOxth7iF4POU-NRX36eF5gYUgdd_Z-fiA; _gcl_aw=GCL.1781679355.CjwKCAjw6MPRBhBTEiwAd-7Mr3CwTnX1cWhTREKUeP5bpJHkIADn8l2wYY6Di-UBacqeByBJhOXiRxoCYrUQAvD_BwE; _ga_Z6EL58B8FL=GS2.1.s1781678679$o2$g1$t1781679364$j7$l0$h0; _uetsid=038dbb806a1811f1a2e125bcf9637f10; _uetvid=223b8ae063cd11f18f30abd47427803f; gp_tr_pvid_root=ffd9aca8-b825-48e0-afac-618712ff3ddd; gp_tr_pvid_previous=ffd9aca8-b825-48e0-afac-618712ff3ddd',
        Referer: 'https://theprotocol.it/filtry/react.js,javascript;t/1;s/warszawa;wp/zdalna,hybrydowa;rw',
      },
      body: '{"typesOfContractIds":[],"positionLevelIds":[],"salaryFrom":"1","cities":["Warszawa"],"workModeCodes":["home-office","hybrid"],"onlyWithProjectDescription":false,"expectedTechnologies":["React.js","JavaScript"],"niceToHaveTechnologies":[],"excludedTechnologies":[],"regionsOfWorld":[],"keywords":[],"specializationsCodes":[],"isSupportingUkraine":false,"fromExternalLocations":true}',
      method: 'POST',
    },
  )

  if (!req.ok) {
    throw new Error('TheProtocol API request failed: ' + req.status)
  }

  const resp = (await req.json()) as SearchResults
  return resp.offers
}
