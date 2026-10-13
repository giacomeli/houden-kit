import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmDialog, { type ConfirmDialogProps } from '../index'

const montar = (props: Partial<ConfirmDialogProps> = {}) => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    const view = render(
        <ConfirmDialog open title="Aprovar pedido" onConfirm={onConfirm} onCancel={onCancel} {...props} />,
    )
    return { ...view, onConfirm, onCancel, user: userEvent.setup() }
}

describe('ConfirmDialog', () => {
    it('não renderiza fechado', () => {
        montar({ open: false })
        expect(screen.queryByText('Aprovar pedido')).not.toBeInTheDocument()
    })

    it('confirma sem motivo quando não há campo', async () => {
        const { onConfirm, user } = montar({ description: 'O pedido segue para faturamento.' })
        expect(screen.getByText('O pedido segue para faturamento.')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: 'Confirmar' }))
        expect(onConfirm).toHaveBeenCalledWith()
    })

    it('com motivo obrigatório, bloqueia a confirmação vazia e explica', async () => {
        const { onConfirm, user } = montar({ reason: { label: 'Motivo da recusa', required: true } })
        await user.click(screen.getByRole('button', { name: 'Confirmar' }))
        expect(onConfirm).not.toHaveBeenCalled()
        expect(screen.getByText('Informe o motivo.')).toBeInTheDocument()
    })

    it('envia o motivo digitado, sem espaços nas pontas', async () => {
        const { onConfirm, user } = montar({ reason: { label: 'Motivo da recusa', required: true } })
        await user.type(screen.getByLabelText(/Motivo da recusa/), '  Preço acima da tabela  ')
        await user.click(screen.getByRole('button', { name: 'Confirmar' }))
        expect(onConfirm).toHaveBeenCalledWith('Preço acima da tabela')
    })

    it('a mensagem de erro some quando o usuário digita', async () => {
        const { user } = montar({ reason: { label: 'Motivo', required: true } })
        await user.click(screen.getByRole('button', { name: 'Confirmar' }))
        await user.type(screen.getByLabelText(/Motivo/), 'a')
        expect(screen.queryByText('Informe o motivo.')).not.toBeInTheDocument()
    })

    it('cancelar chama onCancel', async () => {
        const { onCancel, user } = montar({ cancelLabel: 'Voltar' })
        await user.click(screen.getByRole('button', { name: 'Voltar' }))
        expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('carregando, desabilita as ações', () => {
        montar({ isLoading: true, tone: 'error', confirmLabel: 'Excluir' })
        expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
        const confirmar = document.querySelector('.btn-error') as HTMLButtonElement
        expect(confirmar).toBeDisabled()
        expect(confirmar.querySelector('.loading')).toBeInTheDocument()
    })

    it('reabre com o campo limpo', async () => {
        const { user, rerender, onConfirm, onCancel } = montar({ reason: { label: 'Motivo' } })
        await user.type(screen.getByLabelText(/Motivo/), 'texto antigo')
        const props = { title: 'Aprovar pedido', onConfirm, onCancel, reason: { label: 'Motivo' } }
        rerender(<ConfirmDialog open={false} {...props} />)
        rerender(<ConfirmDialog open {...props} />)
        expect(screen.getByLabelText(/Motivo/)).toHaveValue('')
    })
})
