# PORTING: origem de cada componente

Registro do port dos componentes do app de origem para o houden-kit.

- **Commit-base:** app de origem, branch `main`, commit `1e5c1c3efd3f51ea48c2277ec0961c56e44985e8` (02-10-2026).
- **Regra:** render idêntico ao do app de origem (mesmo DOM, mesmas classes, mesmos textos em pt-BR) e mesma API de props. Só muda o que não chega ao DOM nem à API: imports, `import type`, `import type React` onde o app de origem usa o namespace global, e o tipo global `IOption` virando tipo exportado.
- **Prova:** o teste de paridade (`tests/parity`) renderiza cada componente portado com os mesmos casos no app de origem (fixtures geradas por `npm run parity:generate`) e na lib, e compara o HTML. As únicas diferenças aceitas são as exceções abaixo.
- **Defeitos herdados** ficam na 0.1.0 e são corrigidos a partir da 0.2.0, um por changeset.

Tipos de entrada:

| Tipo | Significado |
| --- | --- |
| Portado | Cópia 1 para 1, verificada pelo teste de paridade |
| Adaptado | Markup e classes iguais; o que dependia de Next.js, sessão ou regra de acesso virou prop |
| Novo | Não existe no app de origem; segue as classes DaisyUI no estilo dele |

## Componentes

