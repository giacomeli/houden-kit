'use client'
import { X } from 'lucide-react'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import { iconDefaults } from '../../../icons/defaults'
import Label from '../Label'

interface InputProps {
    control?: any
    maxFiles: number
    setFiles: React.Dispatch<React.SetStateAction<File[]>>
    files: File[]
}

const InputFile: React.FC<InputProps> = ({ control, maxFiles, setFiles, files }) => {
    const onFilesSelected = (file: File[]) => {
        if (files.length > maxFiles) {
            toast.warn(`Envie no máximo ${maxFiles} arquivos`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            })
            return
        }
        setFiles([...files, ...file])
    }

    const handleDeleteFile = (index: number) => {
        const newFiles = [...files]
        newFiles.splice(index, 1)
        setFiles(newFiles)
    }
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            onFilesSelected(acceptedFiles)
        },
        [onFilesSelected],
    )
    const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: maxFiles })
    return (
        <>
            <div className="form-field">
                <Label labelText="Anexo" />
                <div
                    {...getRootProps()}
                    className="flex items-center justify-center border border-dashed border-neutral p-2 cursor-pointer"
                >
                    <input {...getInputProps()} name="input" />
                    <p className="text-dark-gray">Arraste e solte ou clique para selecionar arquivos</p>
                </div>
                {maxFiles && <span className="text-xs text-error">* Insira no máximo {maxFiles} arquivos</span>}
            </div>
            {files.length > 0 && (
                <div className="flex flex-col gap-2">
                    {files.map((file, index) => (
                        <div key={index} className="bg-accent/50 text-accent-content p-2 rounded relative">
                            <p className="text-sm">{file.name}</p>
                            <X
                                {...iconDefaults}
                                className="absolute top-2 right-2 cursor-pointer"
                                onClick={() => handleDeleteFile(index)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
export default InputFile
