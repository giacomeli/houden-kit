import { render } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import DatePicker from '../index'

function DatePickerWrapper({ hasError = false, hasTimePicker = false, disabled = false }) {
    const { control } = useForm({ defaultValues: { data: null } })
    return (
        <DatePicker
            name="data"
            control={control}
            hasError={hasError}
            hasTimePicker={hasTimePicker}
            disabled={disabled}
        />
    )
}

describe('DatePicker', () => {
    it('deve renderizar um input de data', () => {
        const { container } = render(<DatePickerWrapper />)
        const input = container.querySelector('input[type="date"]')
        expect(input).toBeInTheDocument()
    })

    it('deve renderizar datetime-local quando hasTimePicker=true', () => {
        const { container } = render(<DatePickerWrapper hasTimePicker />)
        const input = container.querySelector('input[type="datetime-local"]')
        expect(input).toBeInTheDocument()
    })

    it('deve aplicar classe de erro quando hasError=true', () => {
        const { container } = render(<DatePickerWrapper hasError />)
        const input = container.querySelector('input')
        expect(input?.className).toContain('border-red-500')
    })

    it('nao deve aplicar classe de erro quando hasError=false', () => {
        const { container } = render(<DatePickerWrapper />)
        const input = container.querySelector('input')
        expect(input?.className).toContain('border-light-gray')
    })

    it('deve estar desabilitado quando disabled=true', () => {
        const { container } = render(<DatePickerWrapper disabled />)
        const input = container.querySelector('input')
        expect(input).toBeDisabled()
    })
})
