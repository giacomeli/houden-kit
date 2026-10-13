'use client'
import { useMask } from '@react-input/mask'
import React from 'react'
import { Controller } from 'react-hook-form'

export interface IMaskedInputProps extends React.HTMLProps<HTMLInputElement> {
    name: string
    control: any
    mask: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    isDisabled?: boolean
}

// Convert react-input-mask format (9 = digit) to @react-input/mask format (_ = digit)
const convertMask = (mask: string): string => {
    return mask.replace(/9/g, '_')
}

const MaskedInput: React.FC<IMaskedInputProps> = ({
    name,
    control,
    mask = '',
    className,
    isDisabled = false,
    onBlur,
}) => {
    const convertedMask = convertMask(mask)
    const inputRef = useMask({
        mask: convertedMask,
        replacement: { _: /\d/ },
    })

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <input
                    ref={(e) => {
                        field.ref(e)
                        if (e) inputRef.current = e
                    }}
                    name={field.name}
                    value={field.value || ''}
                    onChange={(e) => {
                        field.onChange(e)
                    }}
                    onBlur={(e) => {
                        field.onBlur()
                        if (onBlur) {
                            onBlur(e)
                        }
                    }}
                    disabled={isDisabled}
                    className={`input input-sm bg-white dark:bg-primary border p-2 rounded-md w-full cursor-pointer ${
                        fieldState.error?.message ? 'border-error' : 'border-light-gray'
                    } ${className}`}
                />
            )}
        />
    )
}

export default MaskedInput
