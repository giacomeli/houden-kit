// App mínimo que consome o tarball do houden-kit. Nenhuma classe da lib aparece aqui: o CSS gerado só
// as contém se o Tailwind do consumidor escanear o `dist` da lib pelo `@source` do theme.css.
import { Button } from 'houden-kit'
import DeepButton from 'houden-kit/components/Form/Button'
import TanStackTable from 'houden-kit/components/TanStackTable'
import TanStackPaginationBar from 'houden-kit/components/TanStackTable/TanStackPaginationBar'
import { useLegacyTanStackTable } from 'houden-kit/components/TanStackTable/useLegacyTanStackTable'
import { Eye } from 'houden-kit/icons'
import { getCoreRowModel, useReactTable } from 'houden-kit/table'
import { createRoot } from 'react-dom/client'
import './app.css'

function Tabelas() {
    const legacy = useLegacyTanStackTable({ columns: [{ name: 'Nome', selector: (r) => r.nome }], data: [] })
    const table = useReactTable({ data: [], columns: [], getCoreRowModel: getCoreRowModel() })
    return (
        <>
            <TanStackTable table={legacy.table} />
            <TanStackTable table={table} />
            <TanStackPaginationBar
                currentPage={1}
                totalPages={1}
                totalRows={0}
                pageSize={10}
                onGoToPage={() => {}}
                onChangePageSize={() => {}}
            />
        </>
    )
}

createRoot(document.getElementById('root') as HTMLElement).render(
    <main>
        <Button>Barrel</Button>
        <DeepButton isLoading>Profundo</DeepButton>
        <Eye />
        <Tabelas />
    </main>,
)
