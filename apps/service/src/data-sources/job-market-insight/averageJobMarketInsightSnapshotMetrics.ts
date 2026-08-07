import { JobMarketInsightSnapshotMetrics } from './persistDailyJobMarketInsightSnapshot'

const averageField = (values: number[]): number =>
  Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)

export const averageJobMarketInsightSnapshotMetrics = (
  snapshots: JobMarketInsightSnapshotMetrics[],
): JobMarketInsightSnapshotMetrics | null => {
  if (snapshots.length === 0) {
    return null
  }

  return {
    adsCount: averageField(snapshots.map(snapshot => snapshot.adsCount)),
    newOffersCount: averageField(snapshots.map(snapshot => snapshot.newOffersCount)),
    medianSalary: averageField(snapshots.map(snapshot => snapshot.medianSalary)),
    p90Salary: averageField(snapshots.map(snapshot => snapshot.p90Salary)),
    p90OffersCount: averageField(snapshots.map(snapshot => snapshot.p90OffersCount)),
    offersWithSalaryRangePercent: averageField(snapshots.map(snapshot => snapshot.offersWithSalaryRangePercent)),
    remoteWorkPercent: averageField(snapshots.map(snapshot => snapshot.remoteWorkPercent)),
    hybridWorkPercent: averageField(snapshots.map(snapshot => snapshot.hybridWorkPercent)),
    officeWorkPercent: averageField(snapshots.map(snapshot => snapshot.officeWorkPercent)),
    permanentEmploymentPercent: averageField(snapshots.map(snapshot => snapshot.permanentEmploymentPercent)),
  }
}
