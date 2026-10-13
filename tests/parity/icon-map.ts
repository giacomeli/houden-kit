/**
 * Mapa FontAwesome -> lucide do requisito 11 da spec (exceção visual registrada no PORTING.md).
 * Chave: `data-icon` do SVG do FontAwesome. Valor: nome kebab-case do ícone lucide (classe `lucide-*`).
 */
export const FA_TO_LUCIDE: Record<string, string> = {
    eye: 'eye',
    'eye-slash': 'eye-off',
    'magnifying-glass': 'search',
    xmark: 'x',
    'chevron-down': 'chevron-down',
    'chevron-up': 'chevron-up',
    sort: 'chevrons-up-down',
    'thumbs-down': 'thumbs-down',
    'circle-info': 'info',
    minus: 'minus',
    plus: 'plus',
}
