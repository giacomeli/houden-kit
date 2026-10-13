// Verificação da CSP no navegador (requisito 24). Sobe o `vite preview` do playground com um header CSP,
// abre o Chrome headless pelo protocolo de depuração (CDP) e percorre as oito rotas nos dois temas e nas
// duas variantes da Sidebar, abrindo modais, gavetas e toasts e enviando no chat. Roda duas vezes:
//
// 1. Com o header atual do template: só pode haver bloqueio de imagem `data:` (SVG do DaisyUI).
// 2. Com o header que a lib exige (template + `img-src 'self' data:`): nenhum problema.
//
// Problemas: violação de CSP, erro de JavaScript na página ou requisição para outra origem.
// Pré-requisito: `npm run playground:build`. Chrome em CHROME_PATH (ou no caminho padrão do sistema).
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = Number(process.env.CSP_CHECK_PORT ?? 4179)
const ORIGIN = `http://localhost:${PORT}`
const playgroundDir = fileURLToPath(new URL('..', import.meta.url))

const ROUTES = [
    '/',
    '/padroes/lista',
    '/padroes/detalhe',
    '/padroes/formulario',
    '/padroes/aprovacao',
    '/padroes/painel',
    '/padroes/chat',
    '/padroes/personalizado',
]
const THEMES = ['houdenTheme', 'houdenThemeDark']
const VARIANTS = ['legacy', 'rail']

/** Interações por rota, executadas na página. Cada passo clica num botão pelo texto ou por seletor. */
const INTERACTIONS = {
    '/': ['Abrir modal', 'Abrir filtros', 'Confirmar exclusão', 'Toast de sucesso', 'Loader por 1,5 s'],
    '/padroes/lista': ['Filtros'],
    '/padroes/detalhe': ['Excluir'],
    '/padroes/formulario': ['Salvar pedido'],
    '/padroes/aprovacao': ['Recusar'],
    '/padroes/chat': ['@chat'],
    '/padroes/personalizado': ['Alfa Distribuidora 1'],
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function chromePath() {
    const candidates = [
        process.env.CHROME_PATH,
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
    ].filter(Boolean)
    const found = candidates.find((path) => existsSync(path))
    if (!found) throw new Error('check-csp -> Chrome não encontrado; defina CHROME_PATH')
    return found
}

async function waitForServer() {
    for (let attempt = 0; attempt < 60; attempt++) {
        try {
            const response = await fetch(`${ORIGIN}/`)
            if (response.ok) return response.headers.get('content-security-policy')
        } catch {
            // ainda subindo
        }
        await sleep(250)
    }
    throw new Error('check-csp -> o preview não respondeu')
}

function launchChrome(profileDir) {
    const chrome = spawn(
        chromePath(),
        [
            '--headless=new',
            '--remote-debugging-port=0',
            `--user-data-dir=${profileDir}`,
            '--no-first-run',
            '--no-default-browser-check',
            '--window-size=1366,900',
            'about:blank',
        ],
        { stdio: ['ignore', 'ignore', 'pipe'] },
    )
    const wsUrl = new Promise((resolve, reject) => {
        let buffer = ''
        chrome.stderr.on('data', (chunk) => {
            buffer += chunk
            const match = buffer.match(/DevTools listening on (ws:\/\/\S+)/)
            if (match) resolve(match[1])
        })
        chrome.on('exit', (code) => reject(new Error(`check-csp -> o Chrome saiu com código ${code}`)))
    })
    return { chrome, wsUrl }
}

function connect(wsUrl) {
    const socket = new WebSocket(wsUrl)
    let nextId = 0
    const pending = new Map()
    const listeners = new Set()
    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data)
        if (message.id) {
            const done = pending.get(message.id)
            pending.delete(message.id)
            done?.(message)
        } else {
            for (const listener of listeners) listener(message)
        }
    })
    const send = (method, params = {}, sessionId) =>
        new Promise((resolve, reject) => {
            const id = ++nextId
            pending.set(id, (message) =>
                message.error ? reject(new Error(message.error.message)) : resolve(message.result),
            )
            socket.send(JSON.stringify({ id, method, params, sessionId }))
        })
    const opened = new Promise((resolve, reject) => {
        socket.addEventListener('open', resolve)
        socket.addEventListener('error', reject)
    })
    return { opened, send, listeners, close: () => socket.close() }
}

/** Código executado na página: clica nos passos e devolve os que não encontrou. */
function interactionScript(steps) {
    return `(async () => {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
        const missing = []
        for (const step of ${JSON.stringify(steps)}) {
            if (step === '@chat') {
                const field = document.querySelector('textarea')
                const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set
                setter.call(field, 'Qual a meta do mês?')
                field.dispatchEvent(new Event('input', { bubbles: true }))
                await sleep(50)
                document.querySelector('[aria-label="Enviar mensagem"]').click()
                await sleep(1500)
                continue
            }
            const target = [...document.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(step))
            if (!target) { missing.push(step); continue }
            target.click()
            await sleep(400)
            // Fecha o que abriu (Escape fecha Modal, FilterDrawer e o painel do trilho)
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
            await sleep(150)
        }
        const rail = document.querySelector('aside[data-trilho] nav button')
        if (rail) { rail.click(); await sleep(400) }
        return missing
    })()`
}

