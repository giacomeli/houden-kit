'use client'

import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { iconDefaults } from '../../../icons/defaults'

interface ISearchInputProps {
    /** Chamado depois que o usuário para de digitar (`delay`). */
    onDebouncedChange: (value: string) => void
    defaultValue?: string
    placeholder?: string
    delay?: number
    className?: string
    ariaLabel?: string
}

/**
 * Campo de busca com estado próprio: digitar não re-renderiza a página nem a tabela, que antes
 * seguravam o valor no `useState` da tela (achado D6 da auditoria de performance). O debounce fica
 * aqui, então a página só é avisada do termo final.
 */
export default function SearchInput({
    onDebouncedChange,
    defaultValue = '',
    placeholder = 'Pesquisar...',
    delay = 500,
    className = '',
    ariaLabel = 'Pesquisar',
}: ISearchInputProps) {
    const [value, setValue] = useState(defaultValue)

    // Latest ref: trocar a callback não reinicia o debounce em andamento.
    const onDebouncedChangeRef = useRef(onDebouncedChange)
    useEffect(() => {
        onDebouncedChangeRef.current = onDebouncedChange
    })

    const isFirstRender = useRef(true)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        const timer = setTimeout(() => onDebouncedChangeRef.current(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return (
        <label className={`input input-sm input-bordered flex items-center gap-2 ${className}`}>
            <Search {...iconDefaults} className="text-xs text-gray-400" />
            <input
                type="search"
                className="grow"
                value={value}
                placeholder={placeholder}
                aria-label={ariaLabel}
                onChange={(e) => setValue(e.target.value)}
            />
        </label>
    )
}
