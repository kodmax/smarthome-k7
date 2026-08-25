import { z } from 'zod'

export const nonEmptyTrimmedStringSchema = z.string().trim().min(1)

export const cvMatchScoreSchema = z.number().int().min(0).max(100)

export const mustHaveGapsSchema = z.array(nonEmptyTrimmedStringSchema)

export const cvMatchAnalysisResultSchema = z.object({
  score: cvMatchScoreSchema,
  summary: nonEmptyTrimmedStringSchema,
  strengths: nonEmptyTrimmedStringSchema,
  gaps: nonEmptyTrimmedStringSchema,
  mustHaveGaps: mustHaveGapsSchema,
  observations: nonEmptyTrimmedStringSchema,
  conclusion: nonEmptyTrimmedStringSchema,
})

export const cvMatchContentSchema = z.object({
  analyzedAt: z.string(),
  score: cvMatchScoreSchema,
  summary: nonEmptyTrimmedStringSchema,
  strengths: nonEmptyTrimmedStringSchema,
  gaps: nonEmptyTrimmedStringSchema,
  mustHaveGaps: mustHaveGapsSchema.optional(),
  observations: nonEmptyTrimmedStringSchema,
  conclusion: nonEmptyTrimmedStringSchema,
})
