import { act, renderHook } from '@testing-library/react'
import { ILegacyColumn, useLegacyTanStackTable } from '../useLegacyTanStackTable'

const columns: ILegacyColumn[] = [
    { name: 'ID', selector: (row) => row.id, sortable: true, width: '80' },
    { name: 'Nome', selector: (row) => row.name },
    { name: 'Categoria', selector: (row) => row.category, width: 'auto' },
]

const data = Array.from({ length: 45 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}`, category: 'A' }))

describe('useLegacyTanStackTable', () => {
    it('traduz colunas legadas para o formato do TanStack', () => {
        const { result } = renderHook(() => useLegacyTanStackTable({ columns, data }))

        const tableColumns = result.current.table.getAllColumns()
        expect(tableColumns).toHaveLength(3)
        expect(tableColumns[0].columnDef.header).toBe('ID')
        expect(tableColumns[0].getCanSort()).toBe(true)
        expect(tableColumns[1].getCanSort()).toBe(false)
    })

    it('não define largura fixa para colunas com width "auto" (equivalente ao grow)', () => {
        const { result } = renderHook(() => useLegacyTanStackTable({ columns, data }))

        const categoriaColumn = result.current.table.getColumn('col_2')
        expect(categoriaColumn?.columnDef.size).toBeUndefined()
    })

    it('define largura fixa quando width é um número de pixel válido', () => {
        const { result } = renderHook(() => useLegacyTanStackTable({ columns, data }))

        const idColumn = result.current.table.getColumn('col_0')
        expect(idColumn?.columnDef.size).toBe(80)
    })

    it('extrai o número de pixels de strings com unidade, ex: "70px" (formato usado em ticketColumns.tsx)', () => {
        const columnsWithUnit: ILegacyColumn[] = [{ name: 'ID', selector: (row) => row.id, width: '70px' }]
        const { result } = renderHook(() => useLegacyTanStackTable({ columns: columnsWithUnit, data }))

        expect(result.current.table.getColumn('col_0')?.columnDef.size).toBe(70)
    })

    it('ordena as linhas no client mesmo em modo paginationServer (replica o react-data-table-component)', () => {
        const unsorted = [
            { id: 3, name: 'C' },
            { id: 1, name: 'A' },
            { id: 2, name: 'B' },
        ]
        const sortableColumns: ILegacyColumn[] = [{ name: 'ID', selector: (row) => row.id, sortable: true }]
        const { result } = renderHook(() =>
            useLegacyTanStackTable({
                columns: sortableColumns,
                data: unsorted,
                paginationServer: true,
                paginationTotalRows: unsorted.length,
            }),
        )

        act(() => {
            result.current.table.getColumn('col_0')?.toggleSorting(false)
        })

        const sortedIds = result.current.table.getRowModel().rows.map((row) => row.original.id)
        expect(sortedIds).toEqual([1, 2, 3])
    })

    it('pagina no client quando paginationServer é false', () => {
        const { result } = renderHook(() => useLegacyTanStackTable({ columns, data, paginationPerPage: 20 }))

        expect(result.current.totalRows).toBe(45)
        expect(result.current.totalPages).toBe(3)
        expect(result.current.table.getRowModel().rows).toHaveLength(20)
    })

    it('avança de página no modo client via goToPage', () => {
        const { result } = renderHook(() => useLegacyTanStackTable({ columns, data, paginationPerPage: 20 }))

        act(() => {
            result.current.goToPage(3)
        })

        expect(result.current.currentPage).toBe(3)
        expect(result.current.table.getRowModel().rows).toHaveLength(5)
    })

    it('no modo servidor, goToPage chama onChangePage em vez de paginar localmente', () => {
        const onChangePage = vi.fn()
        const { result } = renderHook(() =>
            useLegacyTanStackTable({
                columns,
                data,
                paginationServer: true,
                paginationTotalRows: 200,
                onChangePage,
            }),
        )

        act(() => {
            result.current.goToPage(2)
        })

        expect(onChangePage).toHaveBeenCalledWith(2)
        expect(result.current.currentPage).toBe(2)
        expect(result.current.totalRows).toBe(200)
    })

    it('changePageSize reseta para a primeira página e chama onChangeRowsPerPage no modo servidor', async () => {
        const onChangeRowsPerPage = vi.fn()
        const { result } = renderHook(() =>
            useLegacyTanStackTable({
                columns,
                data,
                paginationServer: true,
                paginationTotalRows: 200,
                onChangeRowsPerPage,
            }),
        )

        act(() => {
            result.current.goToPage(3)
        })

        await act(async () => {
            await result.current.changePageSize(50)
        })

        expect(onChangeRowsPerPage).toHaveBeenCalledWith(50, 1)
        expect(result.current.currentPage).toBe(1)
        expect(result.current.pageSize).toBe(50)
    })

    it('changePageSize pagina localmente no modo client', () => {
        const { result } = renderHook(() => useLegacyTanStackTable({ columns, data, paginationPerPage: 20 }))

        act(() => {
            result.current.changePageSize(50)
        })

        expect(result.current.pageSize).toBe(50)
        expect(result.current.totalPages).toBe(1)
        expect(result.current.table.getRowModel().rows).toHaveLength(45)
    })
})
