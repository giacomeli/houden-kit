// Extrai o app de origem do commit-base para `.parity/source/` por `git archive`, que só lê o repositório.
// O `node_modules` vira um link simbólico dentro de `.parity/`, para o render do app de origem usar as
// dependências dele. Nada é escrito na árvore do app de origem.
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PARITY_DIR, SOURCE_COMMIT, sourceDir } from './parity-shared.mjs'

const SOURCE_DIR = sourceDir()

if (!existsSync(join(SOURCE_DIR, '.git'))) {
    throw new Error(`parity-extract -> repositório git não encontrado em ${SOURCE_DIR}`)
}
if (!existsSync(join(SOURCE_DIR, 'node_modules'))) {
    throw new Error(`parity-extract -> ${SOURCE_DIR}/node_modules ausente; instale as dependências do app de origem`)
}

rmSync(PARITY_DIR, { recursive: true, force: true })
mkdirSync(PARITY_DIR, { recursive: true })

execSync(`git -C "${SOURCE_DIR}" archive ${SOURCE_COMMIT} src tsconfig.json | tar -x -C "${PARITY_DIR}"`, {
    stdio: 'inherit',
})
symlinkSync(join(SOURCE_DIR, 'node_modules'), join(PARITY_DIR, 'node_modules'), 'dir')
writeFileSync(join(PARITY_DIR, 'COMMIT'), `${SOURCE_COMMIT}\n`)

console.log(`parity-extract -> app de origem ${SOURCE_COMMIT.slice(0, 8)} extraído em ${PARITY_DIR}`)
