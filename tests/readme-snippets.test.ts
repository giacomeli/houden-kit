// Os trechos `tsx` do README compilam contra a API atual da lib. Cada bloco vira um arquivo em
// `.readme-snippets/` (fora do git), com `houden-kit` apontando para o `src`, e passa pelo `tsc`.
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const dir = resolve('.readme-snippets')

describe('README', () => {
    it('os trechos tsx compilam', { timeout: 120_000 }, () => {
        const blocks = [...readFileSync('README.md', 'utf8').matchAll(/```tsx\n([\s\S]*?)```/g)].map(([, code]) => code)
        expect(blocks.length).toBeGreaterThanOrEqual(6)

        rmSync(dir, { recursive: true, force: true })
        mkdirSync(dir)
        blocks.forEach((code, i) => {
            writeFileSync(join(dir, `snippet-${i + 1}.tsx`), code)
        })
        writeFileSync(
            join(dir, 'tsconfig.json'),
            JSON.stringify({
                extends: '../tsconfig.json',
                compilerOptions: {
                    noEmit: true,
                    types: [],
                    paths: {
                        'houden-kit': ['../src/index.ts'],
                        'houden-kit/icons': ['../src/icons/index.ts'],
                        'houden-kit/table': ['../src/table/index.ts'],
                        'houden-kit/components/*': ['../src/components/*'],
                    },
                },
                include: ['*.tsx'],
                exclude: [],
            }),
        )

        try {
            execFileSync(resolve('node_modules/.bin/tsc'), ['-p', join(dir, 'tsconfig.json')], { encoding: 'utf8' })
        } catch (error) {
            throw new Error(`trechos do README não compilam:\n${(error as { stdout?: string }).stdout ?? error}`)
        }
    })
})
