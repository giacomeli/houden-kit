/**
 * Símbolos de texto usados como ícone no app de origem que viraram ícone lucide na lib (requisito 11).
 * Chave: módulo da paridade. O normalizador troca o texto do lado do app de origem pelo marcador do ícone.
 */
/**
 * Elementos do app de origem que, na lib, viraram slot (requisito 16: o `houden_logo.svg` não entra no
 * pacote). O normalizador troca o elemento do lado do app de origem pelo marcador que o caso passa no slot.
 */
export const ELEMENT_EXCEPTIONS: Record<string, Array<{ selector: string; replaceWith: string }>> = {
    'Layout/Sidebar': [{ selector: 'img[alt="logo Houden"]', replaceWith: '<i data-parity-slot="logo"></i>' }],
}

export const TEXT_ICON_EXCEPTIONS: Record<string, Array<{ text: string; icon: string }>> = {
    'Layout/Modal': [{ text: '✕', icon: 'x' }],
    'Layout/FilterDrawer': [{ text: '✕', icon: 'x' }],
    'Form/MultiSearchSelect': [{ text: '×', icon: 'x' }],
}
