'use client'
import React from 'react'
import { Controller } from 'react-hook-form'

export interface IDatePickerProps extends React.HTMLProps<HTMLInputElement> {
    name: string
    control: any
    hasError?: boolean
    hasTimePicker?: boolean
}

const DatePicker: React.FC<IDatePickerProps> = ({
    name,
    control,
    className,
    hasError = false,
    hasTimePicker = false,
    ...rest
}) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <input
                    type={hasTimePicker ? 'datetime-local' : 'date'}
                    disabled={rest.disabled}
                    value={
                        field.value
                            ? field.value instanceof Date
                                ? hasTimePicker
                                    ? field.value.toISOString().slice(0, 16)
                                    : field.value.toISOString().slice(0, 10)
                                : String(field.value).slice(0, hasTimePicker ? 16 : 10)
                            : ''
                    }
                    onChange={(e) => {
                        const val = e.target.value
                        field.onChange(val ? new Date(val) : null)
                    }}
                    className={`input input-sm input-bordered bg-white dark:bg-primary dark:text-base-content w-full cursor-pointer ${
                        hasError || fieldState.error ? 'border-red-500' : 'border-light-gray'
                    } ${className ?? ''}`}
                />
            )}
        />
    )
}

export default DatePicker
