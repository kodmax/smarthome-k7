import { useContext } from 'react'
import { CardHintContext } from './CardHintContext'

export const useCardHint = () => useContext(CardHintContext)
