'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'
import { IMultiSelectOptions, IOption } from '../../../types/option'

export interface IMultiSelectProps extends React.HTMLProps<HTMLInputElement> {
    name: string
    control: any
    hasError?: boolean
    options: IMultiSelectOptions[] | IOption[]
}

const MultiSelectComponent: React.FC<IMultiSelectProps> = ({
    name,
    control,
    hasError = false,
    placeholder,
    options,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Fechar ao clicar fora
    useEffect(() => {
        if (!isOpen) return
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    const getKey = (opt: any) => opt?.value ?? opt?.code ?? opt

    const getDisplayText = useCallback(
        (selectedValues: any[]) => {
            if (!selectedValues || selectedValues.length === 0) return placeholder || 'Selecione...'
            return selectedValues.map((v) => v?.name || String(v)).join(', ')
        },
        [placeholder],
    )

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const selectedValues: any[] = field.value || []

                const toggleOption = (option: any) => {
                    const key = getKey(option)
                    const exists = selectedValues.some((v) => getKey(v) === key)
                    if (exists) {
                        field.onChange(selectedValues.filter((v) => getKey(v) !== key))
                    } else {
                        field.onChange([...selectedValues, option])
                    }
                }

                const isSelected = (option: any) =>
                    selectedValues.some((v) => getKey(v) === getKey(option))

                return (
                    <div ref={containerRef} className="relative w-full">
                        {/* Trigger */}
                        <div
                            className={`input input-bordered input-sm bg-white dark:bg-primary dark:text-base-content w-full cursor-pointer flex items-center ${
                                hasError || fieldState.error ? 'border-red-500' : 'border-light-gray'
                            }`}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <span className="truncate text-sm flex-1">
                                {getDisplayText(selectedValues)}
                            </span>
                            <svg
                                className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* Dropdown */}
                        {isOpen && (
                            <div className="absolute z-50 mt-1 w-full bg-white dark:bg-base-200 border border-base-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {(options as any[]).map((option, i) => (
                                    <label
                                        key={getKey(option) ?? i}
                                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-base-200 dark:hover:bg-base-300 cursor-pointer text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-xs checkbox-accent"
                                            checked={isSelected(option)}
                                            onChange={() => toggleOption(option)}
                                        />
                                        <span className="truncate">{option.name}</span>
                                    </label>
                                ))}
                                {(options as any[]).length === 0 && (
                                    <p className="px-3 py-2 text-sm text-gray-400">Nenhuma opção</p>
                                )}
                            </div>
                        )}
                    </div>
                )
            }}
        />
    )
}

export default MultiSelectComponent
