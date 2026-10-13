'use client'

import { useSyncExternalStore } from 'react'

/**
 * Store do Loader, sem Zustand. Reproduz o `useLoaderStore` do app de origem (`src/stores/useLoaderStore.ts`):
 * mesma contagem de requisições, mesmas ações e a mesma forma de uso, `useLoaderStore((s) => s.loading)`
 * no componente e `useLoaderStore.getState().startLoading()` fora dele (interceptors do cliente HTTP).
 */
export interface LoaderState {
    loading: boolean
    requestCount: number
    startLoading: () => void
    stopLoading: () => void
    resetStore: () => void
}

type LoaderData = Pick<LoaderState, 'loading' | 'requestCount'>

const initialState: LoaderData = {
    loading: false,
    requestCount: 0,
}

const listeners = new Set<() => void>()
let data: LoaderData = initialState

function setState(next: Partial<LoaderData>) {
    data = { ...data, ...next }
    snapshot = { ...data, ...actions }
    for (const listener of listeners) listener()
}

const actions = {
    startLoading: () => setState({ requestCount: data.requestCount + 1, loading: true }),
    stopLoading: () => {
        const next = Math.max(0, data.requestCount - 1)
        setState({ requestCount: next, loading: next > 0 })
    },
    resetStore: () => setState(initialState),
}

let snapshot: LoaderState = { ...data, ...actions }
const serverSnapshot: LoaderState = { ...initialState, ...actions }

function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

function useLoaderStoreBase<T>(selector: (state: LoaderState) => T): T {
    return useSyncExternalStore(
        subscribe,
        () => selector(snapshot),
        () => selector(serverSnapshot),
    )
}

export const useLoaderStore = Object.assign(useLoaderStoreBase, {
    getState: (): LoaderState => snapshot,
    setState,
    subscribe,
})

/** Atalhos fora do React, com a mesma API do store. */
export const startLoading = actions.startLoading
export const stopLoading = actions.stopLoading
