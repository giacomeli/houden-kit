'use client'

import type React from 'react'
import { useEffect, useId, useState } from 'react'
import Button from '../../Form/Button'
import FormError from '../../Form/FormError'
import TextArea from '../../Form/TextArea'
import Modal from '../Modal'

export interface ConfirmDialogReason {
    label: string
    /** Exige texto antes de confirmar (padrão `approval`: recusa com motivo). */
    required?: boolean
    placeholder?: string
}

export interface ConfirmDialogProps {
    open: boolean
    title: string
    description?: React.ReactNode
    /** Padrão: "Confirmar". */
    confirmLabel?: string
    /** Padrão: "Cancelar". */
    cancelLabel?: string
    /** `error` para ações destrutivas. Padrão: `primary`. */
    tone?: 'primary' | 'error'
    /** Mostra um campo de motivo, enviado no `onConfirm`. */
    reason?: ConfirmDialogReason
    isLoading?: boolean
    onConfirm: (reason?: string) => void
    onCancel: () => void
}

/**
 * Confirmação sobre o Modal. Substitui o SweetAlert2 do app de origem, que injeta `<style>` em runtime e
 * quebra a CSP sem `unsafe-inline`.
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    description,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    tone = 'primary',
    reason,
    isLoading = false,
    onConfirm,
    onCancel,
}) => {
    const reasonId = useId()
    const [text, setText] = useState('')
    const [showError, setShowError] = useState(false)

    // Cada abertura começa com o campo limpo.
    useEffect(() => {
        if (open) {
            setText('')
            setShowError(false)
        }
    }, [open])

    const handleConfirm = () => {
        if (!reason) return onConfirm()
        const value = text.trim()
        if (reason.required && !value) {
            setShowError(true)
            return
        }
        onConfirm(value)
    }

    return (
        <Modal isOpen={open} onClose={onCancel} headerText={title} className="w-full max-w-md">
            {description && <div className="text-sm mb-4">{description}</div>}
            {reason && (
                <div className="flex flex-col gap-1">
                    <label htmlFor={reasonId} className="font-bold text-sm">
                        {reason.label} {reason.required && <span className="text-error text-lg">*</span>}
                    </label>
                    <TextArea
                        id={reasonId}
                        value={text}
                        placeholder={reason.placeholder}
                        hasError={showError}
                        className="min-h-24"
                        onChange={(event) => {
                            setText(event.currentTarget.value)
                            if (showError) setShowError(false)
                        }}
                    />
                    {showError && <FormError>Informe o motivo.</FormError>}
                </div>
            )}
            <div className="flex justify-end gap-2 mt-6">
                <Button type="button" className="btn-ghost" onClick={onCancel} disabled={isLoading}>
                    {cancelLabel}
                </Button>
                <Button
                    type="button"
                    className={tone === 'error' ? 'btn-error' : 'btn-accent'}
                    onClick={handleConfirm}
                    isLoading={isLoading}
                >
                    {confirmLabel}
                </Button>
            </div>
        </Modal>
    )
}

export default ConfirmDialog
