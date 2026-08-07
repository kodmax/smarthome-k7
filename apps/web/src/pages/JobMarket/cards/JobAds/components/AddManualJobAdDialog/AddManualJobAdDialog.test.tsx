import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { jobAd } from '@/pages/JobMarket/test/fixtures/jobAd'
import { renderWithTheme } from '@/test/test-utils'
import { AddManualJobAdDialog, ManualJobAdDialog } from './AddManualJobAdDialog'

describe('AddManualJobAdDialog', () => {
  it('renders form fields with URL first', () => {
    renderWithTheme(<AddManualJobAdDialog open={true} onClose={vi.fn()} onSubmit={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Dodaj ogłoszenie ręcznie' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /^URL ogłoszenia/ })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /^Tytuł/ })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /^Firma/ })).toBeInTheDocument()
  })

  it('submits payload with required fields', () => {
    const onSubmit = vi.fn()

    renderWithTheme(<AddManualJobAdDialog open={true} onClose={vi.fn()} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByRole('textbox', { name: /^URL ogłoszenia/ }), {
      target: { value: 'https://example.com/jobs/1' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: /^Tytuł/ }), { target: { value: 'Backend Engineer' } })
    fireEvent.change(screen.getByRole('textbox', { name: /^Firma/ }), { target: { value: 'Acme' } })

    fireEvent.click(screen.getByRole('button', { name: 'Dodaj' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Backend Engineer',
      companyName: 'Acme',
      advertUrl: 'https://example.com/jobs/1',
      workplaceType: 'remote',
      employmentType: 'permanent',
      applyStatus: 'pending-review',
      requiredSkills: [],
    })
  })

  it('submits required skills from add form', () => {
    const onSubmit = vi.fn()

    renderWithTheme(
      <AddManualJobAdDialog open={true} onClose={vi.fn()} onSubmit={onSubmit} skillOptions={['TypeScript', 'React']} />,
    )

    fireEvent.change(screen.getByRole('textbox', { name: /^URL ogłoszenia/ }), {
      target: { value: 'https://example.com/jobs/1' },
    })
    fireEvent.change(screen.getByRole('textbox', { name: /^Tytuł/ }), { target: { value: 'Backend Engineer' } })
    fireEvent.change(screen.getByRole('textbox', { name: /^Firma/ }), { target: { value: 'Acme' } })
    fireEvent.change(screen.getByRole('combobox', { name: 'Wymagane umiejętności' }), {
      target: { value: 'TypeScript' },
    })
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Wymagane umiejętności' }), { key: 'Enter' })

    fireEvent.click(screen.getByRole('button', { name: 'Dodaj' }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        requiredSkills: ['TypeScript'],
      }),
    )
  })
})

describe('ManualJobAdDialog edit mode', () => {
  it('shows read-only listing header and submits editable fields only', () => {
    const onSubmit = vi.fn()
    const editAd = jobAd({
      id: 'manual-1',
      title: 'Backend Engineer',
      companyName: 'Acme',
      advertUrl: 'https://example.com/jobs/1',
      origin: 'manual',
      workplaceType: 'office',
      employmentType: 'permanent',
    })

    renderWithTheme(<ManualJobAdDialog mode='edit' open={true} onClose={vi.fn()} onSubmit={onSubmit} editAd={editAd} />)

    expect(screen.getByRole('heading', { name: 'Doprecyzuj szczegóły ogłoszenia' })).toBeInTheDocument()
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: /^Tytuł/ })).not.toBeInTheDocument()

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Tryb pracy' }))
    fireEvent.click(screen.getByRole('option', { name: 'Zdalnie' }))

    fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }))

    expect(onSubmit).toHaveBeenCalledWith({
      id: 'manual-1',
      workplaceType: 'remote',
      employmentType: 'permanent',
      requiredSkills: [],
    })
  })

  it('submits required skills from edit form', () => {
    const onSubmit = vi.fn()
    const editAd = jobAd({
      id: 'manual-1',
      title: 'Backend Engineer',
      companyName: 'Acme',
      advertUrl: 'https://example.com/jobs/1',
      origin: 'manual',
      workplaceType: 'office',
      employmentType: 'permanent',
      requiredSkills: ['TypeScript'],
    })

    renderWithTheme(
      <ManualJobAdDialog
        mode='edit'
        open={true}
        onClose={vi.fn()}
        onSubmit={onSubmit}
        editAd={editAd}
        skillOptions={['TypeScript', 'React']}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }))

    expect(onSubmit).toHaveBeenCalledWith({
      id: 'manual-1',
      workplaceType: 'office',
      employmentType: 'permanent',
      requiredSkills: ['TypeScript'],
    })
  })
})
