export const nfjDedupKey = (companyName: string, title: string): string =>
  `${companyName.toLocaleLowerCase()} -- ${title.toLocaleUpperCase()}`