| Componente | Arquivo de origem | Tipo | Adaptações | Defeitos herdados |
| --- | --- | --- | --- | --- |
| Button | `src/components/Form/Button/index.tsx` | Portado | Nenhuma | Nenhum |
| Checkbox | `src/components/Form/Checkbox/index.tsx` | Portado | Nenhuma | D9 |
| DatePicker | `src/components/Form/DatePicker/index.tsx` | Portado | Nenhuma. O `uncontrolled.tsx` ficou fora (sem importadores no app de origem) | D3, D4 |
| DatePickerFormGroup | `src/components/Form/DatePickerFormGroup/index.tsx` | Portado | Nenhuma | D1 (via Tooltip) |
| DatePickerGroup | `src/components/Form/DatePickerGroup/index.tsx` | Portado | Nenhuma | Nenhum |
| FormError | `src/components/Form/FormError/index.tsx` | Portado | Nenhuma | Nenhum |
| Input | `src/components/Form/Input/index.tsx` | Portado | Ícones `faEye` e `faEyeSlash` viraram `Eye` e `EyeOff` | D8, D17 |
| InputChips | `src/components/Form/InputChips/index.tsx` | Portado | Ícone `faXmark` virou `X` | D3, D4, D8 |
| InputCurrency | `src/components/Form/InputCurrency/index.tsx` | Portado | Nenhuma | D4, D8 |
| InputCurrencyFormGroup | `src/components/Form/InputCurrencyFormGroup/index.tsx` | Portado | Nenhuma | Nenhum |
| InputFile | `src/components/Form/InputFile/index.tsx` | Portado | Ícone `faXmark` virou `X`. Continua chamando `toast.warn` do react-toastify direto | D5, D8 |
| Label | `src/components/Form/Label/index.tsx` | Portado | Nenhuma | D1 (via Tooltip), D5, D8 |
| MaskedInput | `src/components/Form/MaskedInput/index.tsx` | Portado | Nenhuma | D2, D4 |
| MultiSearchSelect | `src/components/Form/MultiSearchSelect/index.tsx` | Portado | `useClickOutside` importado de `src/hooks/useClickOutside`; `IOption` importado; texto `&times;` virou `X` | D3, D7, D8, D17 |
| MultiSelect | `src/components/Form/MultiSelect/index.tsx` | Portado | `IOption` e `IMultiSelectOptions` importados de `src/types/option` | D3, D4, D8 |
| MultiSelectFormGroup | `src/components/Form/MultiSelectFormGroup/index.tsx` | Portado | Idem. A interface de props se chama `IDatePickerFormGroupProps` no app de origem; no barrel, sai como `IMultiSelectFormGroupProps` | Nenhum |
| SearchInput | `src/components/Form/SearchInput/index.tsx` | Portado | Ícone `faMagnifyingGlass` virou `Search` | D3 |
| SearchSelect | `src/components/Form/SearchSelect/index.tsx` | Portado | `useClickOutside` e `IOption` importados | D6, D8, D17 |
| Select | `src/components/Form/Select/index.tsx` | Portado | Nenhuma | D8, D17 |
| TextArea | `src/components/Form/TextArea/index.tsx` | Portado | Nenhuma. No barrel, as props saem como `TextAreaProps` (no app de origem, `InputProps`) | D4 |
| TextAreaFormGroup | `src/components/Form/TextAreaFormGroup/index.tsx` | Portado | Nenhuma | D1 (via Tooltip) |
| TanStackTable | `src/components/TanStackTable/index.tsx` | Portado | Ícones `faChevronDown`, `faChevronUp`, `faSort` e `faThumbsDown` viraram `ChevronDown`, `ChevronUp`, `ChevronsUpDown` e `ThumbsDown` | D8 |
| TanStackPaginationBar | `src/components/TanStackTable/TanStackPaginationBar.tsx` | Portado | Nenhuma | D8, D16, D17 |
| useLegacyTanStackTable | `src/components/TanStackTable/useLegacyTanStackTable.ts` | Portado | Nenhuma | Nenhum |
| Alert | `src/components/Layout/Alert/index.tsx` | Portado | Nenhuma | Nenhum |
| Aside | `src/components/Layout/Aside/index.tsx` | Portado | Nenhuma | Nenhum |
| Avatar | `src/components/Layout/Avatar/index.tsx` | Portado | Nenhuma | D10 |
| FilterDrawer | `src/components/Layout/FilterDrawer/index.tsx` | Portado | Texto `✕` do botão de fechar virou `X` | D8, D12 |
| LiMenu | `src/components/Layout/LiMenu/index.tsx` | Portado | Nenhuma | Nenhum |
| Modal | `src/components/Layout/Modal/index.tsx` | Portado | Texto `✕` do botão de fechar virou `X` | D8, D11 |
| Tooltip | `src/components/Layout/Tooltip/index.tsx` | Portado | Nenhuma | D1 |
| UlMenu | `src/components/Layout/UlMenu/index.tsx` | Portado | Nenhuma | Nenhum |
| DashboardCard | `src/components/Dashboard/DashboardCard/index.tsx` | Portado | Ícone `faCircleInfo` virou `Info` | D1 (via Tooltip), D17 |
| ChartCard | `src/components/Dashboard/ChartCard/index.tsx` | Portado | Ícones `faMinus` e `faPlus` viraram `Minus` e `Plus`. O app de origem tem duas cópias (`Dashboard/ChartCard` e `Chat/ChartCard`), que diferem só por uma linha em branco; a lib tem uma | D5, D13, D17 |
| Chart | `src/components/Chart/index.tsx` | Portado | Nenhuma. O `import('chart.js/auto')` continua dinâmico e externo no `dist` | Nenhum |
| MessageTimestamp | `src/components/Chat/MessageTimestamp/index.tsx` | Portado | Nenhuma | D8 |
| useClickOutside | `src/hooks/ui/useClickOutside.ts` | Portado | Saiu do barrel `src/hooks/ui/index.ts`, que reexporta outros hooks do app de origem | Nenhum |
| toastSuccess, toastError | `src/utils/functions/toast/{toastSuccess,toastError}/index.tsx` | Portado | Nenhuma | D15 |
| IOption, IMultiSelectOptions | `src/schemas/sales/commonSchemas.ts`, `src/types/global.d.ts` | Portado (tipo) | Tipos TypeScript equivalentes ao `z.infer`, sem Zod; o `IOption` deixou de ser global | Nenhum |
| Sidebar | `src/components/Layout/Sidebar/index.tsx` | Adaptado | Props `menu`, `pathname`, `linkComponent`, `logo`, `userProfile`, `variant`, `defaultVariant`, `isHidden` e `isCollapsed` (ver Sidebar abaixo) | D8 |
| SidebarProvider, useSidebarContext | `src/components/Layout/Sidebar/{SidebarProvider.tsx,useSidebarContext.ts}` | Adaptado | Menu e rota por prop; busca pelo `filterMenuBySearch`; rotas escondidas viraram `isHidden`; o contexto ganhou `linkComponent`, `logo`, `userProfile` e `isCollapsed` | Nenhum |
| filterMenuBySearch | parte de busca de `src/components/Layout/Sidebar/useSidebarMenu.ts` | Adaptado | Sem `useGrants` nem `SIDEBAR_MENU`: recebe o menu. A normalização e a recursão são as mesmas | Nenhum |
| useActiveMenuItem | `src/components/Layout/Sidebar/useActiveMenuItem.ts` | Adaptado | A rota vem do contexto, não do `usePathname`; a assinatura `useActiveMenuItem(secoes)` é a mesma | Nenhum |
| useSidebarVariant | `src/components/Layout/Sidebar/useSidebarVariant.ts` | Adaptado | Parâmetro `defaultVariant` no lugar da env `NEXT_PUBLIC_SIDEBAR_VARIANT` (valor inválido continua ignorado). O `?sidebar=` é o mesmo; a escolha fica salva em `houden-kit.sidebarVariant`, chave própria da lib | Nenhum |
| SidebarUserProfile | `src/components/Layout/Sidebar/SidebarUserProfile.tsx` | Adaptado | Props `email`, `profileHref` (padrão `/perfil`) e `onSignOut` no lugar de `useAuthStore` e `useAuth`; o link passa pelo `linkComponent` | Nenhum |
| SidebarMenu | `src/components/Layout/Sidebar/variants/legacy/SidebarMenu.tsx` | Adaptado | `next/link` virou o `linkComponent` (via `useLinkComponent`, que cai em `'a'` fora do provider) | Nenhum |
| Variante legacy | `src/components/Layout/Sidebar/variants/legacy/index.tsx` | Adaptado | `next/image` com `houden_logo.svg` virou o slot `logo` (forma compacta com a barra recolhida); `isTicketDetailPage` virou `isCollapsed`; o perfil virou o slot `userProfile` | Nenhum |
| RailBar, RailItem, ContextPanel, PanelItem, variante rail | `src/components/Layout/Sidebar/variants/rail/*` | Adaptado | `next/image` virou o slot `logo` (forma compacta); `next/link` virou o `linkComponent`; o perfil virou o slot `userProfile`. Constantes `LARGURA_TRILHO`, `LARGURA_PAINEL` e `ID_PAINEL` iguais | D8 (import sem uso no ContextPanel) |
| Loader | `src/components/Layout/Loader/index.tsx` | Adaptado | `useLoaderStore` próprio (`loaderStore.ts`), sem Zustand, com `useSyncExternalStore`. Mesma API: `useLoaderStore(seletor)`, `useLoaderStore.getState().startLoading()` e `stopLoading()`, mesma contagem de requisições | Nenhum |
| RouteProgressBar | `src/components/Layout/RouteProgressBar.tsx` | Adaptado | Prop `pathname` no lugar do `usePathname`. O evento `navigation:start` virou contrato público: `NAVIGATION_START_EVENT` e `dispatchNavigationStart(href?)` | Nenhum |
| Toaster | `<ToastContainer position="top-center" />` de `src/contexts/_index.tsx` | Adaptado | Componente com a mesma configuração; aceita as props do `ToastContainer` | Nenhum |
| AppShell | `src/app/(auth)/layout.tsx` | Novo (a partir do markup do layout) | Mesma estrutura (`relative flex flex-row darkTarget`, RouteProgressBar, área `w-full min-w-0 bg-base-100 dark:bg-neutral/90`), sem sessão, WebSocket nem guarda de rota. `fullHeight` corresponde às telas de conversa e chatbot | D14 |
| Logo | Não existe | Novo | Logo em texto "Houden-kit" (completo) e monograma "HK" (compacto), no lugar do `houden_logo.svg` | Nenhum |
| PageHeader | Padrão das telas (`cadastros/grupos` e outras) | Novo | `flex justify-between items-center` com `h1.text-xl` e ações à direita | Nenhum |
| ConfirmDialog | Não existe (o app de origem usa SweetAlert2) | Novo | Sobre o Modal; motivo opcional ou obrigatório | Herda D11 do Modal |
| ThemeProvider, useTheme, applyStoredTheme | Não existe (tema fixo em `houdenTheme`) | Novo | `data-theme` no `<html>`, escolha em `houden-kit.theme`, `prefers-color-scheme` sem escolha | Nenhum |
| ChatBubble | Classes de `src/components/Chat/MessageList/MessageBubble.tsx` | Novo | `chat chat-start`/`chat-end`, `bg-emerald-200`/`bg-base-300`. O texto do lado do agente é `text-base-content` (no app de origem, `text-gray-700`, que some no tema escuro) | Nenhum |
| ChatMessageList | Não existe isolado | Novo | `role="log"`, acompanha o fim só se o usuário já estava perto dele | Nenhum |
| ChatComposer | Comportamento de `src/components/Chat/ChatInput/index.tsx` | Novo | Enter envia, Shift+Enter quebra linha, altura de 32 a 160 px. Sem `textarea-bordered` (D3). Botão com `dark:bg-base-300 dark:text-base-content` (no app de origem, `dark:bg-primary` com `text-primary`, ícone invisível no escuro) | Nenhum |
| MarkdownContent | Classes de `src/components/Chat/MarkdownRenderer/index.tsx` | Novo | `react-markdown` com GFM; link `text-primary dark:text-accent underline` em nova aba; sem HTML cru | Nenhum |

