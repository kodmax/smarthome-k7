import { styled } from '@mui/material'
import { IconCopy } from '@repo/assets'
import { designTokens } from '@repo/design-tokens'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'

const { icon } = designTokens

const copyText = async (text: string): Promise<void> => {
  await navigator.clipboard.write([
    new ClipboardItem({ 'text/plain': new Blob([text], { type: 'text/plain' }) }, { presentationStyle: 'inline' }),
  ])
}

const CopyButton = styled('button')({
  display: 'inline-flex',
  alignItems: 'center',
  verticalAlign: 'middle',
  lineHeight: 0,
  padding: 0,
  marginRight: `${designTokens.space[1]}px`,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: 'inherit',
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
})

const Copy: FC<{ text: string }> = ({ text }) => {
  const { t } = useTranslations()

  return (
    <CopyButton
      type='button'
      disabled={!isSecureContext}
      aria-label={t.dashboard.common.copy}
      onClick={() => void copyText(text)}
    >
      <IconCopy size={icon.sizeXs} strokeWidth={icon.strokeWidth} aria-hidden />
    </CopyButton>
  )
}

export default Copy
