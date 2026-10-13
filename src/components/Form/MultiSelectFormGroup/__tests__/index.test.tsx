import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import MultiSelectFormGroup from '../index'

// Teste de fumaça da lib (o app de origem não tem teste deste componente; o markup é coberto pela paridade).
const options = [
    { name: 'Vendas', code: 'vendas' },
    { name: 'SAC', code: 'sac' },
]

function Harness(props: { error?: string }) {
    const { control } = useForm()
    return <MultiSelectFormGroup labelText="Áreas" name="areas" control={control} options={options} {...props} />
}

describe('MultiSelectFormGroup', () => {
    it('renderiza o rótulo e o seletor com o texto padrão', () => {
        render(<Harness />)
        expect(screen.getByText('Áreas')).toBeInTheDocument()
        expect(screen.getByText('Selecione...')).toBeInTheDocument()
    })

    it('mostra a mensagem de erro', () => {
        render(<Harness error="Selecione uma área" />)
        expect(screen.getByText('Selecione uma área')).toBeInTheDocument()
    })
})
