import { Dialog, DialogContent, DialogTitle, Typography } from '@mui/material'
import { type FC } from 'react'

type CvPreviewDialogProps = {
  open: boolean
  onClose: () => void
  title: string
  text: string
}

export const CvPreviewDialog: FC<CvPreviewDialogProps> = ({ open, onClose, title, text }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography component='pre' sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', m: 0 }}>
          {text}
        </Typography>
      </DialogContent>
    </Dialog>
  )
}
