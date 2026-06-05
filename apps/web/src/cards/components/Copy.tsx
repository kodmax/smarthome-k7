import { IconButton, styled, SvgIcon } from '@mui/material'
import { type FC } from 'react'

import ContentCopyIcon from '@mui/icons-material/ContentCopy'

const copyText = async (text: string): Promise<void> => {
    await navigator.clipboard.write([
        new ClipboardItem({ 'text/plain': new Blob([text], { type: 'text/plain' }) }, { presentationStyle: 'inline' })
    ])
}

const Copy: FC<{ text: string }> = ({ text }) => {
    return (
        <IconButton disabled={!isSecureContext} size='large' sx={{ verticalAlign: 'initial', padding: 0, color: 'inherit', marginRight: '0.25em' }} onClick={() => void copyText(text)}>
            <ContentCopyIcon sx={{ fontSize: '0.5em' }} />
        </IconButton>
    )
}

export default Copy
