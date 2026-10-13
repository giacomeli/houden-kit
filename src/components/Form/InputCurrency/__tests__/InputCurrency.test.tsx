import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import InputCurrency from '../index'

// Mock react-currency-mask - componente externo complexo
vi.mock('react-currency-mask', () => ({
    CurrencyInput: ({ InputElement, value, onChangeValue, onBlur, ...props }: any) => {
        // Renderiza o InputElement diretamente com os props repassados
        if (InputElement) {
            return React.cloneElement(InputElement, {
                ...props,
                value: value ?? '',
                onChange: (e: any) => onChangeValue?.(e, e.target.value),
                onBlur: (e: any) => onBlur?.(e),
            })
        }
        return <input data-testid="currency-input" value={value ?? ''} />
    },
}))

import React from 'react'

function InputCurrencyWrapper({
    hasError = false,
    className = '',
    defaultValue = '',
}: {
    hasError?: boolean
    className?: string
    defaultValue?: string
}) {
    const { control } = useForm({ defaultValues: { valor: defaultValue } })
    return <InputCurrency name="valor" control={control} hasError={hasError} className={className} />
}

describe('InputCurrency', () => {
    it('deve renderizar o input', () => {
        render(<InputCurrencyWrapper />)
        const input = screen.getByRole('textbox')
        expect(input).toBeInTheDocument()
    })

    it('deve aplicar classe de erro quando hasError=true', () => {
        render(<InputCurrencyWrapper hasError />)
        const input = screen.getByRole('textbox')
        expect(input.className).toContain('border-red-500')
    })

    it('nao deve aplicar classe de erro quando hasError=false', () => {
        render(<InputCurrencyWrapper />)
        const input = screen.getByRole('textbox')
        expect(input.className).toContain('border-light-gray')
    })

    it('deve aplicar className customizado', () => {
        render(<InputCurrencyWrapper className="minha-classe" />)
        const input = screen.getByRole('textbox')
        expect(input.className).toContain('minha-classe')
    })

    it('deve ter a classe input-sm por padrao', () => {
        render(<InputCurrencyWrapper />)
        const input = screen.getByRole('textbox')
        expect(input.className).toContain('input-sm')
    })
})
