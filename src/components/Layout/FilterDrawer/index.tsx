'use client'
import { X } from 'lucide-react'
import React, { useEffect } from 'react'
import { UseFormHandleSubmit } from 'react-hook-form'
import { iconDefaults } from '../../../icons/defaults'
import Button from '../../Form/Button'

interface IFilterDrawerProps {
    visibleRight: boolean
    setVisibleRight: (value: boolean) => void
    children: React.ReactNode
    handleSubmit: UseFormHandleSubmit<any>
    handleData: (data: any) => void
    handleReset: () => void
    isLoading?: boolean
}

const FilterDrawer: React.FC<IFilterDrawerProps> = ({
    visibleRight,
    setVisibleRight,
    children,
    handleSubmit,
    handleData,
    handleReset,
    isLoading,
}) => {
    // Fechar com Escape
    useEffect(() => {
        if (!visibleRight) return
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setVisibleRight(false)
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [visibleRight, setVisibleRight])

    if (!visibleRight) return null

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setVisibleRight(false)} />

            {/* Drawer */}
            <div className="fixed top-0 right-0 z-50 h-full w-80 bg-white dark:bg-base-100 dark:text-base-content shadow-lg flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-2xl">Filtros</h2>
                    <button
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={() => setVisibleRight(false)}
                    >
                        <X {...iconDefaults} />
                    </button>
                </div>

                {/* Content */}
                <form className="flex-1 overflow-y-auto p-4 space-y-4" onSubmit={handleSubmit(handleData)}>
                    {children}
                    <div className="sticky bottom-0 bg-white dark:bg-base-100 space-y-2 pt-2">
                        <Button className="btn-accent w-full" type="submit" disabled={isLoading}>
                            {isLoading ? <span className="loading loading-spinner loading-xs" /> : 'Filtrar'}
                        </Button>
                        <Button className="btn-outline w-full" type="button" onClick={handleReset}>
                            Limpar
                        </Button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default FilterDrawer
