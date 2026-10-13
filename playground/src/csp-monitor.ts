// Registra no console toda violação de CSP, com prefixo fácil de filtrar (`[CSP]`). O preview do
// playground roda com o header do template; zero mensagens é o critério de aceite.
document.addEventListener('securitypolicyviolation', (event) => {
    console.error('[CSP]', event.violatedDirective, event.blockedURI || '(inline)', event.sourceFile ?? '')
})
