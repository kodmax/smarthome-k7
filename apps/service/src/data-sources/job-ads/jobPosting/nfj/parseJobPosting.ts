import type { JobPostingDetails } from '../types'

const DESCRIPTION_SECTION_TITLES = ['Opis wymagań', 'Opis oferty', 'Zakres obowiązków'] as const

function normalizeText(text: string): string {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^\s+/, '')
    .trim()
}

function findSectionByTitle(document: Document, title: string): Element | null {
  const heading = [...document.querySelectorAll('h2')].find(
    element => normalizeText(element.textContent ?? '') === title,
  )

  return heading?.closest('section') ?? null
}

function extractBlock(element: Element): string[] {
  const tag = element.tagName

  if (tag === 'P') {
    const text = normalizeText(element.textContent ?? '')
    return text.length > 0 ? [text] : []
  }

  if (tag === 'UL' || tag === 'OL') {
    return [...element.querySelectorAll(':scope > li')]
      .map(item => normalizeText(item.textContent ?? ''))
      .filter(item => item.length > 0)
  }

  if (tag === 'DIV') {
    return [...element.children].flatMap(child => extractBlock(child))
  }

  return []
}

function extractReadMoreText(readMore: Element): string {
  const root = readMore.querySelector('div') ?? readMore
  const parts = [...root.children].flatMap(child => extractBlock(child))
  return parts.join('\n\n')
}

function extractSectionContent(section: Element): string | null {
  const readMore = section.querySelector('nfj-read-more')
  if (readMore !== null) {
    const text = extractReadMoreText(readMore)
    return text.length > 0 ? text : null
  }

  const list = section.querySelector('ol, ul')
  if (list !== null) {
    const items = [...list.querySelectorAll(':scope > li')]
      .map((item, index) => `${index + 1}. ${normalizeText(item.textContent ?? '')}`)
      .filter(item => item.length > 0)

    return items.length > 0 ? items.join('\n\n') : null
  }

  return null
}

function parseDescription(document: Document): string | null {
  const sections = DESCRIPTION_SECTION_TITLES.flatMap(title => {
    const section = findSectionByTitle(document, title)
    if (section === null) {
      return []
    }

    const content = extractSectionContent(section)
    if (content === null) {
      return []
    }

    return [`${title}\n\n${content}`]
  })

  const description = sections.join('\n\n\n\n')
  return description.length > 0 ? description : null
}

function parseRequiredSkills(document: Document): string[] {
  const mustHaveSection = document.querySelector('section[branch="musts"]')
  if (mustHaveSection === null) {
    return []
  }

  const skills = [...mustHaveSection.querySelectorAll('li')].flatMap(item => {
    const label = item.querySelector('span[id^="item-tag-"]') ?? item.querySelector('span')
    const text = normalizeText(label?.textContent ?? item.textContent ?? '')
    return text.length > 0 ? [text] : []
  })

  return [...new Set(skills)]
}

export function parseJobPosting(document: Document): JobPostingDetails | null {
  const title = document.querySelector('h1')?.textContent?.trim()
  if (title === undefined || title.length === 0) {
    return null
  }

  const description = parseDescription(document)
  if (description === null) {
    return null
  }

  const requiredSkills = parseRequiredSkills(document)

  return { title, requiredSkills, description }
}
