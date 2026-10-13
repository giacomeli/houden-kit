// Paridade com o app de origem (requisito 20): o render da lib, normalizado, é igual ao do app de origem no
// commit-base. As fixtures vêm de `npm run parity:generate`; ver PORTING.md para as exceções.
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { normalize } from './normalize'
import type { ParityCases } from './types'

const caseModules = import.meta.glob<{ default: ParityCases }>('./cases/*.cases.tsx', { eager: true })
const componentModules = import.meta.glob<Record<string, unknown>>('../../src/components/**/*.{ts,tsx}')
const fixtures = import.meta.glob<string>('./fixtures/**/*.html', { query: '?raw', import: 'default', eager: true })

function loadModule(key: string) {
    const load =
        componentModules[`../../src/components/${key}/index.tsx`] ??
        componentModules[`../../src/components/${key}.tsx`] ??
        componentModules[`../../src/components/${key}.ts`]
    if (!load) throw new Error(`parity -> módulo da lib não encontrado: ${key}`)
    return load()
}

const groups = Object.values(caseModules).flatMap(({ default: g }) => Object.entries(g))

describe('paridade com o app de origem', () => {
    it('toda fixture corresponde a um caso, e todo caso tem fixture', () => {
        const expected = groups.flatMap(([key, cases]) => cases.map((c) => `./fixtures/${key}/${c.name}.html`)).sort()
        expect(Object.keys(fixtures).sort()).toEqual(expected)
    })

    for (const [key, cases] of groups) {
        describe(key, () => {
            for (const parityCase of cases) {
                it(parityCase.name, async () => {
                    const fixture = fixtures[`./fixtures/${key}/${parityCase.name}.html`]
                    expect(fixture, `fixture ausente; rode npm run parity:generate`).toBeDefined()
                    parityCase.before?.()
                    try {
                        const deps = Object.fromEntries(
                            await Promise.all((parityCase.with ?? []).map(async (dep) => [dep, await loadModule(dep)])),
                        )
                        render(parityCase.render(await loadModule(key), deps))
                        await parityCase.interact?.({ user: userEvent.setup(), screen })
                        expect(normalize(document.body.innerHTML, key, 'lib')).toBe(normalize(fixture, key, 'source'))
                    } finally {
                        cleanup()
                        parityCase.after?.()
                    }
                })
            }
        })
    }
})
