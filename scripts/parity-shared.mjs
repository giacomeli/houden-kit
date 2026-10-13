import { resolve } from 'node:path'

/** Commit do app de origem que serve de base do port (ver PORTING.md). */
export const SOURCE_COMMIT = '1e5c1c3efd3f51ea48c2277ec0961c56e44985e8'

/** Repositório do app de origem, com dependências instaladas. Só a geração de fixtures precisa dele. */
export function sourceDir() {
    const dir = process.env.PARITY_SOURCE_DIR
    if (!dir) throw new Error('parity -> defina PARITY_SOURCE_DIR com o caminho do repositório do app de origem')
    return resolve(dir)
}

/** Cópia do app de origem extraída por `git archive`. Fica fora do git (ver .gitignore). */
export const PARITY_DIR = resolve('.parity/source')
