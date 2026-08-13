import { JobAdsFeedItem } from '@repo/types'
import { useEffect, useReducer } from 'react'
import { initialAddFormState } from './manualJobAdFormState'
import { manualJobAdFormReducer } from './manualJobAdFormReducer'

type UseManualJobAdFormOptions = {
  open: boolean
  isAddMode: boolean
  editAd: JobAdsFeedItem | undefined
}

export function useManualJobAdForm({ open, isAddMode, editAd }: UseManualJobAdFormOptions) {
  const [form, dispatch] = useReducer(manualJobAdFormReducer, initialAddFormState)

  useEffect(() => {
    if (!open) {
      return
    }

    if (isAddMode) {
      dispatch({ type: 'reset-add' })
      return
    }

    if (editAd !== undefined) {
      dispatch({ type: 'load-from-ad', ad: editAd })
    }
  }, [editAd, isAddMode, open])

  return { form, dispatch }
}