## Exceções à regra do port

### Ícones (requisito 11 da spec)

A lib não usa FontAwesome. Todo ícone vem do `lucide-react`, com as props de `src/icons/defaults.ts`:

- `size: '1em'`, que reproduz o tamanho do FontAwesome;
- `strokeWidth: 1.75`, a convenção do trilho da Sidebar do app de origem;
- `aria-hidden`, como o FontAwesome renderizava.

A `className` que o `FontAwesomeIcon` recebia passa igual para o ícone lucide. O teste de paridade compara o nome do ícone, depois de aplicar o mapa abaixo (`tests/parity/icon-map.ts`), e também as classes e o `aria-hidden`.

| Onde | No app de origem | Na lib |
| --- | --- | --- |
| Input (senha) | `faEye`, `faEyeSlash` | `Eye`, `EyeOff` |
| SearchInput | `faMagnifyingGlass` | `Search` |
| InputChips, InputFile | `faXmark` | `X` |
| TanStackTable | `faChevronDown`, `faChevronUp`, `faSort`, `faThumbsDown` | `ChevronDown`, `ChevronUp`, `ChevronsUpDown`, `ThumbsDown` |
| DashboardCard | `faCircleInfo` | `Info` |
| ChartCard | `faMinus`, `faPlus` | `Minus`, `Plus` |
| Modal, FilterDrawer | texto `✕` | `X` |
| MultiSearchSelect | texto `&times;` | `X` |

