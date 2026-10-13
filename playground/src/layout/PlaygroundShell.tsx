import {
    AppShell,
    CHAVE_VARIANTE,
    Sidebar,
    SidebarUserProfile,
    type SidebarVariant,
    toastSuccess,
    useSidebarVariant,
    useTheme,
} from 'houden-kit'
import { Moon, PanelLeft, Sun } from 'houden-kit/icons'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { menu } from '../data/menu'
import { RouterLink } from '../RouterLink'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')

/**
 * Layout do playground. O Sidebar recebe a rota do react-router; o AppShell recebe a rota do navegador
 * (com o `base` do Pages), porque o RouteProgressBar compara com o `href` dos links, que inclui o base.
 */
export default function PlaygroundShell() {
    const { pathname } = useLocation()
    const { isDark, toggleTheme } = useTheme()
    const preferida = useSidebarVariant('legacy')
    const [escolhida, setEscolhida] = useState<SidebarVariant | null>(null)
    const variant = escolhida ?? preferida
    const isChat = pathname.startsWith('/padroes/chat')

    const trocarVariante = (proxima: SidebarVariant) => {
        try {
            localStorage.setItem(CHAVE_VARIANTE, proxima)
        } catch {
            // Armazenamento indisponível: a escolha vale até recarregar.
        }
        setEscolhida(proxima)
    }

    return (
        <AppShell
            pathname={`${base}${pathname}`}
            fullHeight={isChat}
            sidebar={
                <Sidebar
                    menu={menu}
                    pathname={pathname}
                    linkComponent={RouterLink}
                    variant={variant}
                    userProfile={({ isSidebarFullWidth }) => (
                        <SidebarUserProfile
                            isSidebarFullWidth={isSidebarFullWidth}
                            email="ana.souza@exemplo.com.br"
                            profileHref="/padroes/detalhe"
                            onSignOut={() => toastSuccess('Sessão encerrada (fictício).', 3000)}
                        />
                    )}
                />
            }
        >
            <div className={isChat ? 'flex h-full flex-col' : ''}>
                <div className="flex items-center justify-end gap-2 border-b border-base-300 px-6 py-2">
                    <div className="join">
                        <button
                            type="button"
                            className={`btn btn-xs join-item ${variant === 'legacy' ? 'btn-accent' : 'btn-ghost'}`}
                            onClick={() => trocarVariante('legacy')}
                        >
                            <PanelLeft size={14} strokeWidth={1.75} aria-hidden="true" />
                            Barra
                        </button>
                        <button
                            type="button"
                            className={`btn btn-xs join-item ${variant === 'rail' ? 'btn-accent' : 'btn-ghost'}`}
                            onClick={() => trocarVariante('rail')}
                        >
                            Trilho
                        </button>
                    </div>
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-square"
                        onClick={toggleTheme}
                        aria-label={isDark ? 'Usar tema claro' : 'Usar tema escuro'}
                    >
                        {isDark ? <Sun size={18} strokeWidth={1.75} /> : <Moon size={18} strokeWidth={1.75} />}
                    </button>
                </div>
                <div className={isChat ? 'min-h-0 flex-1' : 'p-6'}>
                    <Outlet />
                </div>
            </div>
        </AppShell>
    )
}
