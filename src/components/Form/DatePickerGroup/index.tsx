'use client'

import React from 'react'
import DatePickerFormGroup from '../DatePickerFormGroup'
import Label from '../Label'

export interface IDatePickerGroupProps {
    control: any
    firstInputLabel: string
    secondInputLabel: string
    label: string
    firstInputName: string
    secondInputName: string
    inputClass?: string
}

const DatePickerGroup: React.FC<IDatePickerGroupProps> = ({
    control,
    label,
    firstInputLabel,
    secondInputLabel,
    secondInputName,
    firstInputName,
}) => {
    return (
        <div>
            <Label labelText={label} hasError={false} className="font-bold text-sm dark:text-white" />
            <div className="flex gap-4 items-center">
                <DatePickerFormGroup control={control} name={firstInputName} labelText={firstInputLabel} />
                <DatePickerFormGroup control={control} name={secondInputName} labelText={secondInputLabel} />
            </div>
        </div>
    )
}

export default DatePickerGroup
