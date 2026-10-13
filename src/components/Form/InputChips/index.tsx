'use client'
import { X } from 'lucide-react'
import React, { useCallback, useRef } from 'react'
import { Controller } from 'react-hook-form'
import { iconDefaults } from '../../../icons/defaults'

export interface InputProps extends React.HTMLProps<HTMLInputElement> {
    name: string
    control: any
    hasError?: boolean
}

const InputChips: React.FC<InputProps> = ({ name, control, hasError, className }) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const addChip = useCallback((currentValue: string, fieldValue: string[], onChange: (v: string[]) => void) => {
        const trimmed = currentValue.trim()
        if (!trimmed) return
        // Suporta separador vírgula (múltiplos valores de uma vez)
        const newChips = trimmed
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        onChange([...(fieldValue || []), ...newChips])
        if (inputRef.current) inputRef.current.value = ''
    }, [])

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <div
                    className={`flex flex-wrap items-center gap-1 min-h-[2rem] max-h-32 overflow-y-auto px-2 py-1 input input-bordered ${
                        className ?? 'bg-white dark:bg-primary dark:text-base-content w-full cursor-pointer'
                    } ${hasError ? 'border-red-500' : 'border-light-gray'}`}
                    onClick={() => inputRef.current?.focus()}
                >
                    {(field.value as string[] | undefined)?.map((chip, i) => (
                        <span
                            key={`${chip}-${i}`}
                            className="badge badge-sm badge-outline badge-secondary gap-1"
                        >
                            {chip}
                            <button
                                type="button"
                                className="text-error hover:text-error/80"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    field.onChange(field.value.filter((_: string, idx: number) => idx !== i))
                                }}
                            >
                                <X {...iconDefaults} className="text-[10px]" />
                            </button>
                        </span>
                    ))}
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 min-w-[60px] bg-transparent border-none outline-none text-sm"
                        onKeyDown={(e) => {
                            if (e.key === 'Tab' || e.key === 'Enter') {
                                const val = e.currentTarget.value
                                if (val.trim()) {
                                    e.preventDefault()
                                    addChip(val, field.value || [], field.onChange)
                                }
                            } else if (e.key === 'Backspace' && !e.currentTarget.value && field.value?.length > 0) {
                                field.onChange(field.value.slice(0, -1))
                            }
                        }}
                        onBlur={(e) => {
                            const val = e.currentTarget.value
                            if (val.trim()) {
                                addChip(val, field.value || [], field.onChange)
                            }
                        }}
                    />
                </div>
            )}
        />
    )
}

export default InputChips
