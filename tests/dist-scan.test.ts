// Varredura do `dist` publicado (requisito 14): nenhum acoplamento com Next.js, stores, services,
// autenticação ou FontAwesome, e o `'use client'` preservado exatamente onde a origem tem.
import { existsSync, globSync, readFileSync } from 'node:fs'

const FORBIDDEN = [
    /^next($|\/)/,
    /^zustand($|\/)/,
    /^@tanstack\/react-query($|\/)/,
    /^@fortawesome\//,
    /^sweetalert2($|\/)/,
    /^nookies($|\/)/,
    /^@\//,
    /^~\//,
]

const SPECIFIER = /(?:from\s*|import\s*\(\s*|import\s+)['"]([^'"]+)['"]/g
const DIRECTIVE = /^\s*['"]use client['"]/

const distFiles = globSync('dist/**/*.{js,d.ts}')

describe('dist', () => {
    it('existe (rode npm run build antes)', () => {
        expect(existsSync('dist/index.js')).toBe(true)
    })

    it('não importa módulos proibidos', () => {
        const violations: string[] = []
        for (const file of distFiles) {
            for (const [, specifier] of readFileSync(file, 'utf8').matchAll(SPECIFIER)) {
                if (FORBIDDEN.some((pattern) => pattern.test(specifier))) violations.push(`${file}: ${specifier}`)
            }
        }
        expect(violations).toEqual([])
    })

    it("preserva o 'use client' exatamente nos módulos cuja origem tem a diretiva", () => {
        const sources = globSync('src/**/*.{ts,tsx}').filter((f) => !f.includes('/__tests__/') && !f.endsWith('.d.ts'))
        const expected = sources
            .filter((file) => DIRECTIVE.test(readFileSync(file, 'utf8')))
            .map((file) => file.replace(/^src\//, 'dist/').replace(/\.tsx?$/, '.js'))
            .sort()
        const actual = globSync('dist/**/*.js')
            .filter((file) => DIRECTIVE.test(readFileSync(file, 'utf8')))
            .sort()
        expect(actual).toEqual(expected)
    })
})
