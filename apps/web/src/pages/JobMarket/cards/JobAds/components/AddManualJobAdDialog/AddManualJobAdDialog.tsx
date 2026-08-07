import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material'
import { JobApplyStatus, JobAdsFeedItem, WorkplaceType } from '@repo/types'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from '@/i18n'
import { dedupeSkillsById } from '../../requiredSkills'
import { reverseManualJobAdSalary } from './manualJobAdSalary'

const MANUAL_APPLY_STATUSES = [
  'pending-review',
  'consider',
  'applied',
  'interview',
] as const satisfies readonly JobApplyStatus[]
const WORKPLACE_TYPES = ['office', 'remote', 'hybrid'] as const satisfies readonly WorkplaceType[]
const EMPLOYMENT_TYPES = ['permanent', 'b2b'] as const

export type AddManualJobAdPayload = {
  title: string
  companyName: string
  advertUrl: string
  workplaceType: WorkplaceType
  employmentType: 'permanent' | 'b2b'
  salaryFrom?: number
  salaryTo?: number
  applyStatus: JobApplyStatus
  appliedAt?: string
  requiredSkills: string[]
}

export type EditManualJobAdPayload = {
  id: string
  workplaceType: WorkplaceType
  employmentType: 'permanent' | 'b2b'
  salaryFrom?: number
  salaryTo?: number
  requiredSkills: string[]
}

type BaseProps = {
  open: boolean
  onClose: () => void
}

type AddModeProps = BaseProps & {
  mode: 'add'
  onSubmit: (payload: AddManualJobAdPayload) => void
  editAd?: undefined
  skillOptions?: string[]
}

type EditModeProps = BaseProps & {
  mode: 'edit'
  onSubmit: (payload: EditManualJobAdPayload) => void
  editAd: JobAdsFeedItem
  skillOptions?: string[]
}

type Props = AddModeProps | EditModeProps

function parseOptionalSalaryInput(value: string): number | undefined {
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return undefined
  }

  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined
  }

  return parsed
}

