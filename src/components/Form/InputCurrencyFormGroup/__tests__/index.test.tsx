import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import InputCurrencyFormGroup from '../index'

// Teste de fumaça da lib (o app de origem não tem teste deste componente; o markup é coberto pela paridade).
function Harness(props: { error?: string }) {
    const { control } = useForm({ defaultValues: { valor: 10 } })
    return <InputCurrencyFormGroup labelText="Valor" name="valor" control={control} {...props} />
}

describe('InputCurrencyFormGroup', () => {
    it('renderiza o rótulo e o campo monetário', () => {
        render(<Harness />)
        expect(screen.getByText('Valor')).toBeInTheDocument()
        expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('mostra a mensagem de erro', () => {
        render(<Harness error="Valor inválido" />)
        expect(screen.getByText('Valor inválido')).toBeInTheDocument()
    })
})
