import { useContext } from 'react'
import { AppHintContext } from './AppHintContext'

export const useAppHint = () => useContext(AppHintContext)
