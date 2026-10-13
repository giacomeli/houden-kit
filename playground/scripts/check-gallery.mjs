// Garante que todo componente exportado pelo barrel da lib (`export { default as X }`) aparece no
// playground, na galeria ou num padrão de tela (como `<X` ou `X(`, para os utilitários de toast).
import { globSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const barrel = readFileSync(new URL('../../src/index.ts', import.meta.url), 'utf8')
const exported = [...barrel.matchAll(/default as (\w+)/g)].map(([, name]) => name)

const source = globSync('src/**/*.tsx', { cwd: root })
    .map((file) => readFileSync(`${root}/${file}`, 'utf8'))
    .join('\n')

/** Componentes que o playground usa indiretamente, com o motivo. */
const INDIRECT = {
    RouteProgressBar: 'renderizado pelo AppShell; uma segunda instância desenharia duas barras',
}

const missing = exported
    .filter((name) => !(name in INDIRECT))
    .filter((name) => !new RegExp(`<${name}[\\s/>]|\\b${name}\\(`).test(source))

if (missing.length) {
    console.error(`check-gallery -> ${missing.length} componente(s) fora do playground: ${missing.join(', ')}`)
    process.exit(1)
}
console.log(`check-gallery -> ok (${exported.length} componentes exportados aparecem no playground)`)