### Testes migrados

Os testes do app de origem migram junto, com as mudanças abaixo. Nenhuma toca o componente:

| Teste | Mudança |
| --- | --- |
| Input, SearchInput, SearchSelect, InputFile | Saiu o mock de `@fortawesome/react-fontawesome` |
| InputFile | O ícone de remover passou a ser localizado por `svg.lucide-x`, não pelo `data-testid` do mock |
| MultiSearchSelect | O botão de remover chip passou a ser localizado por `svg.lucide-x`, não pelo caractere `×` |
| SearchSelect, MultiSearchSelect | `vi.mock('@/hooks/ui')` virou `vi.mock` do caminho relativo de `useClickOutside` |
| SearchSelect, MultiSearchSelect, Select | `import type { IOption }`, porque o tipo deixou de ser global |
| TanStackTable, TanStackPaginationBar | `@/test/render` (render com `QueryClientProvider`, que a tabela não usa) virou `@testing-library/react` |
| Modal | O botão de fechar passou a ser localizado por `getByRole('button')`, não pelo texto `✕` |
| DashboardCard | Saiu o mock do FontAwesome; `vi.mock('@/components/Layout/Tooltip')` virou o caminho relativo |
| ChartCard | O teste vem da cópia `Chat/ChartCard` do app de origem (a de `Dashboard` não tem teste). Saiu o mock do FontAwesome; o alternador é localizado por `svg.lucide` e consultado de novo antes do segundo clique, porque `Plus` e `Minus` são componentes diferentes e o React troca o nó (o mock do app de origem mantinha o mesmo nó) |

