'use client'

import { X } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { iconDefaults } from '../../../icons/defaults'

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    headerText?: string
    className?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, headerText, className = '' }) => {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement

            if (target.closest('[role="dialog"]')) return

            if (modalRef.current && !modalRef.current.contains(target)) {
                onClose()
            }
        }

        if (isOpen) {
            document.body.style.overflow = 'hidden'
            document.addEventListener('keydown', handleKeyDown)
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.body.style.overflow = ''
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return createPortal(
        <div
            className="z-50 fixed inset-0 flex items-center justify-center"
            style={{ left: 0, right: 0, top: 0, bottom: 0, margin: 0 }}
        >
            <div className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm"></div>
            <div
                ref={modalRef}
                role="dialog"
                className={`relative p-4 bg-white dark:bg-primary rounded-md overflow-y-scroll ${className}`}
            >
                <div className="flex justify-between items-center mb-4">
                    {headerText ? <h2 className="text-lg font-semibold">{headerText}</h2> : null}
                    <button
                        onClick={onClose}
                        className={`${headerText ? '' : 'absolute top-2 right-8'} hover:text-red-500`}
                    >
                        <X {...iconDefaults} />
                    </button>
                </div>
                <div className=" ">{children}</div>
            </div>
        </div>,
        document.body,
    )
}

export default Modal
