## 1. Novo id da foto

- [x] 1.1 Renomear `public/photos/055-gado-na-estrada.jpg` para `public/photos/055-gado-fotogenico.jpg` com `git mv`
- [x] 1.2 Em `src/lib/photo-captions.ts`, trocar a chave `"gado-na-estrada"` por `"gado-fotogenico"` mantendo caption, alt, film e settings como estão

## 2. Carrossel acompanha a foto ativa

- [x] 2.1 Em `src/components/Gallery.tsx`, adicionar `ref` na `div.colRail` e, em `syncFromHash`, centralizar o carrossel na miniatura do link logo após o `setIdx`
- [x] 2.2 Criar a função que rola apenas o carrossel via `getBoundingClientRect` + `rail.scrollBy` (centralizar ou mínimo necessário, nos dois eixos), sem usar `scrollIntoView`, respeitando `prefers-reduced-motion`
- [x] 2.3 Adicionar `useEffect` dependente de `idx` que aplica a rolagem `"nearest"`, ignorando execuções em que o índice não mudou (montagem/StrictMode)

## 3. Verificação

- [x] 3.1 Rodar `npm run lint` e `npm run build` sem erros
- [x] 3.2 No `npm run dev`, em janela larga: `/#gado-fotogenico` abre a foto 055 com a miniatura centralizada no carrossel lateral; `/#gado-na-estrada` cai na primeira foto e limpa a URL; navegar com setas além da área visível faz o carrossel acompanhar; clicar numa miniatura visível não move o carrossel; "Próxima" na última foto volta o carrossel ao início
- [x] 3.3 Em largura ≤ 820px: `/#gado-fotogenico` deixa a miniatura centralizada no carrossel inferior e `window.scrollY` continua 0
