import { useScrollReveal } from '@/app/shell/hooks/useScrollReveal'
import { useMenu } from '@/app/shell/SideMenu/MenuContext'

export const usePageHeaderVisibility = () => {
  const scrollVisible = useScrollReveal()
  const { open: menuOpen } = useMenu()

  return scrollVisible && !menuOpen
}
