/** Temas DaisyUI da lib, definidos no `houden-kit/theme.css`. */
export const THEME_LIGHT = 'houdenTheme'
export const THEME_DARK = 'houdenThemeDark'

export type ThemeName = typeof THEME_LIGHT | typeof THEME_DARK

/** Chave padrão da escolha de tema no `localStorage`. */
export const THEME_STORAGE_KEY = 'houden-kit.theme'

const DARK_QUERY = '(prefers-color-scheme: dark)'

export const isThemeName = (value: unknown): value is ThemeName => value === THEME_LIGHT || value === THEME_DARK

export function readStoredTheme(storageKey: string = THEME_STORAGE_KEY): ThemeName | null {
    try {
        const value = window.localStorage.getItem(storageKey)
        return isThemeName(value) ? value : null
    } catch {
        return null
    }
}

export function writeStoredTheme(theme: ThemeName, storageKey: string = THEME_STORAGE_KEY) {
    try {
        window.localStorage.setItem(storageKey, theme)
    } catch {
        // Armazenamento indisponível (navegação privada, bloqueio): a escolha vale só nesta sessão.
    }
}

export function systemTheme(): ThemeName {
    try {
        return window.matchMedia?.(DARK_QUERY).matches ? THEME_DARK : THEME_LIGHT
    } catch {
        return THEME_LIGHT
    }
}

export function subscribeSystemTheme(onChange: (theme: ThemeName) => void): () => void {
    const media = window.matchMedia?.(DARK_QUERY)
    if (!media) return () => {}
    const listener = (event: MediaQueryListEvent) => onChange(event.matches ? THEME_DARK : THEME_LIGHT)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
}

export function applyTheme(theme: ThemeName) {
    document.documentElement.setAttribute('data-theme', theme)
}

/**
 * Aplica o tema salvo (ou o do sistema) no `<html>` antes do primeiro render. Chame no ponto de entrada
 * do app, antes do `createRoot`, para não piscar o tema claro; um script inline faria o mesmo, mas a
 * CSP do template proíbe `unsafe-inline`.
 */
export function applyStoredTheme(storageKey: string = THEME_STORAGE_KEY): ThemeName {
    const theme = readStoredTheme(storageKey) ?? systemTheme()
    applyTheme(theme)
    return theme
}
