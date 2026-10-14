import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/** Header CSP atual do template: nada de inline, CDN ou origem externa. */
export const TEMPLATE_CSP = "default-src 'self'; connect-src 'self'"

/**
 * Header que a lib exige: o do template mais `img-src 'self' data:`. O DaisyUI desenha o spinner
 * (`.loading`), a ponta do `chat-bubble` e o ruído (`--fx-noise`) com SVG em `data:` no `mask-image`, que
 * o `default-src 'self'` bloqueia. Imagem `data:` não executa script; `unsafe-inline` continua fora.
 * `PLAYGROUND_CSP` sobrescreve (o `scripts/check-csp.mjs` roda com os dois).
 */
export const CSP = process.env.PLAYGROUND_CSP ?? `${TEMPLATE_CSP}; img-src 'self' data:`

export default defineConfig({
    // No GitHub Pages, o playground vive em /houden-kit/ (ver .github/workflows/pages.yml).
    base: process.env.PLAYGROUND_BASE ?? '/',
    plugins: [
        react(),
        tailwindcss(),
        {
            // O GitHub Pages não envia header CSP; no build, a mesma política vai numa tag <meta>, para a demonstração
            // pública também rodar sob ela. Só no build: o servidor de dev do Vite usa script inline para o HMR.
            name: 'csp-meta',
            apply: 'build',
            transformIndexHtml: () => [
                {
                    tag: 'meta',
                    attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
                    injectTo: 'head-prepend',
                },
            ],
        },
    ],
    resolve: {
        // O houden-kit entra por `file:..`, que tem o próprio node_modules com React: sem deduplicar, a
        // página carregaria duas cópias e os hooks quebrariam.
        dedupe: ['react', 'react-dom', 'react-hook-form'],
    },
    build: {
        // O padrão do Vite embute arquivos de até 4 KB como `data:`, que a CSP `default-src 'self'` bloqueia
        // em fontes e imagens. Tudo sai como arquivo da mesma origem.
        assetsInlineLimit: 0,
        // A galeria junta todos os componentes da lib num bundle; para um app de referência, isso é esperado.
        chunkSizeWarningLimit: 1000,
    },
    preview: {
        headers: { 'Content-Security-Policy': CSP },
    },
})
