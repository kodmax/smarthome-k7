import { createContext, useContext, type FC, type ReactNode } from 'react'

type MenuContextValue = {
  open: boolean
  onOpen: () => void
  onClose: () => void
}

const MenuContext = createContext<MenuContextValue | null>(null)

type MenuProviderProps = {
  value: MenuContextValue
  children: ReactNode
}

export const MenuProvider: FC<MenuProviderProps> = ({ value, children }) => (
  <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
)

export const useMenu = (): MenuContextValue => {
  const context = useContext(MenuContext)

  if (context === null) {
    throw new Error('useMenu must be used within MenuProvider')
  }

  return context
}
