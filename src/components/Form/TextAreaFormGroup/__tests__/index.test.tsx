import { render, screen } from '@testing-library/react'
import TextAreaFormGroup from '../index'

// Teste de fumaça da lib (o app de origem não tem teste deste componente; o markup é coberto pela paridade).
describe('TextAreaFormGroup', () => {
    it('renderiza o rótulo e a área de texto', () => {
        render(<TextAreaFormGroup labelText="Observações" />)
        expect(screen.getByText('Observações')).toBeInTheDocument()
        expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('mostra a mensagem de erro', () => {
        render(<TextAreaFormGroup labelText="Motivo" error="Informe o motivo" isRequired />)
        expect(screen.getByText('Informe o motivo')).toBeInTheDocument()
    })
})