| Testes da Sidebar | `~/config/sidebarMenu` virou `src/types/menu`, e os literais de menu perderam o campo `access`, que o tipo da lib não tem. Saíram os mocks de `next/link` e `next/image` |
| SidebarProvider | O mock de `next/navigation` e o de `useSidebarMenu` deram lugar às props `menu`, `pathname` e `isHidden`, e a um mock de `filterMenuBySearch`. Os casos de rotas fixas que escondiam a barra viraram casos da prop `isHidden` |
| useActiveMenuItem | O mock de `next/navigation` virou mock de `useSidebarContext`, com a mesma rota variável |
| useSidebarVariant | Os casos da env `NEXT_PUBLIC_SIDEBAR_VARIANT` viraram casos do parâmetro `defaultVariant` |
| RailBar, variante rail | O perfil chega pelo slot `userProfile` do contexto, no lugar do `SidebarUserProfile` mockado |
| Loader | `vi.mock('@/stores/useLoaderStore')` virou o caminho do `loaderStore` da lib |
| RouteProgressBar | `<RouteProgressBar pathname="/" />`; no app de origem, a rota vinha do mock global de `usePathname` |

O teste do `useSidebarMenu` do app de origem cobre memoização e acesso por módulo, que ficaram fora da lib. A busca extraída dele ganhou testes próprios (`filterMenuBySearch.test.ts`) e é comparada com o hook real do app de origem na paridade da Sidebar.

Componentes sem teste no app de origem ganharam testes de fumaça na lib: DatePickerFormGroup, DatePickerGroup, InputCurrencyFormGroup, MultiSelectFormGroup e TextAreaFormGroup. O markup deles é coberto pela paridade.

### Formatação

No commit-base, o app de origem ainda não tinha formatado com o Biome os arquivos listados abaixo. Na lib, eles ficam fora do formatter (`overrides` do `biome.json`), para que uma sincronização futura seja diff direto:

- `src/components/Form/{Input,InputChips,MultiSearchSelect,MultiSelect,SearchSelect,Select}/index.tsx`
- `src/components/Layout/FilterDrawer/index.tsx`
- `src/components/TanStackTable/TanStackPaginationBar.tsx`
- `src/styles/theme.css` (cópia literal de trechos do `globals.css`)

### Lint

O `npm run lint` do app de origem é ESLint, então o código dele nunca passou pelas regras recomendadas do Biome. Corrigir agora quebraria a regra do port. Por isso, as regras abaixo ficam desligadas **só** nos arquivos portados (segundo bloco de `overrides` do `biome.json`). O código novo da lib segue todas as regras, e cada ocorrência é um item da 0.2.x (D8).

| Regra | Onde dispara |
| --- | --- |
| `a11y/noLabelWithoutControl` | Input, Label, Select |
| `a11y/noStaticElementInteractions`, `a11y/useKeyWithClickEvents` | InputChips, MultiSearchSelect, MultiSelect |
| `a11y/noStaticElementInteractions`, `a11y/useKeyWithClickEvents` (fase 3) | FilterDrawer, MessageTimestamp |
| `a11y/noSvgWithoutTitle` | MultiSelect (SVG inline da seta), TanStackPaginationBar |
| `a11y/useButtonType` | Modal, FilterDrawer, TanStackTable, teste do Tooltip |
| `performance/noAccumulatingSpread` | TanStackTable (estado inicial das linhas expandidas) |
| `suspicious/noArrayIndexKey` | InputChips, InputFile, Select |
| `correctness/useExhaustiveDependencies` | InputFile |
| `correctness/noUnusedFunctionParameters`, `correctness/noUnusedImports` | InputCurrency, InputFile, testes de SearchSelect e MultiSearchSelect |
| `complexity/useOptionalChain` | SearchSelect, MultiSearchSelect |

