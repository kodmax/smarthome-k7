export const buildJobAdDedupKey = (companyName: string, title: string): string =>
  `${companyName.toLocaleLowerCase()} -- ${title.toLocaleUpperCase()}`
