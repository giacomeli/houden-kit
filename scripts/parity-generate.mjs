// Gera as fixtures de paridade renderizando os componentes do app de origem no commit-base.
//
// Os casos (`tests/parity/cases`) e o gerador são copiados para `.parity/source/parity/` e rodam com o
// Vitest e o node_modules do próprio app de origem. Assim o componente de origem, o React e o Testing
// Library vêm da mesma instalação, sem duas cópias do React na mesma página.
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, readFileSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { PARITY_DIR, SOURCE_COMMIT } from './parity-shared.mjs'

const commitFile = join(PARITY_DIR, 'COMMIT')
if (!existsSync(commitFile) || readFileSync(commitFile, 'utf8').trim() !== SOURCE_COMMIT) {
    throw new Error('parity-generate -> rode `npm run parity:extract` antes')
}

const target = join(PARITY_DIR, 'parity')
rmSync(target, { recursive: true, force: true })
cpSync(resolve('tests/parity'), target, {
    recursive: true,
    filter: (source) => !source.includes('/fixtures'),
})

const fixtures = resolve('tests/parity/fixtures')
rmSync(fixtures, { recursive: true, force: true })

execFileSync(
    join(PARITY_DIR, 'node_modules/.bin/vitest'),
    ['run', '--config', join(target, 'generate/vitest.config.mjs'), '--root', PARITY_DIR],
    { stdio: 'inherit', env: { ...process.env, PARITY_FIXTURES_DIR: fixtures, PARITY_HOUDEN_DIR: resolve('.') } },
)
