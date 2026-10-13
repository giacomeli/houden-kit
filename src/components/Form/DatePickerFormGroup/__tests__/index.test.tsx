import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import DatePickerFormGroup from '../index'

// Teste de fumaça da lib (o app de origem não tem teste deste componente; o markup é coberto pela paridade).
function Harness(props: { error?: string; isRequired?: boolean }) {
    const { control } = useForm()
    return <DatePickerFormGroup labelText="Vencimento" name="vencimento" control={control} {...props} />
}

describe('DatePickerFormGroup', () => {
    it('renderiza o rótulo e o campo de data', () => {
        const { container } = render(<Harness />)
        expect(screen.getByText('Vencimento')).toBeInTheDocument()
        expect(container.querySelector('input[type="date"]')).toBeInTheDocument()
    })

    it('mostra a mensagem de erro', () => {
        render(<Harness error="Informe a data" isRequired />)
        expect(screen.getByText('Informe a data')).toBeInTheDocument()
    })
})
