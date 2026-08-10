export function textResult(text: string) {
  return { content: [{ type: 'text' as const, text }] }
}

export function feedUnavailable(label: string) {
  return textResult(`Brak danych: ${label}. Czy apps/service działa?`)
}

export function serviceUnavailable() {
  return textResult('Serwis dashboardu niedostępny. Czy apps/service działa?')
}
