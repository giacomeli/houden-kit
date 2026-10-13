// Copia o CSS da lib para a raiz do `dist`. O `@source "./"` do theme.css passa a escanear o `dist`
// inteiro, onde estão os componentes compilados.
import { copyFileSync, existsSync } from 'node:fs'

for (const file of ['theme.css', 'fonts.css']) {
    copyFileSync(`src/styles/${file}`, `dist/${file}`)
    if (!existsSync(`dist/${file}`)) throw new Error(`copy-css -> dist/${file} não foi criado`)
}
