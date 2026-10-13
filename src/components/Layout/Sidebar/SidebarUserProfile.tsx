'use client'

import { LogOut, User, Wrench } from 'lucide-react'
import React from 'react'
import { useLinkComponent } from './useLinkComponent'

/**
 * No app de origem, o e-mail vinha do `useAuthStore`, o sair do `useAuth` e o link do perfil era fixo em
 * `/perfil`. Na lib, tudo chega por prop; o markup é o mesmo.
 */
export interface SidebarUserProfileProps {
    isSidebarFullWidth: boolean
    email?: string
    /** Padrão: `/perfil`. */
    profileHref?: string
    onSignOut: () => void
}

const SidebarUserProfile: React.FC<SidebarUserProfileProps> = React.memo(function SidebarUserProfile({
    isSidebarFullWidth,
    email,
    profileHref = '/perfil',
    onSignOut,
}) {
    const Link = useLinkComponent()

    return (
        <div className="sticky bottom-0 bg-primary">
            <div className="divider"></div>
            <div className={`px-2 mb-4 ${!isSidebarFullWidth ? 'flex justify-center' : ''}`}>
                <div className="dropdown dropdown-top dropdown-right w-full">
                    {/* O `div` com `role="button"` e o `tabIndex` no `ul` são o padrão de dropdown do
                        DaisyUI, que mostra o conteúdo por `:focus-within` do container. Trocar por
                        elementos semânticos muda o comportamento de abrir e fechar nas duas
                        variantes, então fica registrado como débito em vez de corrigido de passagem.
                        Ver PROBLEMAS_CONHECIDOS_DIVIDAS.md. */}
                    {/* biome-ignore lint/a11y/useSemanticElements: padrão de dropdown do DaisyUI */}
                    <div
                        tabIndex={0}
                        role="button"
                        className={`flex items-center gap-2 w-full rounded-lg p-1 hover:bg-white/10 transition-colors cursor-pointer ${!isSidebarFullWidth ? 'justify-center' : ''}`}
                    >
                        <div className="bg-accent text-accent-content dark:bg-base-300 min-w-8 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                            <User size={16} strokeWidth={1.75} />
                        </div>
                        <span
                            className={`text-xs text-white overflow-hidden whitespace-nowrap transition-all ${
                                isSidebarFullWidth
                                    ? 'opacity-100 max-w-[140px] duration-200 delay-150'
                                    : 'opacity-0 max-w-0 duration-100'
                            }`}
                        >
                            {email}
                        </span>
                    </div>
                    {/* Sem `tabIndex` aqui: o conteúdo do dropdown tem um link e um botão, ambos
                        focáveis, então o `:focus-within` que o DaisyUI usa continua valendo. */}
                    <ul className="dropdown-content menu menu-sm bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg mb-2">
                        <li>
                            <Link href={profileHref}>
                                <Wrench size={14} strokeWidth={1.75} />
                                Configurações
                            </Link>
                        </li>
                        <li>
                            <button type="button" onClick={() => onSignOut()}>
                                <LogOut size={14} strokeWidth={1.75} />
                                Sair
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
})

export default SidebarUserProfile
