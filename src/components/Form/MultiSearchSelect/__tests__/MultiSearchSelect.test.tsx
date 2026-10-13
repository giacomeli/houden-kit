import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { IOption } from '../../../../types/option'
import MultiSearchSelect from '../index'

// Mock do hook useClickOutside
vi.mock('../../../../hooks/useClickOutside', () => ({
    useClickOutside: vi.fn(),
}))

const mockOptions: IOption[] = [
    { id: 1, name: 'Tag A', value: '1' },
    { id: 2, name: 'Tag B', value: '2' },
    { id: 3, name: 'Tag C', value: '3' },
]

// Simula o comportamento de watch do react-hook-form
// O MultiSearchSelect sincroniza selectedOptions com watchValue via useEffect
let currentFormValue: (string | number)[] = []

const mockSetValue = vi.fn((name: string, value: (string | number)[]) => {
    currentFormValue = value
})

const mockWatch = (name: string) => currentFormValue

const defaultProps = {
    options: mockOptions,
    setValue: mockSetValue as any,
    name: 'tags',
    label: 'Tags',
    watch: mockWatch,
}

describe('MultiSearchSelect', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        currentFormValue = []
    })

    it('deve renderizar o label', () => {
        render(<MultiSearchSelect {...defaultProps} />)
        expect(screen.getByText('Tags')).toBeInTheDocument()
    })

    it('deve exibir asterisco quando isRequired=true', () => {
        render(<MultiSearchSelect {...defaultProps} isRequired />)
        expect(screen.getByText(/\*/)).toBeInTheDocument()
    })

    it('deve exibir mensagem de erro quando error e fornecido', () => {
        render(<MultiSearchSelect {...defaultProps} error="Selecione ao menos uma tag" />)
        expect(screen.getByText('Selecione ao menos uma tag')).toBeInTheDocument()
    })

    it('deve abrir dropdown ao clicar na area de input', () => {
        render(<MultiSearchSelect {...defaultProps} />)
        const input = screen.getByRole('textbox')
        fireEvent.click(input)

        mockOptions.forEach((opt) => {
            expect(screen.getByText(opt.name)).toBeInTheDocument()
        })
    })

    it('deve selecionar opcao ao clicar e chamar setValue', async () => {
        render(<MultiSearchSelect {...defaultProps} />)
        const input = screen.getByRole('textbox')
        fireEvent.click(input)

        fireEvent.click(screen.getByText('Tag A'))

        expect(mockSetValue).toHaveBeenCalledWith('tags', ['1'])
    })

    it('deve filtrar opcoes ao digitar', async () => {
        render(<MultiSearchSelect {...defaultProps} />)
        const input = screen.getByRole('textbox')
        fireEvent.click(input)
        fireEvent.change(input, { target: { value: 'Tag A' } })

        await waitFor(() => {
            expect(screen.getByText('Tag A')).toBeInTheDocument()
            expect(screen.queryByText('Tag B')).not.toBeInTheDocument()
        })
    })

    it('deve remover opcao ao clicar no botao de remover do chip', async () => {
        render(<MultiSearchSelect {...defaultProps} />)
        const input = screen.getByRole('textbox')
        fireEvent.click(input)

        // Seleciona Tag A
        fireEvent.click(screen.getByText('Tag A'))

        // Agora deve exibir o chip com Tag A (pode aparecer tambem no dropdown)
        await waitFor(() => {
            const tagAElements = screen.getAllByText('Tag A')
            expect(tagAElements.length).toBeGreaterThanOrEqual(1)
        })

        // Clica no botao de remover - o ícone é o X do lucide (no app de origem, o caractere &times;)
        const removeButtons = screen.getAllByRole('button')
        const chipRemoveButton = removeButtons.find((btn) => btn.querySelector('svg.lucide-x'))
        expect(chipRemoveButton).toBeTruthy()
        fireEvent.click(chipRemoveButton!)

        expect(mockSetValue).toHaveBeenLastCalledWith('tags', [])
    })

    it('deve estar desabilitado quando isDisabled=true', () => {
        render(<MultiSearchSelect {...defaultProps} isDisabled />)
        const input = screen.getByRole('textbox')
        expect(input).toBeDisabled()
    })

    it('deve chamar trigger apos selecionar quando fornecido', () => {
        const trigger = vi.fn()
        render(<MultiSearchSelect {...defaultProps} trigger={trigger} />)
        const input = screen.getByRole('textbox')
        fireEvent.click(input)
        fireEvent.click(screen.getByText('Tag A'))
        expect(trigger).toHaveBeenCalled()
    })

    it('deve aplicar className customizado', () => {
        const { container } = render(<MultiSearchSelect {...defaultProps} className="minha-classe" />)
        const fieldset = container.querySelector('fieldset')
        expect(fieldset?.className).toContain('minha-classe')
    })

    it('deve desselecionar opcao ao clicar nela novamente no dropdown', async () => {
        render(<MultiSearchSelect {...defaultProps} />)
        const input = screen.getByRole('textbox')
        fireEvent.click(input)

        // Seleciona Tag B
        fireEvent.click(screen.getByText('Tag B'))
        expect(mockSetValue).toHaveBeenCalledWith('tags', ['2'])

        // O dropdown fecha apos reset, precisa reabrir
        fireEvent.click(input)

        await waitFor(() => {
            // Tag B aparece tanto no chip quanto no dropdown
            const tagBItems = screen.getAllByText('Tag B')
            expect(tagBItems.length).toBeGreaterThanOrEqual(2)
        })

        // Clica na opcao do dropdown (ultimo elemento com texto Tag B, que e o item da lista)
        const tagBItems = screen.getAllByText('Tag B')
        fireEvent.click(tagBItems[tagBItems.length - 1])

        expect(mockSetValue).toHaveBeenLastCalledWith('tags', [])
    })
})
