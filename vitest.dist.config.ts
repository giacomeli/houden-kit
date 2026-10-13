import { defineConfig } from 'vitest/config'

// Roda depois do `npm run build`: varre o `dist` publicado, não o código-fonte.
export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        include: ['tests/dist-scan.test.ts'],
    },
})
