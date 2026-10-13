import { render, screen } from '@testing-library/react'
import { toast } from 'react-toastify'
import Toaster from '../index'

// O setup global mocka o react-toastify (como no app de origem); aqui o componente real é o que importa.
vi.unmock('react-toastify')

describe('Toaster', () => {
    it('mostra o toast disparado', async () => {
        render(<Toaster />)
        toast.success('Pedido salvo')
        expect(await screen.findByText('Pedido salvo')).toBeInTheDocument()
    })

    it('usa top-center por padrão, como o app de origem', async () => {
        const { container } = render(<Toaster />)
        toast.info('Aviso')
        await screen.findByText('Aviso')
        expect(container.querySelector('.Toastify__toast-container--top-center')).toBeInTheDocument()
    })

    it('aceita sobrescrever a posição', async () => {
        const { container } = render(<Toaster position="bottom-right" />)
        toast.info('Outro aviso')
        await screen.findByText('Outro aviso')
        expect(container.querySelector('.Toastify__toast-container--bottom-right')).toBeInTheDocument()
    })
})
