import { fetchDocument } from '@/fetch'
import { requireElements, requireText, withScraperSource } from '@/utils/scraper'
import { weatherPageUrls } from '../urls'

export type AllergenForecast = {
  id: string | null
  name: string
  intensity: string
}

export const parseAllergensFromDocument = (document: Document): AllergenForecast[] =>
  withScraperSource('weather', () => {
    const allergens = requireElements(document, '.allergy-forecast .allergy', 'allergen forecast')

    return allergens.slice(0, 5).map(allergen => ({
      id: new URL(allergen.getAttribute('href') ?? '', 'https://www.accuweather.com/').searchParams.get('name'),
      name: requireText(allergen, '.allergy-name', 'allergen forecast item'),
      intensity: requireText(allergen, '.allergy-value', 'allergen forecast item'),
    }))
  })

export const parseAllergens = async (): Promise<AllergenForecast[]> => {
  return parseAllergensFromDocument(await fetchDocument(weatherPageUrls.allergens))
}