### CSS

**Trechos copiados:** o `theme.css` copia as linhas 2 a 67, 69 a 71, 78 a 84, 140 a 155, 163 a 177, 289 a 316 e 362 a 369 do `src/styles/globals.css`. Os dois temas foram renomeados para `houdenTheme` e `houdenThemeDark` (nome, comentário e seletor da variante `dark`); os valores das cores são os mesmos. Quem migrar do app de origem troca o `data-theme` pelo novo nome.

**O que ficou de fora:**

- o `@import "tailwindcss"` (linha 1), porque é do consumidor;
- as regras de telas do app de origem:
  - `.rdt_*` (DataTable legada);
  - `.page`, `.proposal-*` e `@media print` (PDF de proposta);
  - `.collapse-title`, `.truncate-text` e `#message`;
  - `.conversas-layout`, Milkdown e `ticket-highlight`.

**Fonte:** a Inter vem de `@fontsource-variable/inter` pelo `fonts.css`, que define `--font-sans`. No app de origem, quem aplica a fonte no `<body>` é o `next/font`.

### Paridade dos adaptados

A Sidebar (variantes `legacy` e `rail`), o Loader e o RouteProgressBar também têm fixture de paridade. No gerador, o app de origem renderiza com os mesmos dados que a lib recebe por prop:

- `next/navigation`, `next/link` e `next/image` mockados;
- o `useSidebarMenu` real, com os grants liberados e o `SIDEBAR_MENU` trocado pelo menu do caso;
- `useAuthStore` e `useAuth` com um usuário fixo.

Duas exceções, além dos ícones:

| Exceção | Motivo |
| --- | --- |
| O `<img alt="logo Houden">` do app de origem é comparado com o conteúdo do slot `logo` (`ELEMENT_EXCEPTIONS` em `tests/parity/exceptions.ts`) | O `houden_logo.svg` não entra no pacote público (requisito 16) |
| A ordem dos atributos é ignorada em todo o HTML | Não tem significado no DOM, e a do `next/link` depende da implementação. Os valores continuam comparados |

### Ambiente do gerador de paridade

O gerador roda com o Vitest e o `node_modules` do próprio app de origem (`scripts/parity-generate.mjs`). O `react-currency-mask` 1.3.3 do app de origem declara `react ^18` como dependência e traz um React 18 aninhado. Fora de um bundler, isso quebra os hooks do InputCurrency, e por isso o teste do app de origem mocka o pacote.

Em produção, o bundler do Next resolve tudo para uma cópia só do React. O `tests/parity/generate/setup.ts` reproduz esse efeito no cache do `require`. Na lib, o `react-currency-mask` 1.3.5 declara o React como peer.

## Defeitos herdados

Ficam na 0.1.0 por causa da regra do port. Cada um vira um changeset na 0.2.x.

