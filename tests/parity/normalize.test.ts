// Prova que a comparação de paridade não é vazia: o normalizador só absorve as exceções declaradas.
import { normalize } from './normalize'

const fa = (icon: string, extra = '') =>
    `<button class="btn"><svg aria-hidden="true" focusable="false" data-icon="${icon}" class="svg-inline--fa fa-${icon}${extra}" role="img" viewBox="0 0 576 512"><path d="M0 0"></path></svg></button>`
const lucide = (icon: string, extra = '') =>
    `<button class="btn"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="lucide lucide-${icon}${extra}" aria-hidden="true"><path d="M0 0"></path></svg></button>`

describe('normalize', () => {
    it('iguala um ícone FontAwesome ao lucide equivalente do mapa', () => {
        expect(normalize(lucide('eye-off'), 'k', 'lib')).toBe(normalize(fa('eye-slash'), 'k', 'source'))
    })

    it('mantém as classes passadas pelo componente', () => {
        expect(normalize(lucide('x', ' h-4 w-4'), 'k', 'lib')).toBe(normalize(fa('xmark', ' h-4 w-4'), 'k', 'source'))
    })

    it('acusa classe extra num lado só', () => {
        expect(normalize(lucide('x', ' text-error'), 'k', 'lib')).not.toBe(normalize(fa('xmark'), 'k', 'source'))
    })

    it('acusa classe extra fora do ícone', () => {
        const lib = lucide('eye').replace('class="btn"', 'class="btn btn-sm"')
        expect(normalize(lib, 'k', 'lib')).not.toBe(normalize(fa('eye'), 'k', 'source'))
    })

    it('acusa ícone trocado por outro', () => {
        expect(normalize(lucide('eye'), 'k', 'lib')).not.toBe(normalize(fa('eye-slash'), 'k', 'source'))
    })

    it('falha com ícone FontAwesome fora do mapa', () => {
        expect(() => normalize(fa('house'), 'k', 'source')).toThrow(/fora do mapa/)
    })

    it('troca o símbolo de texto só nos módulos declarados', () => {
        const origem = '<button class="btn">✕</button>'
        const lib = '<button class="btn"><svg class="lucide lucide-x" aria-hidden="true"></svg></button>'
        expect(normalize(lib, 'Layout/Modal', 'lib')).toBe(normalize(origem, 'Layout/Modal', 'source'))
        expect(normalize(lib, 'Form/Button', 'lib')).not.toBe(normalize(origem, 'Form/Button', 'source'))
    })

    it('compara SVG inline do próprio componente como está', () => {
        const inline = (d: string) => `<span><svg viewBox="0 0 20 20"><path d="${d}"></path></svg></span>`
        expect(normalize(inline('M0 0'), 'k', 'lib')).toBe(normalize(inline('M0 0'), 'k', 'source'))
        expect(normalize(inline('M1 1'), 'k', 'lib')).not.toBe(normalize(inline('M0 0'), 'k', 'source'))
    })

    it('ignora a ordem dos atributos, mas não os valores', () => {
        const lib = '<a class="menu" href="/x">X</a>'
        expect(normalize(lib, 'k', 'lib')).toBe(normalize('<a href="/x" class="menu">X</a>', 'k', 'source'))
        expect(normalize(lib, 'k', 'lib')).not.toBe(normalize('<a href="/y" class="menu">X</a>', 'k', 'source'))
    })

    it('normaliza valores de useId', () => {
        expect(normalize('<input id="«r1»">', 'k', 'lib')).toBe(normalize('<input id="«r7»">', 'k', 'source'))
    })
})
