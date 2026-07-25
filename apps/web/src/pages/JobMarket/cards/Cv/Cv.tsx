import { IconButton } from '@mui/material'
import { ApolloCardAction, SingleValueCard } from '@repo/apollo-card'
import { EyeIcon, FileTextIcon, LoaderIcon, UploadIcon } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { useCommand, useFeed } from '@repo/feed-client'
import { type CvFeed } from '@repo/types'
import { type ChangeEvent, type FC, useRef, useState } from 'react'
import { useLocale, useTranslations } from '@/i18n'
import { formatCvModifiedDate, formatCvModifiedTime } from './formatCvModifiedAt'
import { readFileAsBase64 } from './readFileAsBase64'
import { waitForCvFeedUpdate } from './waitForCvFeedUpdate'
import { CvPreviewDialog } from './CvPreviewDialog'

export const Cv: FC<Record<string, never>> = () => {
  const { t } = useTranslations()
  const { locale } = useLocale()
  const feed = useFeed<CvFeed>('cv')
  const upload = useCommand('cv', 'upload')
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const onLoadClick = () => {
    inputRef.current?.click()
  }

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (file === undefined) {
      return
    }

    setUploading(true)
    try {
      const previousModifiedAt = feed?.cv?.modifiedAt ?? null
      const base64 = await readFileAsBase64(file)
      const feedUpdate = waitForCvFeedUpdate(previousModifiedAt)
      upload(JSON.stringify({ base64 }))
      await feedUpdate
    } finally {
      setUploading(false)
    }
  }

  const cv = feed?.cv ?? null
  const primary = cv !== null ? formatCvModifiedDate(cv.modifiedAt, locale) : '--'
  const secondary = cv !== null ? formatCvModifiedTime(cv.modifiedAt, locale) : undefined

  return (
    <>
      <SingleValueCard
        cardId='job-market-cv'
        icon={FileTextIcon}
        title={t.jobMarket.cv.title}
        primary={primary}
        secondary={secondary}
        actions={
          <>
            <input ref={inputRef} type='file' accept='application/pdf,.pdf' hidden onChange={onFileChange} />
            {uploading ? (
              <IconButton aria-label={t.jobMarket.cv.processing} size='small' disabled>
                <LoaderIcon spinning size={designTokens.icon.sizeSm} strokeWidth={designTokens.icon.strokeWidth} />
              </IconButton>
            ) : (
              <ApolloCardAction title={t.jobMarket.cv.load} onClick={onLoadClick} Icon={UploadIcon} />
            )}
            {cv !== null && !uploading ? (
              <ApolloCardAction title={t.jobMarket.cv.preview} onClick={() => setPreviewOpen(true)} Icon={EyeIcon} />
            ) : null}
          </>
        }
      />
      {cv !== null ? (
        <CvPreviewDialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title={t.jobMarket.cv.title}
          text={cv.text}
        />
      ) : null}
    </>
  )
}
