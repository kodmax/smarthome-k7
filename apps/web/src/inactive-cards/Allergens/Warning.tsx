import { FC } from 'react'

export const Warning: FC<{ intensity: string }> = ({ intensity }) => {
  if (intensity === 'Wysokie') {
    return <span style={{ marginLeft: 2, color: 'hsl(0deg 100% 50%', fontWeight: 'bold' }}>⚠️</span>
  } else {
    return null
  }
}
