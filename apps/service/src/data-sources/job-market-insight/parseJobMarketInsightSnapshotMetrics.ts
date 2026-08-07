import { JobMarketInsightSnapshotMetrics } from './persistDailyJobMarketInsightSnapshot'

export const parseJobMarketInsightSnapshotMetrics = (
  metrics: JobMarketInsightSnapshotMetrics | string,
): JobMarketInsightSnapshotMetrics =>
  typeof metrics === 'string' ? (JSON.parse(metrics) as JobMarketInsightSnapshotMetrics) : metrics
