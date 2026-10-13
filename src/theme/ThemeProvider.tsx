'use client'

import { createContext, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import {
    applyTheme,
    isThemeName,
    readStoredTheme,
    subscribeSystemTheme,
    systemTheme,
    THEME_DARK,
    THEME_LIGHT,
    THEME_STORAGE_KEY,
    type ThemeName,
    writeStoredTheme,
} from './themes'

export interface ThemeContextValue {
    theme: ThemeName
    isDark: boolean
    /** Fixa o tema e grava a escolha. */
    setTheme: (theme: ThemeName) => void
    toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export interface ThemeProviderProps {
    children: ReactNode
    /** Chave no `localStorage`. Padrão: `houden-kit.theme`. */
    storageKey?: string
}

function initialTheme(storageKey: string): ThemeName {
    if (typeof document === 'undefined') return THEME_LIGHT
    const current = document.documentElement.getAttribute('data-theme')
    if (isThemeName(current)) return current
    return readStoredTheme(storageKey) ?? systemTheme()
}

/**
 * Alternância entre os temas claro e escuro da lib. Aplica `data-theme` no `<html>`, grava a
 * escolha e, enquanto não há escolha salva, acompanha o `prefers-color-scheme` do sistema.
 * No app de origem não há alternância: o tema é fixo em `houdenTheme`.
 */
export function ThemeProvider({ children, storageKey = THEME_STORAGE_KEY }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<ThemeName>(() => initialTheme(storageKey))

    useEffect(() => {
        applyTheme(theme)
    }, [theme])

    useEffect(() => {
        if (readStoredTheme(storageKey)) return
        return subscribeSystemTheme((next) => {
            if (!readStoredTheme(storageKey)) setThemeState(next)
        })
    }, [storageKey])

    const setTheme = useCallback(
        (next: ThemeName) => {
            writeStoredTheme(next, storageKey)
            setThemeState(next)
        },
        [storageKey],
    )

    const toggleTheme = useCallback(() => {
        setThemeState((current) => {
            const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK
            writeStoredTheme(next, storageKey)
            return next
        })
    }, [storageKey])

    const value = useMemo<ThemeContextValue>(
        () => ({ theme, isDark: theme === THEME_DARK, setTheme, toggleTheme }),
        [theme, setTheme, toggleTheme],
    )

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
