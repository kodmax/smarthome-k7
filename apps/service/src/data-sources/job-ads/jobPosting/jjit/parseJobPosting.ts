import type { JobPostingDetails } from '../types'

const MIN_SKILL_LEVEL = 3

function normalizeText(text: string): string {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^\s+/, '')
}

function joinDescriptionBlock(parts: Array<{ type: 'p'; text: string } | { type: 'ul'; items: string[] }>): string {
  return parts.map(part => (part.type === 'p' ? part.text : part.items.join('\n\n'))).join('\n\n')
}

function parseDescription(contentRoot: Element): string | null {
  const blocks: string[] = []
  let current: Array<{ type: 'p'; text: string } | { type: 'ul'; items: string[] }> = []

  for (const child of contentRoot.children) {
    if (child.tagName === 'P') {
      const text = normalizeText(child.textContent ?? '')
      if (text.length === 0) {
        if (current.length > 0) {
          blocks.push(joinDescriptionBlock(current))
          current = []
        }
        continue
      }

      current.push({ type: 'p', text })
      continue
    }

    if (child.tagName === 'UL' || child.tagName === 'OL') {
      const items = [...child.querySelectorAll('li')]
        .map(item => normalizeText(item.textContent ?? ''))
        .filter(item => item.length > 0)
      current.push({ type: 'ul', items })
    }
  }

  if (current.length > 0) {
    blocks.push(joinDescriptionBlock(current))
  }

  const description = blocks.join('\n\n\n\n')
  return description.length > 0 ? description : null
}

function findJobDescriptionContent(document: Document): Element | null {
  const heading = [...document.querySelectorAll('h3')].find(
    element => normalizeText(element.textContent ?? '') === 'Job description',
  )

  return heading?.nextElementSibling ?? null
}

function parseRequiredSkills(document: Document, title: string): string[] {
  const html = document.documentElement.outerHTML
  const escapedTitle = title.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  const titleNeedle = `\\"title\\":\\"${escapedTitle}\\"`
  const titleIndex = html.indexOf(titleNeedle)
  if (titleIndex === -1) {
    return []
  }

  const offerChunk = html.slice(titleIndex, titleIndex + 50_000)
  const skillsMatch = offerChunk.match(/requiredSkills\\":(\[.*?\])/)
  if (skillsMatch === null) {
    return []
  }

  const skills = JSON.parse(skillsMatch[1].replace(/\\"/g, '"')) as Array<{ name: string; level: number }>
  return skills.filter(skill => skill.level >= MIN_SKILL_LEVEL).map(skill => skill.name)
}

export function parseJobPosting(document: Document): JobPostingDetails | null {
  const title = document.querySelector('h1')?.textContent?.trim()
  if (title === undefined || title.length === 0) {
    return null
  }

  const descriptionRoot = findJobDescriptionContent(document)
  if (descriptionRoot === null) {
    return null
  }

  const description = parseDescription(descriptionRoot)
  if (description === null) {
    return null
  }

  const requiredSkills = parseRequiredSkills(document, title)

  return { title, requiredSkills, description }
}
