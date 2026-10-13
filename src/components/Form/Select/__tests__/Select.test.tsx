import { fireEvent, render, screen } from '@testing-library/react'
import type { IOption } from '../../../../types/option'
import Select from '../index'

const mockOptions: IOption[] = [
    { id: 1, name: 'Opcao 1', value: '1' },
    { id: 2, name: 'Opcao 2', value: '2' },
    { id: 3, name: 'Opcao 3', value: '3' },
]

describe('Select', () => {
    it('deve renderizar o placeholder padrao "Selecione"', () => {
        render(<Select options={mockOptions} />)
        expect(screen.getByText('Selecione')).toBeInTheDocument()
    })

    it('deve renderizar placeholder customizado', () => {
        render(<Select options={mockOptions} placeholder="Escolha uma opcao" />)
        expect(screen.getByText('Escolha uma opcao')).toBeInTheDocument()
    })

    it('deve renderizar todas as opcoes', () => {
        render(<Select options={mockOptions} />)
        mockOptions.forEach((opt) => {
            expect(screen.getByText(opt.name)).toBeInTheDocument()
        })
    })

    it('deve renderizar com label quando labelText e fornecido', () => {
        render(<Select options={mockOptions} labelText="Status" />)
        expect(screen.getByText('Status')).toBeInTheDocument()
    })

    it('deve exibir asterisco quando isRequired=true', () => {
        render(<Select options={mockOptions} labelText="Status" isRequired />)
        expect(screen.getByText(/\*/)).toBeInTheDocument()
    })

    it('deve exibir mensagem de erro quando error e fornecido', () => {
        render(<Select options={mockOptions} labelText="Status" error="Selecione um valor" />)
        expect(screen.getByText('Selecione um valor')).toBeInTheDocument()
    })

    it('deve aplicar classe select-error quando hasError=true', () => {
        render(<Select options={mockOptions} hasError />)
        const select = screen.getByRole('combobox')
        expect(select.className).toContain('select-error')
    })

    it('deve estar desabilitado quando isDisabled=true', () => {
        render(<Select options={mockOptions} isDisabled />)
        const select = screen.getByRole('combobox')
        expect(select).toBeDisabled()
    })

    it('deve estar desabilitado quando disabled=true', () => {
        render(<Select options={mockOptions} disabled />)
        const select = screen.getByRole('combobox')
        expect(select).toBeDisabled()
    })

    it('deve permitir selecionar uma opcao', () => {
        render(<Select options={mockOptions} />)
        const select = screen.getByRole('combobox')
        fireEvent.change(select, { target: { value: '2' } })
        expect((select as HTMLSelectElement).value).toBe('2')
    })

    it('deve renderizar opcoes usando label quando name nao esta disponivel', () => {
        const optionsWithLabel = [
            { id: '1', label: 'Label 1', value: '1' },
            { id: '2', label: 'Label 2', value: '2' },
        ]
        render(<Select options={optionsWithLabel as any} />)
        expect(screen.getByText('Label 1')).toBeInTheDocument()
    })

    it('deve exibir hint quando fornecido', () => {
        render(<Select options={mockOptions} labelText="Status" hint="Escolha com cuidado" />)
        expect(screen.getByText('Escolha com cuidado')).toBeInTheDocument()
    })

    it('deve renderizar com valor controlado', () => {
        render(<Select options={mockOptions} value="2" onChange={vi.fn()} />)
        const select = screen.getByRole('combobox') as HTMLSelectElement
        expect(select.value).toBe('2')
    })
})
