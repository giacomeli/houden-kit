import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import DatePickerGroup from '../index'

// Teste de fumaça da lib (o app de origem não tem teste deste componente; o markup é coberto pela paridade).
function Harness() {
    const { control } = useForm()
    return (
        <DatePickerGroup
            control={control}
            label="Período"
            firstInputLabel="De"
            secondInputLabel="Até"
            firstInputName="inicio"
            secondInputName="fim"
        />
    )
}

describe('DatePickerGroup', () => {
    it('renderiza o rótulo do grupo e os dois campos de data', () => {
        const { container } = render(<Harness />)
        expect(screen.getByText('Período')).toBeInTheDocument()
        expect(screen.getByText('De')).toBeInTheDocument()
        expect(screen.getByText('Até')).toBeInTheDocument()
        expect(container.querySelectorAll('input[type="date"]')).toHaveLength(2)
    })
})
