import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useCommand } from '@repo/feed-client'
import { JobAdsFeedItem } from '@repo/types'
import { type FC, useCallback, useState } from 'react'
import { useTranslations } from '@/i18n'
import { canDeleteManualAd } from '../../../../../../canDeleteManualAd'
import { ManualJobAdDialog, type EditManualJobAdPayload } from '../../../../../../components/AddManualJobAdDialog'

type Props = {
  ad: JobAdsFeedItem
}

export const ManualJobAdActions: FC<Props> = ({ ad }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds
  const editManualJobAd = useCommand('job-ads', 'edit-manual')
  const deleteManualJobAd = useCommand('job-ads', 'delete-manual')

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const showDelete = canDeleteManualAd(ad.meta.addedAt)

  const handleEditSubmit = useCallback(
    (payload: EditManualJobAdPayload) => {
      editManualJobAd(JSON.stringify(payload))
      setEditOpen(false)
    },
    [editManualJobAd],
  )

  const handleDeleteConfirm = useCallback(() => {
    deleteManualJobAd(JSON.stringify({ id: ad.content.id }))
    setDeleteOpen(false)
  }, [ad.content.id, deleteManualJobAd])

  return (
    <>
      <Button size='small' variant='outlined' onClick={() => setEditOpen(true)}>
        {labels.editManualJobAd}
      </Button>
      {showDelete ? (
        <Button size='small' variant='outlined' color='error' onClick={() => setDeleteOpen(true)}>
          {labels.deleteManualJobAd}
        </Button>
      ) : null}
      <ManualJobAdDialog
        mode='edit'
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
        editAd={ad}
      />
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth='xs' fullWidth>
        <DialogTitle>{labels.deleteManualJobAdTitle}</DialogTitle>
        <DialogContent dividers>
          <Typography>{labels.deleteManualJobAdConfirm.replace('{title}', ad.content.title)}</Typography>
          <Typography sx={{ mt: 2 }} color='text.secondary' variant='body2'>
            {labels.deleteManualJobAdHint}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>{labels.cancel}</Button>
          <Button onClick={handleDeleteConfirm} color='error' variant='contained'>
            {labels.deleteManualJobAd}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