| Id | Defeito | Onde | Correção prevista |
| --- | --- | --- | --- |
| D1 | Classe literal `undefined` quando `className` não é passada | `Layout/Tooltip/index.tsx:9`. Aparece também em Label, DatePickerFormGroup e TextAreaFormGroup, que usam o Tooltip | Valor padrão `''` |
| D2 | Classe literal `undefined` quando `className` não é passada | `Form/MaskedInput/index.tsx:57` | Valor padrão `''` |
| D3 | `input-bordered` não existe no DaisyUI 5 (a borda já é o padrão) | DatePicker, InputChips, MultiSearchSelect, MultiSelect, SearchInput | Remover a classe |
| D4 | Classe `border-light-gray` sem definição no tema | DatePicker, InputChips, InputCurrency, MaskedInput, MultiSelect, TextArea | Trocar por `border-base-300` |
| D5 | Classes sem definição: `text-dark-gray` e `form-field` (InputFile), `text-normal` (Label), `text-dark-gray` (ChartCard) | `Form/InputFile/index.tsx:48` e `:55`, `Form/Label/index.tsx:32`, `Dashboard/ChartCard/index.tsx:22` | Trocar por classes do tema |
| D6 | Classe literal `false` no item não selecionado (`cond && 'classe'`) | `Form/SearchSelect/index.tsx:132` | Ternário com `''` |
| D7 | Prop `value` declarada e não usada; a seleção inicial vem de `watch(name)` | `Form/MultiSearchSelect/index.tsx` | Usar `value` quando `watch` não vier |
| D8 | Violações das regras recomendadas do Biome | Ver a tabela de Lint | Uma correção por regra |
| D9 | Espaço inicial na classe (`` ` ${className} ...` ``) | `Form/Checkbox/index.tsx:16` | Remover o espaço |
| D10 | Classe literal `undefined` quando `className` não é passada | `Layout/Avatar/index.tsx:9` | Valor padrão `''` |
| D11 | Modal com `role="dialog"`, mas sem `aria-modal`, sem `aria-labelledby` e sem foco preso; botão de fechar sem `type` e sem nome acessível (o `✕` era o único texto) | `Layout/Modal/index.tsx` | `aria-modal`, `aria-labelledby`, foco preso e `aria-label="Fechar"` |
| D12 | FilterDrawer: mesmas lacunas do Modal no botão de fechar; o fundo clicável não responde a teclado | `Layout/FilterDrawer/index.tsx` | `aria-label="Fechar"`, `type="button"`, fechar com Esc |
| D13 | Ação disparada por clique no próprio ícone, sem botão e sem teclado | ChartCard (alternar tamanho), InputFile (remover arquivo) | Envolver o ícone num `<button type="button">` com `aria-label` |
| D14 | Classe `darkTarget` sem definição e `div` vazio (`flex flex-row-reverse text-2xl`) herdados do layout autenticado | `Layout/AppShell/index.tsx` | Remover os dois |
| D15 | `toastSuccess(message, autoclose)` e `toastError` exigem o segundo argumento (tipado `any`) e fixam `position: 'top-right'`, diferente do `top-center` do Toaster | `utils/toast/*` | `autoclose` opcional e sem posição fixa |
| D16 | Com `pageSize` fora de `itensPerPageOption` (padrão `[20, 50, 100]`), o seletor mostra a primeira opção, e não o tamanho real da página | `TanStackTable/TanStackPaginationBar.tsx` | Incluir o `pageSize` atual nas opções |
| D17 | Cores que somem no tema escuro (o app de origem só usa o claro). Campos com `bg-white` sem cor de texto própria: no escuro, o texto herda o branco do tema e fica branco sobre branco. Também: o número do seletor de paginação (`rgba(0,0,0,.54)` sobre fundo escuro), o ícone de informação `text-secondary` e o `text-dark-gray` (D5). Verificado no Chrome | Input, Select, SearchSelect, MultiSearchSelect, TanStackPaginationBar, DashboardCard, ChartCard | Classes com variante `dark:`, como já fazem DatePicker, MaskedInput e InputCurrency (`dark:bg-primary`) |

## Como sincronizar com o app de origem

Quando o app de origem mudar um componente portado, a sincronização parte do commit-base:

1. Ver o que mudou desde o commit-base nas pastas portadas:

    ```bash
    git -C "$PARITY_SOURCE_DIR" diff 1e5c1c3e..<novo-commit> -- \
        src/components/Form src/components/TanStackTable src/components/Layout \
        src/components/Dashboard src/components/Chart src/components/Chat/MessageTimestamp \
        src/hooks/ui/useClickOutside.ts src/utils/functions/toast src/styles/globals.css
    ```

2. Aplicar a mudança no arquivo correspondente da lib (mesma estrutura de pastas), mantendo as adaptações e as exceções desta página.
3. Trocar o commit-base em `scripts/parity-shared.mjs` e no topo desta página.
4. Regenerar as fixtures (`npm run parity:extract && npm run parity:generate`) e rodar `npm test`. Diferença na paridade indica mudança de markup que precisa ser decidida: aceitar (é o novo comportamento do app de origem) ou registrar como exceção.
5. Registrar a sincronização num changeset.
