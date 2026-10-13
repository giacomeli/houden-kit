// Reescreve os especificadores relativos sem extensão dos `.d.ts` do `dist` para caminhos explícitos
// (`./X.js` ou `./X/index.js`). Sem extensão, a resolução `node16` em ESM não encontra os tipos.
import { existsSync, globSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const SPECIFIER = /((?:from|import)\s*\(?\s*['"])(\.{1,2}\/[^'"]*)(['"])/g

let rewritten = 0
for (const file of globSync('dist/**/*.d.ts')) {
    const source = readFileSync(file, 'utf8')
    const output = source.replace(SPECIFIER, (match, before, specifier, after) => {
        if (/\.(js|mjs|cjs|json|css)$/.test(specifier)) return match
        const base = resolve(dirname(file), specifier)
        if (existsSync(`${base}.d.ts`)) return `${before}${specifier}.js${after}`
        if (existsSync(`${base}/index.d.ts`)) return `${before}${specifier}/index.js${after}`
        throw new Error(`fix-dts-specifiers -> ${file}: não encontrei os tipos de '${specifier}'`)
    })
    if (output !== source) {
        writeFileSync(file, output)
        rewritten++
    }
}
console.log(`fix-dts-specifiers -> ${rewritten} arquivo(s) reescrito(s)`)
