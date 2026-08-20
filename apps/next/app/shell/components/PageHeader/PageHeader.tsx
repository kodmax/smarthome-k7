import { type FC, useRef } from 'react'
import { PageHeaderContent } from './PageHeaderContent'
import { PageHeaderShell } from './PageHeaderShell'
import { PageHeaderSpacer } from './PageHeaderSpacer'
import { usePageHeaderHeight } from './usePageHeaderHeight'
import { usePageHeaderScrolled } from './usePageHeaderScrolled'
import { usePageHeaderVisibility } from './usePageHeaderVisibility'
import { type PageHeaderProps } from './types'

export const PageHeader: FC<PageHeaderProps> = props => {
  const { title, description } = props
  const visible = usePageHeaderVisibility()
  const scrolled = usePageHeaderScrolled()
  const headerRef = useRef<HTMLElement>(null)
  const headerHeight = usePageHeaderHeight(headerRef, `${title}:${description}`)

  return (
    <>
      <PageHeaderShell headerRef={headerRef} visible={visible} scrolled={scrolled}>
        <PageHeaderContent {...props} />
      </PageHeaderShell>
      <PageHeaderSpacer height={headerHeight} />
    </>
  )
}
