import { ELEMENT_EXCEPTIONS, TEXT_ICON_EXCEPTIONS } from './exceptions'
import { FA_TO_LUCIDE } from './icon-map'

export type ParitySide = 'source' | 'lib'

/**
 * Normaliza o HTML para comparação. Só trata as exceções do PORTING.md:
 *
 * - cada `<svg>` do FontAwesome ou do lucide vira `<svg data-parity-icon="nome">`, mantendo as classes
 *   passadas pelo componente e o `aria-hidden`; o nome do FontAwesome passa pelo mapa do requisito 11.
 *   SVG inline do próprio componente (sem FontAwesome nem lucide) é comparado como está;
 * - os símbolos de texto que viraram ícone (exceptions.ts) viram o mesmo marcador, só do lado do app de origem;
 * - os elementos que viraram slot (o logo) viram o marcador que o caso passa no slot, só do lado do app de origem;
 * - valores de `useId`.
 *
 * Todo o resto do DOM (tags, atributos e seus valores, ordem das classes, textos) é comparado como está;
 * só a ordem dos atributos é ignorada.
 */
export function normalize(html: string, key: string, side: ParitySide): string {
    const template = document.createElement('template')
    template.innerHTML = html

    for (const svg of Array.from(template.content.querySelectorAll('svg'))) {
        const marker = iconMarker(svg)
        if (marker) svg.replaceWith(marker)
    }

    if (side === 'source') {
        for (const { text, icon } of TEXT_ICON_EXCEPTIONS[key] ?? []) replaceTextIcon(template.content, text, icon)
        for (const { selector, replaceWith } of ELEMENT_EXCEPTIONS[key] ?? []) {
            for (const element of Array.from(template.content.querySelectorAll(selector))) {
                element.outerHTML = replaceWith
            }
        }
    }

    // A ordem dos atributos não tem significado no DOM (e a do `next/link` depende da implementação).
    for (const element of Array.from(template.content.querySelectorAll('*'))) sortAttributes(element)

    return template.innerHTML
        .replace(/«r[0-9a-z]+»|:r[0-9a-z]+:/g, '«id»')
        .replace(/></g, '>\n<')
        .trim()
}

function sortAttributes(element: Element) {
    const attributes = Array.from(element.attributes)
        .map(({ name, value }) => [name, value] as const)
        .sort(([a], [b]) => a.localeCompare(b))
    for (const [name] of attributes) element.removeAttribute(name)
    for (const [name, value] of attributes) element.setAttribute(name, value)
}

function iconMarker(svg: SVGElement): Element | null {
    const classes = (svg.getAttribute('class') ?? '').split(/\s+/).filter(Boolean)
    let name: string
    let own: string[]

    if (classes.includes('svg-inline--fa')) {
        const faName = svg.getAttribute('data-icon') ?? ''
        const mapped = FA_TO_LUCIDE[faName]
        if (!mapped) throw new Error(`parity -> ícone FontAwesome fora do mapa do requisito 11: ${faName}`)
        name = mapped
        own = classes.filter((c) => c !== 'svg-inline--fa' && c !== `fa-${faName}`)
    } else if (classes.includes('lucide')) {
        const lucideClass = classes.find((c) => c.startsWith('lucide-'))
        if (!lucideClass) throw new Error('parity -> SVG do lucide sem a classe lucide-*')
        name = lucideClass.slice('lucide-'.length)
        own = classes.filter((c) => c !== 'lucide' && !c.startsWith('lucide-'))
    } else {
        return null
    }

    const marker = document.createElement('svg')
    marker.setAttribute('data-parity-icon', name)
    if (own.length) marker.setAttribute('class', own.join(' '))
    const hidden = svg.getAttribute('aria-hidden')
    if (hidden !== null) marker.setAttribute('aria-hidden', hidden)
    return marker
}

function replaceTextIcon(root: DocumentFragment, text: string, icon: string) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const matches: Text[] = []
    while (walker.nextNode()) {
        const node = walker.currentNode as Text
        if (node.data.trim() === text) matches.push(node)
    }
    for (const node of matches) {
        const marker = document.createElement('svg')
        marker.setAttribute('data-parity-icon', icon)
        marker.setAttribute('aria-hidden', 'true')
        node.replaceWith(marker)
    }
}
