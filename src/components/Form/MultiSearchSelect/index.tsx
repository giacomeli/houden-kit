'use client'
import { X } from 'lucide-react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { iconDefaults } from '../../../icons/defaults'
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
    value?: (string | number)[]
    trigger?: any
    watch?: any
    inputClass?: string
    className?: string
}

/** Teto de itens no dropdown, como no `SearchSelect` (achado D7). */
const MAX_RESULTADOS = 50

const optionKey = (option: IOption) => option.value ?? option.id

const MultiSearchSelect: React.FC<ISearchSelectProps> = ({
    options,
    name,
    setValue,
    label,
    isRequired = false,
    error = '',
    isDisabled = false,
    trigger,
    watch,
    className = '',
}) => {
    const componentRef = useRef<HTMLFieldSetElement>(null)
    // `useState` no lugar de um `useForm` interno só para guardar o texto do filtro.
    const [searchTerm, setSearchTerm] = useState('')
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const watchValue = watch && watch(name)

    // Fecha o dropdown quando clicar fora usando hook reutilizável
    const handleClose = useCallback(() => setIsOpen(false), [])
    useClickOutside(componentRef, handleClose, isOpen)

    // Nome em minúsculas por opção, refeito só quando `options` muda.
    const searchableOptions = useMemo(
        () => options.map((option) => ({ option, nameLower: option.name?.toLowerCase() ?? '' })),
        [options],
    )

    // A seleção continua em estado local: `watch` é opcional e nem todo pai re-renderiza ao
    // `setValue`. O que saiu foi a comparação por `JSON.stringify` de dois arrays ordenados a cada
    // render; agora a sincronização olha uma chave de string e só refaz quando ela muda (D7).
    const [selectedOptions, setSelectedOptions] = useState<IOption[]>(() =>
        options.filter((option) => (watchValue ?? []).includes(optionKey(option))),
    )

    const parentSelectionKey = useMemo(
        () =>
            ((watchValue ?? []) as (string | number)[])
                .map(String)
                .sort()
                .join('|'),
        [watchValue],
    )
    const internalSelectionKey = useMemo(
        () =>
            selectedOptions
                .map((option) => String(optionKey(option)))
                .sort()
                .join('|'),
        [selectedOptions],
    )

    useEffect(() => {
        if (parentSelectionKey === internalSelectionKey) return
        setSelectedOptions(options.filter((option) => (watchValue ?? []).includes(optionKey(option))))
    }, [parentSelectionKey, internalSelectionKey, options, watchValue])

    // Fecha e limpa o filtro quando o campo é desabilitado (evita dropdown preso aberto).
    useEffect(() => {
        if (isDisabled) setIsOpen(false)
    }, [isDisabled])

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options.slice(0, MAX_RESULTADOS)
        const termLower = searchTerm.toLowerCase()
        return searchableOptions
            .filter(({ nameLower }) => nameLower.includes(termLower))
            .slice(0, MAX_RESULTADOS)
            .map(({ option }) => option)
    }, [options, searchableOptions, searchTerm])

    const hasMoreResults = useMemo(() => {
        if (!searchTerm) return options.length > MAX_RESULTADOS
        return filteredOptions.length === MAX_RESULTADOS
    }, [options.length, searchTerm, filteredOptions.length])

    const commitSelection = (updated: IOption[]) => {
        setSelectedOptions(updated)
        setValue(
            name,
            updated.map((option) => optionKey(option)),
        )
        trigger?.()
    }

    const handleSelectOption = (option: IOption) => {
        const key = optionKey(option)
        if (!key) return

        const alreadySelected = selectedOptions.some((item) => optionKey(item) === key)
        commitSelection(
            alreadySelected ? selectedOptions.filter((item) => optionKey(item) !== key) : [...selectedOptions, option],
        )
        setSearchTerm('')
    }

    const handleRemoveOption = (option: IOption) => {
        const key = optionKey(option)
        if (!key) return
        commitSelection(selectedOptions.filter((item) => optionKey(item) !== key))
    }

    return (
        <fieldset className={`fieldset relative ${className}`} ref={componentRef}>
            {label && (
                <legend className="fieldset-legend">
                    {label}
                    {isRequired && ' *'}
                </legend>
            )}
            <div className="input input-sm input-bordered rounded-md w-full bg-white " onClick={() => setIsOpen(true)}>
                {selectedOptions.map((option) => (
                    <span
                        key={optionKey(option)}
                        className="bg-gray-300 text-xs px-2 py-1 rounded flex items-center"
                    >
                        {option.name}
                        <button
                            type="button"
                            className="ml-1 text-red-500"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveOption(option)
                            }}
                        >
                            <X {...iconDefaults} />
                        </button>
                    </span>
                ))}
                <input
                    autoComplete="off"
                    className="outline-none flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isDisabled}
                />
            </div>
            {error && <FormError>{error}</FormError>}
            {isOpen && (
                <ul className="absolute z-50 max-h-[150px] w-full bg-gray-200 overflow-y-scroll rounded mt-2 top-8">
                    {filteredOptions.map((option) => (
                        <li
                            key={optionKey(option)}
                            className={`p-1 px-4 hover:bg-accent hover:text-white text-xs cursor-pointer ${
                                selectedOptions.some((item) => optionKey(item) === optionKey(option))
                                    ? 'bg-accent text-white'
                                    : ''
                            }`}
                            onClick={() => handleSelectOption(option)}
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
        </fieldset>
    )
}

export default memo(MultiSearchSelect)
