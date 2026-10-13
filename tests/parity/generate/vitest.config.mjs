// Configuração do gerador de fixtures. Roda com o Vitest do app de origem, a partir de `.parity/source`
// (ver scripts/parity-generate.mjs). O cache vai para `.parity/` do houden-kit, não para o
// node_modules do app de origem.
import { defineConfig } from 'vitest/config'

// Datas e horas formatadas no fuso local (MessageTimestamp) precisam sair iguais na máquina do dono, no
// gerador de fixtures e no CI.
process.env.TZ = 'UTC'

const houdenDir = process.env.PARITY_HOUDEN_DIR

export default defineConfig({
    cacheDir: `${houdenDir}/.parity/.vite`,
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['parity/generate/**/*.test.tsx'],
        setupFiles: ['parity/generate/setup.ts'],
    },
})
