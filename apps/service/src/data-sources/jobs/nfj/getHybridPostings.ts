import { NoFluffJobsAd } from './types'

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
        cookie:
          'nfj_new_user=true; nfj_visited_pl=true; _tt_enable_cookie=1; _ttp=01KTNHBWSJT0252CA9S4HJX7RZ_.tt.1; notificationsSeen=%7B%22date%22%3A%222026-06-09T06%3A33%3A25.463Z%22%7D; nfj_selected_region=PL; lastSearches=true; country_iso=PL; _ga=GA1.1.1490145457.1780986808; _gcl_au=1.1.60024977.1780987934; FPID=FPID2.2.cmaDalp%2FkMkI%2FFDBJgszO70I0ojPt2HAVLhUbUcqNlU%3D.1780986808; nfj_user_id=66f4d6ef-cba8-4918-9cec-0eec7d086bfd; _fbp=fb.1.1780987933648.844397978303719721; hubspotutk=269e52ec181eb3a98bbf7ff0980721f2; __hssrc=1; nfj_consents={%22consent_initialized%22:true%2C%22consent_analytics_storage%22:true%2C%22consent_ad_storage%22:true%2C%22consent_functionality_storage%22:true%2C%22uc_interaction_style%22:%22CMP_ELIGIBLE%22%2C%22consent_initialized_date%22:%222026-06-09T06:52:13.573Z%22%2C%22consent_ad_storage_date%22:%222026-06-09T06:52:13.573Z%22%2C%22consent_functionality_storage_date%22:%222026-06-09T06:52:13.573Z%22%2C%22consent_analytics_storage_date%22:%222026-06-09T06:52:13.573Z%22%2C%22first_consent_selection%22:false%2C%22consent_selection_date%22:%222026-06-09T06:52:13.573Z%22%2C%22prev_consent_initialized%22:false%2C%22prev_consent_initialized_date%22:%222026-06-09T06:33:19.973Z%22%2C%22prev_consent_ad_storage%22:false%2C%22prev_consent_ad_storage_date%22:%222026-06-09T06:33:19.973Z%22%2C%22prev_consent_functionality_storage%22:false%2C%22prev_consent_functionality_storage_date%22:%222026-06-09T06:33:19.973Z%22%2C%22prev_consent_analytics_storage%22:false%2C%22prev_consent_analytics_storage_date%22:%222026-06-09T06:33:19.973Z%22%2C%22uc_controller_id%22:%22dea484774053c1d76a818ad1e75e8c39b3fd9be58e9c110323b600a5aa18406d%22%2C%22prev_consent_selection_date%22:%222026-06-09T06:33:19.973Z%22}; _hjSessionUser_812170=eyJpZCI6ImZlN2MwODU2LWVjNDItNWQ5Ny04M2RkLTg3MzU5ODEzY2IzZiIsImNyZWF0ZWQiOjE3ODA5ODgxMTc5NDQsImV4aXN0aW5nIjp0cnVlfQ==; AMP_MKTG_53ff6cd964=JTdCJTIycmVmZXJyZXIlMjIlM0ElMjJodHRwJTNBJTJGJTJGMTkyLjE2OC4xLjIlMkYlMjIlMkMlMjJyZWZlcnJpbmdfZG9tYWluJTIyJTNBJTIyMTkyLjE2OC4xLjIlMjIlN0Q=; nfj_session_id=44209b08-d444-4e88-838b-3a08445cb653.1781162450840; FPLC=%2FaINxYYBB02XZrEGQbBwafDNyxRGY0t1kxEdB64ycp6CgDR2eLJYZBVKkc5%2FdoY8qAynVj2nGt4epoM5bzhfCaHj3zq%2BqRd962NEX4WwYk2vA%2FDlsKp3ldOeN%2FUKQQ%3D%3D; _hjSession_812170=eyJpZCI6Ijk4ZDczZmVhLWY5ODQtNDhlZC1hZGFkLWMwN2E4NDViZmM0YiIsImMiOjE3ODExNjI0NTE4OTIsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MX0=; _clck=1ad5bau%5E2%5Eg6t%5E1%5E2351; __hstc=208773133.269e52ec181eb3a98bbf7ff0980721f2.1780987933680.1780991746622.1781162452300.3; AMP_53ff6cd964=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI2NmY0ZDZlZi1jYmE4LTQ5MTgtOWNlYy0wZWVjN2QwODZiZmQlMjIlMkMlMjJzZXNzaW9uSWQlMjIlM0ExNzgxMTYyNDUwODQwJTJDJTIyb3B0T3V0JTIyJTNBZmFsc2UlN0Q=; _uetsid=13a501a0656611f18ca96f86be81b92f; _uetvid=bec68f3063cf11f1bd967990ee255e83; __hssc=208773133.12.1781162452300; _ga_5PDJ59CV4Z=GS2.1.s1781163024$o3$g1$t1781163755$j60$l0$h0; ttcsid_CCG6ARBC77U5BD5RGMRG=1781162452087::lCkBE2e8p9buY4df-2IF.2.1781164080795.1; _rdt_uuid=1780988117746.ff6e4a20-6078-45e1-a208-16c4b7372e3a; nfj_last=1781164080902; ttcsid_CC6UFG3C77U8CH3DVPCG=1781162452088::vPM6OjPrLfBMtXjDV1ue.2.1781164080923.1; FPGSID=1.1781162451.1781164081.G-DSCQ13PWC7.cePpHBgaJ1pAOU7P5kStaA; _clsk=18n7zyk%5E1781164081585%5E36%5E1%5Ej.clarity.ms%2Fcollect; _ga_LZ1Z44GBST=GS2.1.s1781162452$o3$g1$t1781164081$j60$l0$h1506877784; _ga_12X30JD6T4=GS2.1.s1781162451$o3$g1$t1781164081$j60$l0$h0; ttcsid=1781162452087::StK94iVVosptyk-lLhRH.2.1781164080923.0::1.1628702.1178998::1634612.38.54.1160::1211924.114.0; _ga_DSCQ13PWC7=GS2.1.s1781162451$o3$g1$t1781164086$j54$l0$h1946137353',
        Referer: 'https://nofluffjobs.com/pl/praca-zdalna/frontend?criteria=city%3Dwarszawa%20%20keyword%3Djava-script',
      },
      body: '{"criteriaSearch":{"country":[],"withSalaryMatch":[],"city":["hybrid","warszawa"],"more":[],"employment":[],"requirement":[],"salary":[],"jobPosition":[],"applicationStatus":[],"province":[],"company":[],"id":[],"category":["frontend"],"keyword":["java-script"],"jobLanguage":[],"seniority":[]},"pageSize":1000,"withSalaryMatch":true}',
      method: 'POST',
    },
  )

  return (await req.json()).postings as NoFluffJobsAd[]
}
