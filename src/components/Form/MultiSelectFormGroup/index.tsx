import { IMultiSelectOptions, IOption } from '../../../types/option'
import FormError from '../FormError'
import Label from '../Label'
import MultiSelectComponent from '../MultiSelect'

export interface IDatePickerFormGroupProps {
    labelText: string
    error?: string
    isRequired?: boolean
    className?: string
    inputClass?: string
    isDisabled?: boolean
    tooltipText?: string
    tooltipContent?: string | React.ReactNode
    control: any
    name: string
    options: IMultiSelectOptions[] | IOption[]
}

const MultiSelectFormGroup: React.FC<IDatePickerFormGroupProps> = ({
    inputClass = '',
    labelText,
    error = '',
    isRequired = false,
    className = '',
    isDisabled = false,
    tooltipText = '',
    tooltipContent = '',
    control,
    name,
    options,
}) => {
    return (
        <Label
            tooltipText={tooltipText}
            tooltipContent={tooltipContent}
            required={isRequired}
            className={`flex flex-col items-start justify-start font-bold text-sm dark:text-white ${className}`}
            hasError={Boolean(error)}
            labelText={labelText}
        >
            <MultiSelectComponent
                control={control}
                name={name}
                disabled={isDisabled}
                className={inputClass}
                hasError={Boolean(error)}
                options={options}
            />
            {error && <FormError>{error}</FormError>}
        </Label>
    )
}

export default MultiSelectFormGroup
