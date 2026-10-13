import type { IMenuItem, IMenuSection } from '../../../types/menu'

// Parte de busca do `useSidebarMenu` do app de origem (commit-base 1e5c1c3e), sem a regra de acesso: na
// lib, o app entrega o menu já filtrado por permissão. A normalização e a recursão são as mesmas.

const normalize = (str: string) => str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '')

function matchesSearch(searchTerms: string[], searchTerm: string): boolean {
    if (!searchTerm) return true
    const normalizedSearch = normalize(searchTerm)
    return searchTerms.some((term) => normalize(term).includes(normalizedSearch))
}

function filterItems(items: IMenuItem[], searchTerm: string): IMenuItem[] {
    return items.reduce<IMenuItem[]>((acc, item) => {
        if (item.children) {
            const filteredChildren = filterItems(item.children, searchTerm)
            const parentMatchesSearch = matchesSearch(item.searchTerms, searchTerm)
            const childrenMatchSearch = filteredChildren.some(
                (child) =>
                    matchesSearch(child.searchTerms, searchTerm) || (child.children && child.children.length > 0),
            )

            if (parentMatchesSearch || childrenMatchSearch) {
                acc.push({ ...item, children: filteredChildren })
            }
        } else if (matchesSearch(item.searchTerms, searchTerm)) {
            acc.push(item)
        }

        return acc
    }, [])
}

/**
 * Filtra o menu pelo termo de busca, ignorando acentos, caixa e espaços. Seções sem nenhum item
 * restante saem, como no app de origem, inclusive com termo vazio.
 */
export function filterMenuBySearch(menu: IMenuSection[], searchTerm: string): IMenuSection[] {
    return menu.reduce<IMenuSection[]>((acc, section) => {
        const filteredItems = filterItems(section.items, searchTerm)
        if (filteredItems.length > 0) {
            acc.push({ ...section, items: filteredItems })
        }

        return acc
    }, [])
}
