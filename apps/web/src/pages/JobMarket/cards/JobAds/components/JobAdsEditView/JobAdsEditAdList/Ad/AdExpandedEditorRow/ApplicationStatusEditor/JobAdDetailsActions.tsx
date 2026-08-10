import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useCommand, useFeed } from '@repo/feed-client'
import { JobAdsFeed, JobAdsFeedItem } from '@repo/types'
import { type FC, useCallback, useMemo, useState } from 'react'
import { useTranslations } from '@/i18n'
import { collectSkillSuggestions } from '../../../../../../requiredSkills'
import { canDeleteManualAd } from '../../../../../../canDeleteManualAd'
import { ManualJobAdDialog } from '../../../../../../components/AddManualJobAdDialog'
import type { JobAdsEditManualPayload } from '@repo/types'

type Props = {
  ad: JobAdsFeedItem
}

export const JobAdDetailsActions: FC<Props> = ({ ad }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds
  const editManualJobAd = useCommand('job-ads', 'edit-manual')
  const deleteManualJobAd = useCommand('job-ads', 'delete-manual')
  const jobAdsFeed = useFeed<JobAdsFeed>('job-ads')

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const isManualAd = ad.content.origin === 'manual'
  const showDelete = isManualAd && canDeleteManualAd(ad.meta.addedAt)
  const skillOptions = useMemo(() => collectSkillSuggestions(jobAdsFeed?.ads), [jobAdsFeed?.ads])

  const handleEditSubmit = useCallback(
    (payload: JobAdsEditManualPayload) => {
      editManualJobAd(payload)
      setEditOpen(false)
    },
    [editManualJobAd],
  )

  const handleDeleteConfirm = useCallback(() => {
    deleteManualJobAd({ id: ad.content.id })
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
        skillOptions={skillOptions}
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
