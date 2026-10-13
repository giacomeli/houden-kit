import { existsSync, globSync } from 'node:fs'
import { isAbsolute } from 'node:path'
import react from '@vitejs/plugin-react'
import preserveDirectives from 'rollup-preserve-directives'
import { defineConfig } from 'vite'

// Todo módulo de componente é entrada do build. Com `preserveModules`, um export nomeado que nenhum
// outro módulo usa poderia sair no tree-shaking; como entrada, ele fica.
const componentModules = globSync('src/components/**/*.{ts,tsx}').filter(
    (file) => !file.includes('/__tests__/') && !/\.test\.tsx?$/.test(file),
)

const entries = ['src/index.ts', 'src/icons/index.ts', 'src/table/index.ts']
    .filter((file) => existsSync(file))
    .concat(componentModules)

export default defineConfig({
    plugins: [react(), preserveDirectives()],
    build: {
        target: 'es2022',
        outDir: 'dist',
        emptyOutDir: true,
        copyPublicDir: false,
        sourcemap: true,
        minify: false,
        lib: {
            entry: entries,
            formats: ['es'],
        },
        rollupOptions: {
            // Toda dependência fica externa: o consumidor resolve react, lucide-react, daisyui etc.
            external: (id) => !id.startsWith('.') && !isAbsolute(id) && !id.startsWith('\0'),
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].js',
            },
        },
    },
})
