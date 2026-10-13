import type React from 'react'
import Markdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Classes do MarkdownRenderer do chat do app de origem para link (mais `dark:text-accent`, porque o
// `text-primary` some no tema escuro) e parágrafo; tabela e código com as
// classes DaisyUI equivalentes. O HTML cru do Markdown não vira elemento (padrão do react-markdown),
// o que evita injeção e mantém a CSP.
const components: Components = {
    a: ({ node: _node, ...props }) => (
        <a {...props} className="text-primary dark:text-accent underline" target="_blank" rel="noopener noreferrer" />
    ),
    p: ({ node: _node, ...props }) => <p className="mt-0 mb-3 last:mb-0" {...props} />,
    ul: ({ node: _node, ...props }) => <ul className="list-disc pl-5 mb-3 last:mb-0" {...props} />,
    ol: ({ node: _node, ...props }) => <ol className="list-decimal pl-5 mb-3 last:mb-0" {...props} />,
    table: ({ node: _node, ...props }) => (
        <div className="overflow-x-auto mb-3 last:mb-0">
            <table className="table table-xs" {...props} />
        </div>
    ),
    pre: ({ node: _node, ...props }) => (
        <pre className="bg-base-200 rounded-md p-2 overflow-x-auto text-xs mb-3 last:mb-0" {...props} />
    ),
    code: ({ node: _node, className, ...props }) => (
        <code className={className ?? 'bg-base-200 rounded px-1 text-xs'} {...props} />
    ),
}

export interface MarkdownContentProps {
    children: string
    className?: string
}

/** Markdown com GFM (tabelas, listas de tarefa, links automáticos) e links abrindo em nova aba. */
const MarkdownContent: React.FC<MarkdownContentProps> = ({ children, className = '' }) => {
    return (
        <div className={`text-sm leading-relaxed break-words ${className}`}>
            <Markdown remarkPlugins={[remarkGfm]} components={components}>
                {children}
            </Markdown>
        </div>
    )
}

export default MarkdownContent
