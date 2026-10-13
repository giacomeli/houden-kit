'use client'
import { ChangeEvent } from 'react'

interface ITanStackPaginationBarProps {
    currentPage: number
    totalPages: number
    totalRows: number
    pageSize: number
    onGoToPage: (page: number) => void
    onChangePageSize: (size: number) => void
    itensPerPageOption?: number[]
    className?: string
}

const TEXT_COLOR = 'rgba(0, 0, 0, 0.54)'
const DISABLED_COLOR = 'rgba(0, 0, 0, 0.18)'

// Ícones SVG idênticos aos usados internamente pelo react-data-table-component
// (baseados no set "Material Icons": first_page, chevron_left, chevron_right, last_page)
const IconFirstPage = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
    </svg>
)
const IconPrevious = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
)
const IconNext = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
)
const IconLastPage = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
    </svg>
)

/**
 * Barra de paginação puramente apresentacional: não tem estado próprio, lê
 * tudo via props. Pode ser renderizada quantas vezes a página quiser (topo,
 * rodapé, ou nenhuma) sem risco de dessincronia, já que todas as instâncias
 * refletem o mesmo estado vindo de `useLegacyTanStackTable`.
 */
const TanStackPaginationBar = ({
    currentPage,
    totalPages,
    totalRows,
    pageSize,
    onGoToPage,
    onChangePageSize,
    itensPerPageOption = [20, 50, 100],
    className = '',
}: ITanStackPaginationBarProps) => {
    const from = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1
    const to = Math.min(currentPage * pageSize, totalRows)

    const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onChangePageSize(Number(e.target.value))
    }

    const navButtonStyle = (disabled: boolean) => ({
        color: disabled ? DISABLED_COLOR : TEXT_COLOR,
    })

    const navButtonClass =
        'flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 ' +
        'hover:bg-black/5 disabled:hover:bg-transparent disabled:cursor-default'

    return (
        <div className={`flex items-center gap-4 ${className}`} style={{ color: TEXT_COLOR, fontSize: '13px' }}>
            <span style={{ margin: '0 4px' }}>Itens por página</span>
            <div className="relative inline-flex items-center mr-2">
                <select
                    className="appearance-none bg-transparent cursor-pointer focus:outline-none pl-2 pr-5"
                    style={{ color: 'inherit', fontSize: 'inherit' }}
                    value={pageSize}
                    onChange={handlePageSizeChange}
                >
                    {itensPerPageOption.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                    <option value={totalRows}>Todos</option>
                </select>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="pointer-events-none absolute right-0">
                    <path d="M7 10l5 5 5-5z" />
                </svg>
            </div>

            <span style={{ margin: '0 24px' }}>
                {from}-{to} de {totalRows}
            </span>

            <div className="flex items-center" style={{ whiteSpace: 'nowrap' }}>
                <button
                    type="button"
                    className={navButtonClass}
                    disabled={currentPage <= 1}
                    onClick={() => onGoToPage(1)}
                    aria-label="Primeira página"
                    style={navButtonStyle(currentPage <= 1)}
                >
                    <IconFirstPage />
                </button>
                <button
                    type="button"
                    className={navButtonClass}
                    disabled={currentPage <= 1}
                    onClick={() => onGoToPage(currentPage - 1)}
                    aria-label="Página anterior"
                    style={navButtonStyle(currentPage <= 1)}
                >
                    <IconPrevious />
                </button>
                <button
                    type="button"
                    className={navButtonClass}
                    disabled={currentPage >= totalPages}
                    onClick={() => onGoToPage(currentPage + 1)}
                    aria-label="Próxima página"
                    style={navButtonStyle(currentPage >= totalPages)}
                >
                    <IconNext />
                </button>
                <button
                    type="button"
                    className={navButtonClass}
                    disabled={currentPage >= totalPages}
                    onClick={() => onGoToPage(totalPages)}
                    aria-label="Última página"
                    style={navButtonStyle(currentPage >= totalPages)}
                >
                    <IconLastPage />
                </button>
            </div>
        </div>
    )
}

export default TanStackPaginationBar
