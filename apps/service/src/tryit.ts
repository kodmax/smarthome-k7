import { source } from './data-sources/jobs'

source.script().then(jobData => {
  for (const ad of jobData.ads) {
    console.log(ad.companyName, ad.employmentType, ad.title, ad.monthlySalaryRangeAfterTaxes?.to, ad.requiredSkills)
  }
})
