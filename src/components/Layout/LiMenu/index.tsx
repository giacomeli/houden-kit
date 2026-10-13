'use client'
import React from 'react'

export interface ILiMenuProps extends React.HTMLProps<HTMLUListElement> {
    children: React.ReactNode
    hasSubMenu?: boolean
    parentName?: string
    parentIcon?: React.ReactNode
    isOpen?: boolean
    isSidebarFullWidth?: boolean
}

const LiMenu: React.FC<ILiMenuProps> = ({
    children,
    className = '',
    hasSubMenu = false,
    parentName,
    parentIcon,
    isOpen = false,
    isSidebarFullWidth = true,
}) => {
    return (
        <>
            {hasSubMenu ? (
                <li className={`${className} hover:bg-white/10 rounded-lg text-xs leading-tight`}>
                    <details
                        open={isOpen && isSidebarFullWidth}
                        className={!isSidebarFullWidth ? '[&>summary::after]:hidden!' : ''}
                    >
                        {/* Colapsado o summary não abre (o submenu não cabe em 70 px) e centraliza o
                            ícone: zerar gap e padding é necessário porque a coluna do rótulo
                            continua no grid do `menu` mesmo com largura zero. */}
                        <summary className={!isSidebarFullWidth ? 'pointer-events-none justify-center gap-0 px-0' : ''}>
                            {parentIcon && <span className="shrink-0">{parentIcon}</span>}
                            <span
                                className={`whitespace-nowrap overflow-hidden transition-all ${
                                    isSidebarFullWidth
                                        ? 'opacity-100 max-w-[200px] pl-2 duration-200 delay-150'
                                        : 'opacity-0 max-w-0 pl-0 duration-100'
                                }`}
                            >
                                {parentName}
                            </span>
                        </summary>
                        {isSidebarFullWidth && <ul>{children}</ul>}
                    </details>
                </li>
            ) : (
                <li className={`${className} hover:bg-white/10 rounded-lg text-xs leading-tight`}>{children}</li>
            )}
        </>
    )
}

export default LiMenu
