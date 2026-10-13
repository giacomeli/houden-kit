import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TanStackTable from '../index'
import { ILegacyColumn, useLegacyTanStackTable } from '../useLegacyTanStackTable'

const columns: ILegacyColumn[] = [
    { name: 'ID', selector: (row) => row.id },
    { name: 'Nome', selector: (row) => row.name },
]

const data = [
    { id: 1, name: 'Ticket 1' },
    { id: 2, name: 'Ticket 2' },
]

function Harness(props: Partial<React.ComponentProps<typeof TanStackTable>> & { data?: any[] }) {
    const { table } = useLegacyTanStackTable({ columns, data: props.data ?? data })
    return <TanStackTable table={table} {...props} />
}

describe('TanStackTable', () => {
    it('renderiza cabeçalho e linhas', () => {
        render(<Harness />)

        expect(screen.getByText('ID')).toBeInTheDocument()
        expect(screen.getByText('Nome')).toBeInTheDocument()
        expect(screen.getByText('Ticket 1')).toBeInTheDocument()
        expect(screen.getByText('Ticket 2')).toBeInTheDocument()
    })

    it('mostra o spinner quando isLoading é true, sem renderizar a tabela', () => {
        render(<Harness isLoading />)

        expect(screen.queryByText('Ticket 1')).not.toBeInTheDocument()
        expect(document.querySelector('.loading-spinner')).toBeInTheDocument()
    })

    it('mostra "Nenhum resultado encontrado" quando não há linhas e não está carregando', () => {
        render(<Harness data={[]} />)

        expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument()
    })

    it('chama onRowClicked com o dado original da linha', async () => {
        const onRowClicked = vi.fn()
        const user = userEvent.setup()
        render(<Harness onRowClicked={onRowClicked} />)

        await user.click(screen.getByText('Ticket 1'))

        expect(onRowClicked).toHaveBeenCalledWith(data[0])
    })

    it('renderiza o conteúdo expandido quando a linha é expandida', async () => {
        const ExpandableComponent = ({ data }: { data: any }) => <div>Detalhe de {data.name}</div>
        const user = userEvent.setup()
        render(<Harness expandable expandableRowsComponent={ExpandableComponent} />)

        const expandButtons = screen.getAllByRole('button')
        await user.click(expandButtons[0])

        expect(screen.getByText('Detalhe de Ticket 1')).toBeInTheDocument()
    })
})
