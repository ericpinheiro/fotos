## Why

Os links por foto (`/#<id>`) já funcionam, mas dois detalhes atrapalham o compartilhamento: a foto `055-gado-na-estrada.jpg` deveria ter o link `#gado-fotogenico`, e ao abrir um link direto a foto certa aparece no palco enquanto o carrossel de miniaturas (lateral no desktop, inferior no mobile) continua no início, com a miniatura ativa fora de vista.

## What Changes

- Renomear `public/photos/055-gado-na-estrada.jpg` para `public/photos/055-gado-fotogenico.jpg` e a chave correspondente em `photoOverrides`, para que o id passe a ser `gado-fotogenico`. Legenda e alt **não** mudam.
- O link antigo `#gado-na-estrada` deixa de existir e passa a cair na primeira foto (comportamento já especificado para ids desconhecidos). Não haverá alias.
- Ao abrir o site por um link direto (ou trocar o `#` com a página aberta), o carrossel rola até a miniatura ativa, deixando-a centralizada e visível.
- Ao navegar (botões, setas do teclado, miniaturas), o carrossel acompanha a foto ativa, rolando apenas quando a miniatura ativa estiver fora de vista.
- A rolagem afeta só o carrossel; a página em si não rola (importante no mobile, onde a página tem altura livre).

## Capabilities

### New Capabilities
<!-- Nenhuma. -->

### Modified Capabilities
- `photo-deep-links`: adiciona requisitos para posicionar o carrossel de miniaturas na foto ativa ao abrir um link e durante a navegação. (A troca do id de uma foto é uma mudança de conteúdo, não de requisito.)

## Impact

- `public/photos/055-gado-na-estrada.jpg` → `public/photos/055-gado-fotogenico.jpg` (renomeação via `git mv`).
- `src/lib/photo-captions.ts`: chave `"gado-na-estrada"` → `"gado-fotogenico"`.
- `src/components/Gallery.tsx`: ref no carrossel e efeito que rola o carrossel até a miniatura ativa.
- Links já enviados com `#gado-na-estrada` passam a abrir a primeira foto.