function isValidAdvertUrl(value: string): boolean {
  try {
    const parsed = new URL(value.trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function toAppliedAtIso(dateValue: string): string | undefined {
  if (dateValue.trim().length === 0) {
    return undefined
  }

  const parsed = new Date(`${dateValue}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return parsed.toISOString()
}

function formatSalaryInput(value: number | undefined): string {
  return value === undefined ? '' : String(value)
}

export const ManualJobAdDialog: FC<Props> = props => {
  const { mode, open, onClose, onSubmit, editAd } = props
  const skillOptions = props.skillOptions ?? []
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds
  const isAddMode = mode === 'add'

  const [title, setTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [advertUrl, setAdvertUrl] = useState('')
  const [workplaceType, setWorkplaceType] = useState<WorkplaceType>('remote')
  const [employmentType, setEmploymentType] = useState<'permanent' | 'b2b'>('permanent')
  const [salaryFrom, setSalaryFrom] = useState('')
  const [salaryTo, setSalaryTo] = useState('')
  const [applyStatus, setApplyStatus] = useState<(typeof MANUAL_APPLY_STATUSES)[number]>('pending-review')
  const [appliedAt, setAppliedAt] = useState('')
  const [requiredSkills, setRequiredSkills] = useState<string[]>([])

  const resetAddForm = useCallback(() => {
    setTitle('')
    setCompanyName('')
    setAdvertUrl('')
    setWorkplaceType('remote')
    setEmploymentType('permanent')
    setSalaryFrom('')
    setSalaryTo('')
    setApplyStatus('pending-review')
    setAppliedAt('')
    setRequiredSkills([])
  }, [])

  const resetEditForm = useCallback((ad: JobAdsFeedItem) => {
    const employmentTypeValue = ad.content.employmentType === 'b2b' ? 'b2b' : 'permanent'
    const reversedSalary = reverseManualJobAdSalary(employmentTypeValue, ad.content.monthlySalaryRangeAfterTaxes)

    setWorkplaceType(ad.content.workplaceType)
    setEmploymentType(employmentTypeValue)
    setSalaryFrom(formatSalaryInput(reversedSalary.salaryFrom))
    setSalaryTo(formatSalaryInput(reversedSalary.salaryTo))
    setRequiredSkills(dedupeSkillsById(ad.content.requiredSkills))
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    if (isAddMode) {
      resetAddForm()
      return
    }

    if (editAd !== undefined) {
      resetEditForm(editAd)
    }
  }, [editAd, isAddMode, open, resetAddForm, resetEditForm])

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const showAppliedAt = isAddMode && (applyStatus === 'applied' || applyStatus === 'interview')
  const salaryHint = employmentType === 'permanent' ? labels.salaryHintPermanent : labels.salaryHintB2b

  const parsedSalaryFrom = useMemo(() => parseOptionalSalaryInput(salaryFrom), [salaryFrom])
  const parsedSalaryTo = useMemo(() => parseOptionalSalaryInput(salaryTo), [salaryTo])
  const hasInvalidSalaryInput =
    (salaryFrom.trim().length > 0 && parsedSalaryFrom === undefined) ||
    (salaryTo.trim().length > 0 && parsedSalaryTo === undefined) ||
    (parsedSalaryFrom !== undefined && parsedSalaryTo !== undefined && parsedSalaryFrom > parsedSalaryTo)

  const canSubmitAdd =
    title.trim().length > 0 && companyName.trim().length > 0 && isValidAdvertUrl(advertUrl) && !hasInvalidSalaryInput

  const canSubmitEdit = !hasInvalidSalaryInput && editAd !== undefined

  const handleSubmit = () => {
    if (isAddMode) {
      if (!canSubmitAdd) {
        return
      }

      const payload: AddManualJobAdPayload = {
        title: title.trim(),
        companyName: companyName.trim(),
        advertUrl: advertUrl.trim(),
        workplaceType,
        employmentType,
        applyStatus,
        requiredSkills: dedupeSkillsById(requiredSkills),
      }

      if (parsedSalaryFrom !== undefined) {
        payload.salaryFrom = parsedSalaryFrom
      }
      if (parsedSalaryTo !== undefined) {
        payload.salaryTo = parsedSalaryTo
      }

      if (showAppliedAt) {
        const appliedAtIso = toAppliedAtIso(appliedAt)
        if (appliedAtIso !== undefined) {
          payload.appliedAt = appliedAtIso
        }
      }

      onSubmit(payload)
      resetAddForm()
      return
    }

    if (!canSubmitEdit || editAd === undefined) {
      return
    }

    const payload: EditManualJobAdPayload = {
      id: editAd.content.id,
      workplaceType,
      employmentType,
      requiredSkills: dedupeSkillsById(requiredSkills),
    }

    if (parsedSalaryFrom !== undefined) {
      payload.salaryFrom = parsedSalaryFrom
    }
    if (parsedSalaryTo !== undefined) {
      payload.salaryTo = parsedSalaryTo
    }

    onSubmit(payload)
  }

  const dialogTitle = isAddMode ? labels.addManualJobAdTitle : labels.editManualJobAdTitle
  const submitLabel = isAddMode ? labels.addManualJobAdSubmit : labels.editManualJobAdSubmit

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3} sx={{ pt: 1 }}>
          {isAddMode ? (
            <>
              <TextField
                label={labels.addManualJobAdUrl}
                value={advertUrl}
                onChange={event => setAdvertUrl(event.target.value)}
                required
                fullWidth
              />
              <TextField
                label={labels.jobTitle}
                value={title}
                onChange={event => setTitle(event.target.value)}
                required
                fullWidth
              />
              <TextField
                label={labels.company}
                value={companyName}
                onChange={event => setCompanyName(event.target.value)}
                required
                fullWidth
              />
            </>
          ) : editAd !== undefined ? (
            <Stack spacing={1}>
              <Link href={editAd.content.advertUrl} target='_blank' rel='noopener noreferrer'>
                {editAd.content.advertUrl}
              </Link>
              <Typography variant='subtitle1'>{editAd.content.title}</Typography>
              <Typography color='text.secondary'>{editAd.content.companyName}</Typography>
            </Stack>
          ) : null}
          <Autocomplete
            multiple
            freeSolo
            options={skillOptions}
            value={requiredSkills}
            onChange={(_, value) => setRequiredSkills(dedupeSkillsById(value.map(String)))}
            renderValue={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index })
                return <Chip key={key} label={option} size='small' {...tagProps} />
              })
            }
            renderInput={params => <TextField {...params} label={labels.requiredSkills} />}
          />
          <FormControl fullWidth required>
            <InputLabel id='manual-job-ad-workplace-type'>{labels.workplaceTypeLabel}</InputLabel>
            <Select
              labelId='manual-job-ad-workplace-type'
              value={workplaceType}
              label={labels.workplaceTypeLabel}
              onChange={(event: SelectChangeEvent<WorkplaceType>) =>
                setWorkplaceType(event.target.value as WorkplaceType)
              }
            >
              {WORKPLACE_TYPES.map(type => (
                <MenuItem key={type} value={type}>
                  {labels.workplaceType[type]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel id='manual-job-ad-employment-type'>{labels.employmentType.label}</InputLabel>
            <Select
              labelId='manual-job-ad-employment-type'
              value={employmentType}
              label={labels.employmentType.label}
              onChange={(event: SelectChangeEvent<'permanent' | 'b2b'>) =>
                setEmploymentType(event.target.value as 'permanent' | 'b2b')
              }
            >
              {EMPLOYMENT_TYPES.map(type => (
                <MenuItem key={type} value={type}>
                  {labels.employmentType[type]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={labels.salaryFrom}
            value={salaryFrom}
            onChange={event => setSalaryFrom(event.target.value)}
            type='number'
            inputProps={{ min: 1 }}
            helperText={salaryHint}
            fullWidth
          />
          <TextField
            label={labels.salaryTo}
            value={salaryTo}
            onChange={event => setSalaryTo(event.target.value)}
            type='number'
            inputProps={{ min: 1 }}
            helperText={salaryHint}
            fullWidth
          />
          {isAddMode ? (
            <>
              <FormControl fullWidth required>
                <InputLabel id='manual-job-ad-apply-status'>{labels.newApplicationStatus}</InputLabel>
                <Select
                  labelId='manual-job-ad-apply-status'
                  value={applyStatus}
                  label={labels.newApplicationStatus}
                  onChange={(event: SelectChangeEvent<(typeof MANUAL_APPLY_STATUSES)[number]>) =>
                    setApplyStatus(event.target.value as (typeof MANUAL_APPLY_STATUSES)[number])
                  }
                >
                  {MANUAL_APPLY_STATUSES.map(status => (
                    <MenuItem key={status} value={status}>
                      {labels.applyStatus[status]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {showAppliedAt ? (
                <TextField
                  label={labels.applicationDate}
                  type='date'
                  value={appliedAt}
                  onChange={event => setAppliedAt(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              ) : null}
            </>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{labels.cancel}</Button>
        <Button onClick={handleSubmit} variant='contained' disabled={isAddMode ? !canSubmitAdd : !canSubmitEdit}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const AddManualJobAdDialog: FC<Omit<AddModeProps, 'mode'>> = props => <ManualJobAdDialog mode='add' {...props} />
