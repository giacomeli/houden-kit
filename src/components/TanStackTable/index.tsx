'use client'
import { flexRender, Table } from '@tanstack/react-table'
import { ChevronDown, ChevronsUpDown, ChevronUp, ThumbsDown } from 'lucide-react'
import { Fragment, useState } from 'react'
import { iconDefaults } from '../../icons/defaults'
import Alert from '../Layout/Alert'

interface ITanStackTableProps {
    table: Table<any>
    expandable?: boolean
    expandableRowsComponent?: React.FC<{ data: any }>
    expandedRow?: boolean
    onRowClicked?: (row: any) => void
    className?: string
    isLoading?: boolean
}

const TanStackTable: React.FC<ITanStackTableProps> = ({
    table,
    expandable = false,
    expandableRowsComponent: ExpandableComponent,
    expandedRow = false,
    onRowClicked,
    className = '',
    isLoading = false,
}) => {
    const rows = table.getRowModel().rows

    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(() => {
        if (expandedRow) {
            return rows.reduce((acc, row) => ({ ...acc, [row.id]: true }), {})
        }
        return {}
    })

    const toggleRowExpanded = (rowId: string) => {
        setExpandedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }))
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <span className="loading loading-spinner loading-lg text-accent my-8" />
            </div>
        )
    }

    if (rows.length === 0) {
        return (
            <div className="w-full flex justify-center py-10">
                <Alert
                    message="Nenhum resultado encontrado"
                    className="alert rounded-md py-4 text-sm w-fit"
                    icon={<ThumbsDown {...iconDefaults} className="text-lg" />}
                />
            </div>
        )
    }

    return (
        <div className={`w-full ${className}`}>
            <div className="overflow-x-auto rounded-lg border border-base-300">
                <table className="table table-zebra">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="bg-primary text-primary-content">
                                {expandable && <th className="w-12 bg-primary"></th>}
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className={`bg-primary ${header.column.getCanSort() ? 'cursor-pointer select-none hover:bg-primary/80' : ''}`}
                                        style={{
                                            width: header.getSize() !== 150 ? header.getSize() : undefined,
                                        }}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && (
                                                <span className="text-xs opacity-70">
                                                    {{
                                                        asc: <ChevronUp {...iconDefaults} />,
                                                        desc: <ChevronDown {...iconDefaults} />,
                                                    }[header.column.getIsSorted() as string] ?? (
                                                        <ChevronsUpDown {...iconDefaults} className="opacity-50" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <Fragment key={row.id}>
                                <tr
                                    className={`
                                        hover:bg-base-200 transition-colors
                                        ${onRowClicked ? 'cursor-pointer' : ''}
                                    `}
                                    onClick={() => onRowClicked?.(row.original)}
                                >
                                    {expandable && (
                                        <td className="w-12">
                                            <button
                                                className="btn btn-ghost btn-xs"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    toggleRowExpanded(row.id)
                                                }}
                                            >
                                                {expandedRows[row.id] ? (
                                                    <ChevronUp {...iconDefaults} />
                                                ) : (
                                                    <ChevronDown {...iconDefaults} />
                                                )}
                                            </button>
                                        </td>
                                    )}
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                                {expandable && expandedRows[row.id] && ExpandableComponent && (
                                    <tr>
                                        <td colSpan={row.getVisibleCells().length + 1} className="bg-base-200 p-4">
                                            <ExpandableComponent data={row.original} />
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TanStackTable
