import './csp-monitor'
import './app.css'
import { applyStoredTheme, Loader, ThemeProvider, Toaster } from 'houden-kit'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { router } from './router'

// Aplica o tema salvo (ou o do sistema) antes do primeiro render, sem script inline.
applyStoredTheme()

createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <ThemeProvider>
            <Toaster />
            <Loader />
            <RouterProvider router={router} />
        </ThemeProvider>
    </StrictMode>,
)
