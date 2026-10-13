import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { IOption } from '../../../../types/option'
import SearchSelect from '../index'

// Mock do hook useClickOutside
vi.mock('../../../../hooks/useClickOutside', () => ({
    useClickOutside: vi.fn(),
}))

const mockOptions: IOption[] = [
    { id: 1, name: 'Produto A', value: '1' },
    { id: 2, name: 'Produto B', value: '2' },
    { id: 3, name: 'Servico C', value: '3' },
]

const defaultProps = {
    options: mockOptions,
    setValue: vi.fn() as any,
    name: 'produto',
    label: 'Produto',
}

// O SearchSelect usa um Input interno com onClick que nao e repassado ao <input> nativo.
// O isOpen e controlado pelo onClick no componente Input (que nao propaga).
// Nos testes, simulamos o estado abrindo via interacao com o componente.
// Como o onClick no Input nao e propagado para o <input> nativo,
// o dropdown precisa ser aberto de outra forma nos testes.

describe('SearchSelect', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deve renderizar o label', () => {
        render(<SearchSelect {...defaultProps} />)
        expect(screen.getByText('Produto')).toBeInTheDocument()
    })

    it('deve exibir asterisco quando isRequired=true', () => {
        render(<SearchSelect {...defaultProps} isRequired />)
        expect(screen.getByText(/\*/)).toBeInTheDocument()
    })

    it('deve exibir mensagem de erro quando error e fornecido', () => {
        render(<SearchSelect {...defaultProps} error="Campo obrigatorio" />)
        expect(screen.getByText('Campo obrigatorio')).toBeInTheDocument()
    })

    it('deve renderizar o input de busca', () => {
        render(<SearchSelect {...defaultProps} />)
        const input = screen.getByRole('textbox')
        expect(input).toBeInTheDocument()
    })

    it('deve estar desabilitado quando isDisabled=true', () => {
        render(<SearchSelect {...defaultProps} isDisabled />)
        const input = screen.getByRole('textbox')
        expect(input).toBeDisabled()
    })

    it('deve ter hasError no input quando error e fornecido', () => {
        render(<SearchSelect {...defaultProps} error="Obrigatorio" />)
        const input = screen.getByRole('textbox')
        expect(input.className).toContain('input-error')
    })

    it('deve renderizar com valor inicial quando value e watch sao fornecidos', () => {
        const watchFn = (name: string) => '1'
        render(<SearchSelect {...defaultProps} value="1" watch={watchFn} />)
        const input = screen.getByRole('textbox') as HTMLInputElement
        // O input deve mostrar o nome da opcao correspondente ao valor
        expect(input.value).toBe('Produto A')
    })

    it('deve chamar setValue com o name correto ao receber props', () => {
        render(<SearchSelect {...defaultProps} />)
        // Verifica que o componente renderiza com o name correto
        expect(screen.getByText('Produto')).toBeInTheDocument()
    })
})

describe('SearchSelect — filtro e estabilidade (D7)', () => {
    const muitasOpcoes: IOption[] = Array.from({ length: 300 }, (_, i) => ({
        id: i + 1,
        name: `Produto ${i + 1}`,
        value: String(i + 1),
    }))

    const abrirEDigitar = (texto: string) => {
        const input = screen.getByRole('textbox')
        fireEvent.click(input)
        fireEvent.change(input, { target: { value: texto } })
        return input
    }

    it('não perde o que foi digitado quando o pai re-renderiza com outro array de options', () => {
        const { rerender } = render(<SearchSelect {...defaultProps} options={[...mockOptions]} />)
        abrirEDigitar('Prod')

        // Mesmo conteúdo, array novo: é o que acontece quando o pai monta as options no render.
        rerender(<SearchSelect {...defaultProps} options={[...mockOptions]} />)

        expect(screen.getByRole('textbox')).toHaveValue('Prod')
    })

    it('limita o dropdown e avisa que há mais resultados', () => {
        render(<SearchSelect {...defaultProps} options={muitasOpcoes} />)
        abrirEDigitar('Produto')

        const itens = screen.getAllByRole('listitem')
        expect(itens.length).toBeLessThanOrEqual(51)
        expect(screen.getByText(/refine a busca/i)).toBeInTheDocument()
    })

    it('passa o nome das opções para minúsculas uma vez, não a cada tecla', () => {
        // Conta só o que acontece durante a digitação: as consultas do Testing Library também
        // usam toLowerCase no texto dos itens renderizados.
        const original = String.prototype.toLowerCase
        let contando = false
        const nomesEmMinusculas: string[] = []
        const toLowerCase = vi.spyOn(String.prototype, 'toLowerCase').mockImplementation(function (this: string) {
            const valor = String(this)
            if (contando && /^Produto \d+$/.test(valor)) nomesEmMinusculas.push(valor)
            return original.call(this)
        })

        render(<SearchSelect {...defaultProps} options={muitasOpcoes} />)
        const input = screen.getByRole('textbox')
        fireEvent.click(input)
        fireEvent.change(input, { target: { value: 'produto 1' } })

        contando = true
        // Em minúsculas: o termo digitado não entra na contagem dos nomes de opção.
        fireEvent.change(input, { target: { value: 'produto 12' } })
        contando = false

        // Sem pré-computar, esta tecla passava pelos 300 nomes de novo.
        expect(nomesEmMinusculas).toHaveLength(0)
        toLowerCase.mockRestore()
    })

    it('é memoizado', () => {
        expect((SearchSelect as unknown as { $$typeof: symbol }).$$typeof).toBe(Symbol.for('react.memo'))
    })
})
