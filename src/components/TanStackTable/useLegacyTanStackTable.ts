'use client'
import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

// Formato legado (react-data-table-component), mantido para não exigir reescrever
// os arquivos de colunas existentes em src/mocks/*Columns*.
export interface ILegacyColumn {
    id?: string
    name: string
    selector?: (row: any) => any
    cell?: (row: any) => React.ReactNode
    sortable?: boolean
    width?: string
    minWidth?: string
    maxWidth?: string
}

export interface IUseLegacyTanStackTableParams {
    columns: ILegacyColumn[]
    data: any[]
    paginationServer?: boolean
    paginationTotalRows?: number
    paginationPerPage?: number
    onChangePage?: (page: number) => void
    onChangeRowsPerPage?: (newPerPage: number, page: number) => Promise<void> | void
}

/**
 * Extrai o número de pixels de strings como "70px"/"200px" (formato usado em
 * ticketColumns.tsx e outros arquivos de colunas), replicando o comportamento
 * do `parseInt` já usado no TanStackTable original. Colunas com `grow` (sem
 * `width`) ou `width: 'auto'` ficam sem largura fixa — nesse caso `parseInt`
 * retorna `NaN` e devolvemos `undefined`, deixando o <table> distribuir o
 * espaço restante entre elas (equivalente visual ao `grow`).
 */
const parsePixelWidth = (width?: string): number | undefined => {
    if (!width) return undefined
    const parsed = parseInt(width, 10)
    return Number.isNaN(parsed) ? undefined : parsed
}

export function useLegacyTanStackTable({
    columns: legacyColumns,
    data,
    paginationServer = false,
    paginationTotalRows,
    paginationPerPage = 20,
    onChangePage,
    onChangeRowsPerPage,
}: IUseLegacyTanStackTableParams) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(paginationPerPage)

    const columns = useMemo<ColumnDef<any>[]>(
        () =>
            legacyColumns.map((col, index) => ({
                id: col.id ?? `col_${index}`,
                accessorFn: col.selector,
                header: col.name,
                cell: col.cell ? ({ row }) => col.cell!(row.original) : ({ getValue }) => getValue(),
                enableSorting: col.sortable ?? false,
                size: parsePixelWidth(col.width),
                minSize: parsePixelWidth(col.minWidth),
                maxSize: parsePixelWidth(col.maxWidth),
            })),
        [legacyColumns],
    )

    const totalRows = paginationServer ? (paginationTotalRows ?? 0) : data.length
    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination: paginationServer ? undefined : { pageIndex: currentPage - 1, pageSize },
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        // Ordenação sempre client-side (sobre as linhas já carregadas), independente do modo de
        // paginação — replica o comportamento do react-data-table-component, que ordena a página
        // atual localmente mesmo com paginationServer=true (não há um conceito de "sort no servidor").
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: paginationServer ? undefined : getPaginationRowModel(),
        manualPagination: paginationServer,
        pageCount: paginationServer ? totalPages : undefined,
    })

    const goToPage = (page: number) => {
        setCurrentPage(page)
        if (paginationServer) {
            onChangePage?.(page)
        } else {
            table.setPageIndex(page - 1)
        }
    }

    const changePageSize = async (newSize: number) => {
        setPageSize(newSize)
        setCurrentPage(1)
        if (paginationServer) {
            await onChangeRowsPerPage?.(newSize, 1)
        } else {
            table.setPageSize(newSize)
            table.setPageIndex(0)
        }
    }

    return { table, currentPage, pageSize, totalRows, totalPages, goToPage, changePageSize }
}
