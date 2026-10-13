// Gerador de fixtures (lado do app de origem). Só roda na cópia em `.parity/source/parity/`, onde
// `../../src/components` é o código do app de origem no commit-base. Ver scripts/parity-generate.mjs.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ParityCases } from '../types'

const fixturesDir = process.env.PARITY_FIXTURES_DIR as string

const caseModules = import.meta.glob<{ default: ParityCases }>('../cases/*.cases.tsx', { eager: true })
const componentModules = import.meta.glob<Record<string, unknown>>('../../src/components/**/*.{ts,tsx}')

function loadModule(key: string) {
    const load =
        componentModules[`../../src/components/${key}/index.tsx`] ??
        componentModules[`../../src/components/${key}.tsx`] ??
        componentModules[`../../src/components/${key}.ts`]
    if (!load) throw new Error(`parity -> módulo do app de origem não encontrado: ${key}`)
    return load()
}

for (const { default: groups } of Object.values(caseModules)) {
    for (const [key, cases] of Object.entries(groups)) {
        describe(key, () => {
            for (const parityCase of cases) {
                it(parityCase.name, async () => {
                    parityCase.before?.()
                    try {
                        const deps = Object.fromEntries(
                            await Promise.all((parityCase.with ?? []).map(async (dep) => [dep, await loadModule(dep)])),
                        )
                        render(parityCase.render(await loadModule(key), deps))
                        await parityCase.interact?.({ user: userEvent.setup(), screen })
                        mkdirSync(join(fixturesDir, key), { recursive: true })
                        writeFileSync(join(fixturesDir, key, `${parityCase.name}.html`), `${document.body.innerHTML}\n`)
                    } finally {
                        cleanup()
                        parityCase.after?.()
                    }
                })
            }
        })
    }
}
