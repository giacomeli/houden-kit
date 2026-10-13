import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Datas e horas formatadas no fuso local (MessageTimestamp) precisam sair iguais na máquina do dono, no
// gerador de fixtures e no CI.
process.env.TZ = 'UTC'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/setup.ts'],
        include: ['src/**/__tests__/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
        exclude: ['tests/dist-scan.test.ts', 'tests/parity/generate/**', 'node_modules/**'],
        typecheck: {
            enabled: true,
            include: ['tests/types/**/*.test-d.ts'],
        },
    },
})
