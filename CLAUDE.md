# CLAUDE.md

Orientações para trabalhar neste repositório. A arquitetura está em [docs/ARQUITETURA.md](./docs/ARQUITETURA.md), e a origem de cada componente, em [PORTING.md](./PORTING.md).

## O que é

O houden-kit é uma biblioteca de UI em React 19, Tailwind CSS 4 e DaisyUI 5, nascida do port dos componentes de um app interno (o app de origem). É publicada no npm como `houden-kit` e consumida pelos apps gerados por um template interno e, no futuro, pelo próprio app de origem.

## Invariantes

1. **Port 1 para 1.**
   - Componente portado do app de origem tem o mesmo DOM, as mesmas classes, os mesmos textos e as mesmas props do commit-base registrado no `PORTING.md`.
   - Só muda o que não chega ao DOM nem à API: imports e tipos.
   - Defeito herdado não se corrige de passagem: ele vai para a tabela "Defeitos herdados" e é corrigido num changeset próprio.
2. **Mesma estrutura de pastas do app de origem** (`src/components/Form/Button/index.tsx`), para a sincronização ser diff direto.
3. **Sem regra de negócio.**
   - Nada de autenticação, sessão, grants, stores Zustand, React Query, services, tenant ou rotas do app de origem.
   - O que o app de origem lia de hooks chega por prop ou slot.
   - O `tests/dist-scan.test.ts` barra `next/*`, `zustand`, `@tanstack/react-query`, `@fortawesome`, `@/` e `~/` no `dist`.
4. **CSP sem `unsafe-inline`.** Nada de CSS-in-JS, `<style>` injetado, fonte ou script de CDN. Estilo calculado em runtime, só por `element.style`. O react-toastify fica na versão 10.
5. **Ícones só do `lucide-react`.**
   - Nos componentes portados, com `iconDefaults` (`src/icons/defaults.ts`).
   - Símbolo de texto não é ícone.
6. **`'use client'` só onde há estado, efeito ou contexto.** O build preserva a diretiva, e a varredura do `dist` compara as listas do `src` e do `dist`.
7. **Classes DaisyUI e do tema.**
   - Sem prefixo de classes e sem visual recriado fora do DaisyUI.
   - Componente novo funciona nos dois temas, `houdenTheme` e `houdenThemeDark`.

## Idioma e estilo

- Comentários, textos de UI e documentação em pt-BR; identificadores novos em inglês. Identificadores herdados do app de origem em português (`alternarArea`, `areaAberta`) ficam como estão.
- Sem emojis em código, documentação, commits e PRs, incluindo símbolos usados como ícone.
- Em strings e comentários de código, seta ASCII `->`.
- Diagramas em Mermaid.
- Biome com a configuração do app de origem (4 espaços, aspas simples, sem ponto e vírgula, 120 colunas). Os `overrides` do `biome.json` valem só para código portado; código novo segue todas as regras.

## Comandos

```bash
npm test                    # Vitest (migrados, novos, paridade, README e PORTING)
npm run lint                # Biome
npm run typecheck
npm run build               # dist módulo a módulo
npm run test:dist           # varredura do dist (depois do build)
npm run check:package       # publint e attw
npm run check:consumer      # app Vite que instala o tarball
npm run playground:build    # playground e check-gallery
npm run playground:check-csp
```

Antes de dar uma tarefa por concluída, rode `npm run lint && npm run typecheck && npm test && npm run build && npm run test:dist`. Se mexeu em componente exportado ou em CSS, rode também `npm run check:consumer` e `npm run playground:build`.

## Paridade

- **Cobertura:** todo componente portado ou adaptado tem caso em `tests/parity/cases` e fixture em `tests/parity/fixtures`.
- **Regenerar as fixtures:** é preciso o repositório do app de origem indicado em `PARITY_SOURCE_DIR`, e o comando `npm run parity:extract && npm run parity:generate`.
- **O que a geração não faz:** não escreve nada na árvore do app de origem, nem o cache.
- **Exceções:** diferença aceita entre app de origem e lib só entra como exceção em `tests/parity/exceptions.ts` ou `icon-map.ts`, sempre documentada no `PORTING.md`.

## Git e publicação

- Commit e push só com pedido explícito, e push sempre como ação separada.
- Nenhuma menção a IA, nem `Co-Authored-By`, em commits, PRs, código ou documentação.
- Toda mudança publicada leva um changeset (`npm run changeset`).
- As ações abaixo são do dono do repositório:
  - criar o repositório no GitHub;
  - fazer o primeiro `npm publish`;
  - configurar o trusted publishing no npm;
  - ativar o GitHub Pages (variável `PAGES_ENABLED`).
