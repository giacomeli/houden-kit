// Roda o @arethetypeswrong/cli sobre o tarball. A entrada curinga `./components/*` não é testada pelo
// attw, então cada import profundo existente no `dist` entra explicitamente, junto com as chaves
// explícitas do `exports`. Os arquivos CSS saem, porque não têm tipos.
import { execFileSync } from 'node:child_process'
import { globSync, readFileSync } from 'node:fs'

const { exports } = JSON.parse(readFileSync('package.json', 'utf8'))

const deepImports = globSync('dist/components/**/index.js').map(
    (file) => `./${file.replace(/^dist\//, '').replace(/\/index\.js$/, '')}`,
)
const explicit = Object.keys(exports).filter((key) => key.startsWith('./components/') && !key.includes('*'))

execFileSync(
    'attw',
    [
        '--pack',
        '.',
        '--profile',
        'esm-only',
        '--exclude-entrypoints',
        './theme.css',
        './fonts.css',
        '--include-entrypoints',
        ...new Set([...deepImports, ...explicit]),
    ],
    { stdio: 'inherit' },
)
