export type CvMatchAnalysisState = {
  analyzing: boolean
  pendingAnalysisAt: string | null
  dialogOpen: boolean
  dialogTitle: string | null
  dialogText: string | null
  dialogNotice: string | null
}

export const initialCvMatchAnalysisState: CvMatchAnalysisState = {
  analyzing: false,
  pendingAnalysisAt: null,
  dialogOpen: false,
  dialogTitle: null,
  dialogText: null,
  dialogNotice: null,
}

export type CvMatchAnalysisAction =
  | { type: 'reset' }
  | { type: 'start-analysis'; pendingAnalysisAt: string | null }
  | { type: 'show-result'; title: string; text: string; notice: string | null }
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
        pendingAnalysisAt: action.pendingAnalysisAt,
      }
    case 'show-result':
      return {
        ...state,
        analyzing: false,
        pendingAnalysisAt: null,
        dialogOpen: true,
        dialogTitle: action.title,
        dialogText: action.text,
        dialogNotice: action.notice,
      }
    case 'timeout':
      return {
        ...state,
        analyzing: false,
        pendingAnalysisAt: null,
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
