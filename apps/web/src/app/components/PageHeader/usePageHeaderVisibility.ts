import { useScrollReveal } from '@/app/hooks/useScrollReveal'
import { useMenu } from '@/app/SideMenu/MenuContext'

export const usePageHeaderVisibility = () => {
  const scrollVisible = useScrollReveal()
  const { open: menuOpen } = useMenu()

  return scrollVisible && !menuOpen
}
