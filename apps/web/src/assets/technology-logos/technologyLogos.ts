const technologyLogoModules = import.meta.glob('./*.svg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

export const technologyLogos = Object.fromEntries(
  Object.entries(technologyLogoModules).map(([path, url]) => {
    const id = path.replace(/^\.\/(.+)\.svg$/, '$1')
    return [id, url]
  }),
) as Record<string, string>

export const getTechnologyLogoUrl = (id: string): string | undefined => technologyLogos[id]
