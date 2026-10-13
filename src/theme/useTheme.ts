'use client'

import { useContext } from 'react'
import { ThemeContext, type ThemeContextValue } from './ThemeProvider'

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme precisa ser usado dentro de um ThemeProvider.')
    return context
}
