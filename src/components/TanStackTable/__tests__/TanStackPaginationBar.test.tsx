import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TanStackPaginationBar from '../TanStackPaginationBar'

const baseProps = {
    currentPage: 2,
    totalPages: 5,
    totalRows: 92,
    pageSize: 20,
    onGoToPage: vi.fn(),
    onChangePageSize: vi.fn(),
}

describe('TanStackPaginationBar', () => {
    it('exibe o intervalo de linhas e o total', () => {
        render(<TanStackPaginationBar {...baseProps} />)

        expect(screen.getByText('21-40 de 92')).toBeInTheDocument()
    })

    it('desabilita "primeira" e "anterior" na primeira página', () => {
        render(<TanStackPaginationBar {...baseProps} currentPage={1} />)

        expect(screen.getByLabelText('Primeira página')).toBeDisabled()
        expect(screen.getByLabelText('Página anterior')).toBeDisabled()
        expect(screen.getByLabelText('Próxima página')).not.toBeDisabled()
        expect(screen.getByLabelText('Última página')).not.toBeDisabled()
    })

    it('desabilita "próxima" e "última" na última página', () => {
        render(<TanStackPaginationBar {...baseProps} currentPage={5} />)

        expect(screen.getByLabelText('Próxima página')).toBeDisabled()
        expect(screen.getByLabelText('Última página')).toBeDisabled()
        expect(screen.getByLabelText('Primeira página')).not.toBeDisabled()
        expect(screen.getByLabelText('Página anterior')).not.toBeDisabled()
    })

    it('chama onGoToPage com a página correta em cada botão', async () => {
        const onGoToPage = vi.fn()
        const user = userEvent.setup()
        render(<TanStackPaginationBar {...baseProps} onGoToPage={onGoToPage} />)

        await user.click(screen.getByLabelText('Primeira página'))
        expect(onGoToPage).toHaveBeenCalledWith(1)

        await user.click(screen.getByLabelText('Página anterior'))
        expect(onGoToPage).toHaveBeenCalledWith(1)

        await user.click(screen.getByLabelText('Próxima página'))
        expect(onGoToPage).toHaveBeenCalledWith(3)

        await user.click(screen.getByLabelText('Última página'))
        expect(onGoToPage).toHaveBeenCalledWith(5)
    })

    it('chama onChangePageSize com o novo valor selecionado', async () => {
        const onChangePageSize = vi.fn()
        const user = userEvent.setup()
        render(<TanStackPaginationBar {...baseProps} onChangePageSize={onChangePageSize} />)

        await user.selectOptions(screen.getByRole('combobox'), '50')

        expect(onChangePageSize).toHaveBeenCalledWith(50)
    })
})
