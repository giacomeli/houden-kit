'use client'

import { ToastContainer, type ToastContainerProps } from 'react-toastify'

/**
 * Contêiner dos toasts, com a mesma configuração do `AppProvider` do app de origem
 * (`<ToastContainer position="top-center" />`). O CSS do react-toastify vem no `houden-kit/theme.css`;
 * a versão 10 não injeta `<style>` em runtime, o que mantém a CSP sem `unsafe-inline`.
 */
export default function Toaster(props: ToastContainerProps) {
    return <ToastContainer position="top-center" {...props} />
}