/** Uma rodada completa sob um header CSP. Devolve os problemas encontrados e o número de visitas. */
async function runSuite(csp) {
    const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
        cwd: playgroundDir,
        stdio: 'ignore',
        env: { ...process.env, PLAYGROUND_CSP: csp },
    })
    const profileDir = mkdtempSync(join(tmpdir(), 'houden-kit-csp-'))
    let chrome
    const problems = []
    let visits = 0

    try {
        const header = await waitForServer()
        if (header !== csp) throw new Error(`check-csp -> header do preview inesperado: ${header}`)

        const launched = launchChrome(profileDir)
        chrome = launched.chrome
        const cdp = connect(await launched.wsUrl)
        await cdp.opened

        const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' })
        const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true })
        for (const domain of ['Page', 'Runtime', 'Log', 'Network']) await cdp.send(`${domain}.enable`, {}, sessionId)

        let current = ''
        let loaded = () => {}
        cdp.listeners.add(({ method, params, sessionId: from }) => {
            if (from !== sessionId) return
            if (method === 'Page.loadEventFired') loaded()
            if (method === 'Log.entryAdded') {
                const { entry } = params
                if (entry.source === 'security' || /Content Security Policy/i.test(entry.text)) {
                    problems.push(`${current}: CSP -> ${entry.text}`)
                }
            }
            if (method === 'Runtime.consoleAPICalled') {
                const text = params.args.map((arg) => arg.value ?? arg.description ?? '').join(' ')
                if (text.startsWith('[CSP]')) problems.push(`${current}: ${text}`)
            }
            if (method === 'Runtime.exceptionThrown') {
                problems.push(
                    `${current}: erro de JavaScript -> ${params.exceptionDetails.exception?.description ?? params.exceptionDetails.text}`,
                )
            }
            if (method === 'Network.requestWillBeSent') {
                const { url } = params.request
                if (!url.startsWith(ORIGIN) && !url.startsWith('data:'))
                    problems.push(`${current}: requisição externa -> ${url}`)
            }
        })

        const navigate = async (url) => {
            const done = new Promise((resolve) => {
                loaded = resolve
            })
            await cdp.send('Page.navigate', { url }, sessionId)
            await done
        }

        for (const theme of THEMES) {
            for (const variant of VARIANTS) {
                await navigate(`${ORIGIN}/`)
                await cdp.send(
                    'Runtime.evaluate',
                    {
                        expression: `localStorage.setItem('houden-kit.theme', '${theme}'); localStorage.setItem('houden-kit.sidebarVariant', '${variant}')`,
                    },
                    sessionId,
                )
                for (const route of ROUTES) {
                    current = `${route} [${theme}, ${variant}]`
                    await navigate(`${ORIGIN}${route}`)
                    await sleep(800)
                    const applied = await cdp.send(
                        'Runtime.evaluate',
                        { expression: 'document.documentElement.dataset.theme', returnByValue: true },
                        sessionId,
                    )
                    if (applied.result.value !== theme)
                        problems.push(`${current}: tema aplicado foi ${applied.result.value}`)
                    const result = await cdp.send(
                        'Runtime.evaluate',
                        {
                            expression: interactionScript(INTERACTIONS[route] ?? []),
                            awaitPromise: true,
                            returnByValue: true,
                        },
                        sessionId,
                    )
                    for (const step of result.result.value ?? [])
                        problems.push(`${current}: botão não encontrado -> ${step}`)
                    await sleep(500)
                    visits++
                }
            }
        }
        cdp.close()
    } finally {
        chrome?.kill()
        preview.kill()
        rmSync(profileDir, { recursive: true, force: true })
        await sleep(300)
    }
    return { problems: [...new Set(problems)], visits }
}

const isDataImage = (problem) => /Loading the image 'data:|\[CSP\] img-src data/.test(problem)

// Rodada 1: header atual do template. Só pode haver bloqueio de imagem `data:` (SVG do DaisyUI).
const TEMPLATE_CSP = "default-src 'self'; connect-src 'self'"
const strict = await runSuite(TEMPLATE_CSP)
const unexpected = strict.problems.filter((problem) => !isDataImage(problem))
const dataImages = strict.problems.length - unexpected.length

// Rodada 2: header que a lib exige (template + img-src data:). Nenhum problema.
const REQUIRED_CSP = `${TEMPLATE_CSP}; img-src 'self' data:`
const required = await runSuite(REQUIRED_CSP)

const failures = [...unexpected.map((p) => `[template] ${p}`), ...required.problems.map((p) => `[exigido] ${p}`)]
if (failures.length) {
    console.error(`check-csp -> ${failures.length} problema(s):\n- ${failures.join('\n- ')}`)
    process.exit(1)
}
console.log(
    `check-csp -> header do template (${TEMPLATE_CSP}): ${strict.visits} visitas, só bloqueios de imagem data: (${dataImages})`,
)
console.log(`check-csp -> header exigido (${REQUIRED_CSP}): ${required.visits} visitas, nenhuma violação`)
