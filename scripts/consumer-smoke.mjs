// Prova de consumo real (requisito 22): empacota a lib com `npm pack`, instala o tarball (cópia, não
// link simbólico) num app Vite + Tailwind 4 temporário, builda e confere o CSS gerado.
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, globSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

// README, LICENSE e CHANGELOG são obrigatórios no tarball.
const DOCS_REQUIRED = true
const DOCS = ['README.md', 'LICENSE', 'CHANGELOG.md']

const CONSUMER_DEPS = [
    'react@19.2.4',
    'react-dom@19.2.4',
    'react-hook-form@^7',
    'tailwindcss@4.1.18',
    '@tailwindcss/vite@4.1.18',
    'vite@~7.3.7',
    '@vitejs/plugin-react@^5.2.0',
]

/** Trechos que o CSS do consumidor precisa conter. */
const CSS_CHECKS = [
    { what: 'utility usada só dentro da lib (Button)', needle: 'disabled\\:cursor-not-allowed' },
    { what: 'componente DaisyUI usado só dentro da lib (Button)', needle: '.loading-spinner' },
    { what: 'tema claro', needle: 'houdenTheme' },
    { what: 'tema escuro', needle: 'houdenThemeDark' },
    { what: 'CSS do react-toastify', needle: 'Toastify__toast-container' },
    { what: 'Inter servida da mesma origem', needle: 'url(/assets/inter-' },
]

/**
 * Ícones que o JS do consumidor precisa conter (true) ou não pode conter (false). O lucide monta a classe
 * `lucide-*` em runtime, então a checagem usa o `d` do primeiro `<path>` do ícone, lido do pacote instalado.
 */
const JS_CHECKS = [
    { what: 'ícone usado (houden-kit/icons)', icon: 'eye', present: true },
    { what: 'ícone não usado fora do bundle (tree-shaking do reexport)', icon: 'zap', present: false },
]

function iconPath(app, icon) {
    for (const base of ['node_modules/lucide-react', 'node_modules/houden-kit/node_modules/lucide-react']) {
        const file = join(app, base, `dist/esm/icons/${icon}.mjs`)
        if (existsSync(file)) return readFileSync(file, 'utf8').match(/d: "([^"]+)"/)[1]
    }
    throw new Error(`consumer-smoke -> ícone ${icon} não encontrado no lucide-react instalado`)
}

const root = resolve('.')
const work = mkdtempSync(join(tmpdir(), 'houden-kit-smoke-'))
const run = (command, args, cwd) => execFileSync(command, args, { cwd, encoding: 'utf8', stdio: 'pipe' })
const failures = []

try {
    // Conteúdo do tarball
    const [packed] = JSON.parse(run('npm', ['pack', '--json', '--pack-destination', work], root))
    const files = packed.files.map((f) => f.path)
    const unexpected = files.filter((f) => !f.startsWith('dist/') && f !== 'package.json' && !DOCS.includes(f))
    if (unexpected.length) failures.push(`arquivos inesperados no tarball: ${unexpected.join(', ')}`)
    if (DOCS_REQUIRED) {
        for (const doc of DOCS) if (!files.includes(doc)) failures.push(`${doc} ausente no tarball`)
    }

    // App consumidor
    const app = join(work, 'app')
    cpSync(resolve('tests/consumer/template'), app, { recursive: true })
    run('npm', ['install', '--no-audit', '--no-fund', join(work, packed.filename), ...CONSUMER_DEPS], app)

    const installed = join(app, 'node_modules/houden-kit')
    if (!existsSync(join(installed, 'dist/index.js'))) failures.push('tarball não instalado em node_modules')

    run('npx', ['vite', 'build'], app)

    const cssFiles = globSync(join(app, 'dist/assets/*.css'))
    const css = cssFiles.map((f) => readFileSync(f, 'utf8')).join('\n')
    for (const { what, needle } of CSS_CHECKS) {
        if (!css.includes(needle)) failures.push(`CSS sem ${what} (${needle})`)
    }
    if (!globSync(join(app, 'dist/assets/inter-*.woff2')).length) failures.push('woff2 da Inter ausente em dist/assets')

    const js = globSync(join(app, 'dist/assets/*.js'))
        .map((f) => readFileSync(f, 'utf8'))
        .join('\n')
    for (const { what, icon, present } of JS_CHECKS) {
        if (js.includes(iconPath(app, icon)) !== present)
            failures.push(`JS ${present ? 'sem' : 'com'} ${what} (${icon})`)
    }
} finally {
    rmSync(work, { recursive: true, force: true })
}

if (failures.length) {
    console.error(`consumer-smoke -> ${failures.length} falha(s):\n- ${failures.join('\n- ')}`)
    process.exit(1)
}
console.log(
    `consumer-smoke -> ok (${CSS_CHECKS.length} checagens de CSS, ${JS_CHECKS.length} de JS, tarball sem arquivos inesperados)`,
)
