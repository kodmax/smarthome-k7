export type CvMatchAnalysisState = {
  analyzing: boolean
  dialogOpen: boolean
}

export const initialCvMatchAnalysisState: CvMatchAnalysisState = {
  analyzing: false,
  dialogOpen: false,
}

export type CvMatchAnalysisAction =
  | { type: 'reset' }
  | { type: 'start-analysis' }
  | { type: 'open-dialog' }
  | { type: 'analysis-failed' }
  | { type: 'timeout' }
  | { type: 'close-dialog' }

export function cvMatchAnalysisReducer(
  state: CvMatchAnalysisState,
  action: CvMatchAnalysisAction,
): CvMatchAnalysisState {
  switch (action.type) {
    case 'reset':
      return initialCvMatchAnalysisState
    case 'start-analysis':
      return {
        ...state,
        analyzing: true,
      }
    case 'open-dialog':
      return {
        analyzing: false,
        dialogOpen: true,
      }
    case 'analysis-failed':
    case 'timeout':
      return {
        ...state,
        analyzing: false,
      }
    case 'close-dialog':
      return {
        ...state,
        dialogOpen: false,
      }
    default:
      return state
  }
}
