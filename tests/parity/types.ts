import type { screen } from '@testing-library/react'
import type userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'

export interface ParityContext {
    user: ReturnType<typeof userEvent.setup>
    screen: typeof screen
}

/**
 * Um caso de paridade. O mesmo caso roda dos dois lados: no gerador, `module` é o módulo do
 * app de origem no commit-base; no teste, é o módulo da lib. Por isso o caso não importa o componente.
 */
export interface ParityCase {
    name: string
    /**
     * `deps` traz os módulos listados em `with`, carregados do mesmo lado (app de origem ou lib). Serve para
     * casos de componentes adaptados, que na lib recebem por slot o que no app de origem vinha embutido.
     */
    render: (module: any, deps: Record<string, any>) => ReactElement
    with?: string[]
    /** Interação antes do snapshot (abrir lista, mostrar senha). */
    interact?: (ctx: ParityContext) => Promise<void>
    before?: () => void
    after?: () => void
}

/** Chave: caminho do módulo sob `src/components`, sem `/index.tsx` nem extensão (ex.: `Form/Button`). */
export type ParityCases = Record<string, ParityCase[]>
