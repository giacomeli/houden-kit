import { fireEvent, render, screen } from '@testing-library/react'
import Modal from '../index'

vi.mock('react-dom', async () => {
    const actual = await vi.importActual('react-dom')
    return { ...actual, createPortal: (node: React.ReactNode) => node }
})

describe('Modal', () => {
    const onClose = vi.fn()

    beforeEach(() => {
        onClose.mockClear()
    })

    it('deve renderizar children quando isOpen=true', () => {
        render(
            <Modal isOpen={true} onClose={onClose}>
                <p>Conteudo do modal</p>
            </Modal>,
        )

        expect(screen.getByText('Conteudo do modal')).toBeInTheDocument()
    })

    it('nao deve renderizar nada quando isOpen=false', () => {
        const { container } = render(
            <Modal isOpen={false} onClose={onClose}>
                <p>Conteudo do modal</p>
            </Modal>,
        )

        expect(container.innerHTML).toBe('')
    })

    it('deve renderizar o headerText quando fornecido', () => {
        render(
            <Modal isOpen={true} onClose={onClose} headerText="Titulo do Modal">
                <p>Conteudo</p>
            </Modal>,
        )

        expect(screen.getByText('Titulo do Modal')).toBeInTheDocument()
    })

    it('deve chamar onClose ao pressionar Escape', () => {
        render(
            <Modal isOpen={true} onClose={onClose}>
                <p>Conteudo</p>
            </Modal>,
        )

        fireEvent.keyDown(document, { key: 'Escape' })
        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('deve chamar onClose ao clicar no botao de fechar', () => {
        render(
            <Modal isOpen={true} onClose={onClose}>
                <p>Conteudo</p>
            </Modal>,
        )

        // O botão de fechar mostra o X do lucide (no app de origem, o caractere ✕)
        const closeButton = screen.getByRole('button')
        fireEvent.click(closeButton)
        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('deve aplicar className customizado', () => {
        render(
            <Modal isOpen={true} onClose={onClose} className="minha-classe">
                <p>Conteudo</p>
            </Modal>,
        )

        const modalContent = screen.getByText('Conteudo').parentElement?.parentElement
        expect(modalContent?.className).toContain('minha-classe')
    })
})
