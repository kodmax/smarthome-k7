import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'
import { type FC } from 'react'

type CvPreviewDialogProps = {
  open: boolean
  onClose: () => void
  title: string
  text: string
  notice?: string | null
}

export const CvPreviewDialog: FC<CvPreviewDialogProps> = ({ open, onClose, title, text, notice }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {notice ? (
          <Typography component='strong' sx={{ display: 'block', mb: 2, fontWeight: 500, color: 'accentRed.main' }}>
            {notice}
          </Typography>
        ) : null}
        <Typography component='pre' sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', m: 0 }}>
          {text}
        </Typography>
      </DialogContent>
    </Dialog>
  )
}
