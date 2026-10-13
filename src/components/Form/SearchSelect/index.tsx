'use client'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useClickOutside } from '../../../hooks/useClickOutside'
import type { IOption } from '../../../types/option'
import FormError from '../FormError'

interface ISearchSelectProps {
    options: IOption[]
    setValue: UseFormSetValue<any>
    name: string
    label: string
    isRequired?: boolean
    error?: string
    isDisabled?: boolean
    value?: string | number
    trigger?: any
    watch?: any
    displayValue?: string
}

/** Teto de itens no dropdown: o carrinho passa milhares de produtos (achado D7). */
const MAX_RESULTADOS = 50

const SearchSelect: React.FC<ISearchSelectProps> = ({
    options,
    name,
    setValue,
    label,
    isRequired = false,
    error = '',
    isDisabled = false,
    trigger,
    watch,
    value,
    displayValue,
}) => {
    const componentRef = useRef<HTMLLabelElement>(null)

    // `useState` no lugar de um `useForm` interno: o formulário existia só para guardar um texto.
    const [inputValue, setInputValue] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const watchValue = value ?? (watch && watch(name))

    // Fecha o dropdown quando clicar fora usando hook reutilizável
    const handleClose = useCallback(() => setIsOpen(false), [])
    useClickOutside(componentRef, handleClose, isOpen)

    // Nome em minúsculas por opção, refeito só quando `options` muda, e não a cada tecla.
    const searchableOptions = useMemo(
        () => options.map((option) => ({ option, nameLower: option.name.toLowerCase() })),
        [options],
    )

    // String, não objeto: o texto do campo não é reposto quando o pai recria o array de options
    // com o mesmo conteúdo (era o que apagava o que o usuário estava digitando).
    const selectedName = useMemo(() => {
        const option = options.find(
            (item) => String(item.value) === String(watchValue) || String(item.id) === String(watchValue),
        )
        return option?.name ?? ''
    }, [options, watchValue])

    useEffect(() => {
        setInputValue(watchValue ? (selectedName || displayValue || '') : '')
        setSearchTerm('')
    }, [watchValue, selectedName, displayValue])

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options.slice(0, MAX_RESULTADOS)

        const termLower = searchTerm.toLowerCase()
        return searchableOptions
            .filter(({ nameLower }) => nameLower.includes(termLower))
            .sort((a, b) => {
                const indexA = a.nameLower.indexOf(termLower)
                const indexB = b.nameLower.indexOf(termLower)

                if (indexA !== indexB) {
                    return indexA - indexB
                }

                const remainingA = a.nameLower.length - (indexA + termLower.length)
                const remainingB = b.nameLower.length - (indexB + termLower.length)

                return remainingA - remainingB
            })
            .slice(0, MAX_RESULTADOS)
            .map(({ option }) => option)
    }, [options, searchableOptions, searchTerm])

    const hasMoreResults = useMemo(() => {
        if (!searchTerm) return options.length > MAX_RESULTADOS
        return filteredOptions.length === MAX_RESULTADOS
    }, [options.length, searchTerm, filteredOptions.length])

    const handleSelectedValue = (option: IOption) => {
        setValue(name, option.value?.toString() || option.id)
        trigger?.()
        setInputValue(option.name)
        setSearchTerm('')
        setIsOpen(false)
    }

    return (
        <label
            className="flex flex-col items-start justify-start font-bold text-sm dark:text-white text-black relative"
            ref={componentRef}
        >
            <span className="flex gap-2 content-center items-center">
                {label} {isRequired && <span className="text-error text-lg">*</span>}
            </span>
            <input
                autoComplete="off"
                className={`input input-sm rounded-md bg-white w-full ${error ? 'input-error' : ''}`}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value)
                    setSearchTerm(e.target.value)
                }}
                onClick={() => setIsOpen(true)}
                disabled={isDisabled}
            />
            {error && <FormError>{error}</FormError>}
            {isOpen && (
                <ul className="absolute z-50 max-h-[150px] w-full bg-gray-200 overflow-y-scroll rounded mt-2 top-14">
                    {filteredOptions.map((option) => (
                        <li
                            key={option.value ?? option.id ?? option.name}
                            className={`p-1 px-4 hover:bg-accent hover:text-white text-xs ${inputValue === option.name && 'bg-accent text-white'}`}
                            onMouseDown={(e) => {
                                e.preventDefault()
                                handleSelectedValue(option)
                            }}
                        >
                            {option.name}
                        </li>
                    ))}
                    {hasMoreResults && (
                        <li className="p-1 px-4 text-xs italic text-gray-500">
                            Mostrando os primeiros {MAX_RESULTADOS}. Refine a busca para ver outros.
                        </li>
                    )}
                </ul>
            )}
        </label>
    )
}

export default memo(SearchSelect)
