export const toNumber = (text: string): number => {
  return +text.replaceAll(',', '')
}
