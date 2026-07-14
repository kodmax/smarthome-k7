import { HIGH_DRAW_MIN_W } from '@/app/hints/hintShowThresholds'

export const shouldShowHighDrawHint = (watts: number | undefined): boolean =>
  watts !== undefined && watts >= HIGH_DRAW_MIN_W
