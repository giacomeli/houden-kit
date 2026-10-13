// Todo componente e utilitário exportado pelo barrel (`export { default as X }`) tem linha no PORTING.md,
// com a origem no app de origem (ou a indicação de que é novo).
import { readFileSync } from 'node:fs'

describe('PORTING.md', () => {
    it('cobre todos os componentes exportados', () => {
        const barrel = readFileSync('src/index.ts', 'utf8')
        const exported = [...barrel.matchAll(/default as (\w+)/g)].map(([, name]) => name)
        const firstColumns = readFileSync('PORTING.md', 'utf8')
            .split('\n')
            .filter((line) => line.startsWith('| '))
            .map((line) => line.split('|')[1])

        const missing = exported.filter(
            (name) => !firstColumns.some((column) => new RegExp(`\\b${name}\\b`).test(column)),
        )
        expect(missing).toEqual([])
        expect(exported.length).toBeGreaterThan(50)
    })
})
