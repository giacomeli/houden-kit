// O GitHub Pages não tem reescrita de rota: uma URL profunda (/houden-kit/padroes/lista) devolveria 404.
// Com o 404.html igual ao index.html, o app carrega e o react-router resolve a rota.
import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
console.log('spa-fallback -> dist/404.html criado')
