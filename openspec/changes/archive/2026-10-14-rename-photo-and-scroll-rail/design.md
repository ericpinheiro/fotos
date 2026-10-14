## Context

`Gallery.tsx` controla a foto ativa (`idx`) e sincroniza com o `#` da URL (change `add-photo-deep-links`). O carrossel é a `div.colRail`: no desktop é uma coluna de 132px com `overflow-y: auto` dentro de um grid de altura `100dvh`; no mobile (`max-width: 820px`) vira uma linha com `overflow-x: auto`, e a página inteira passa a ter altura livre (`.site` com `height: auto`), ou seja, a página rola. As miniaturas são `next/image` com `width`/`height` e `loading="lazy"`; como o tamanho é reservado pelos atributos, as posições das miniaturas são conhecidas antes das imagens carregarem.

O id de cada foto é o nome do arquivo sem prefixo numérico, e é também a chave de `photoOverrides`.

## Goals / Non-Goals

**Goals:**
- Link `#gado-fotogenico` para a foto hoje chamada `055-gado-na-estrada.jpg`.
- Miniatura ativa visível no carrossel ao abrir um link e ao navegar.

**Non-Goals:**
- Alias/redirecionamento de `#gado-na-estrada` (o link foi publicado há pouco; cai na primeira foto, como qualquer id desconhecido).
- Mudar legenda ou alt da foto.
- Mecanismo genérico de ids customizados por foto em `photoOverrides`.

## Decisions

### Renomear o arquivo em vez de criar um campo `id` em `photoOverrides`
O spec define o id como o nome do arquivo sem prefixo. Renomear o arquivo (`git mv`, mantendo o prefixo `055-` e portanto a ordem) e a chave em `photoOverrides` mantém essa regra única e sem exceções. Alternativa: adicionar `id?: string` em `PhotoOverride` — mais flexível, mas cria duas fontes para o id e precisa de mudança no spec; desnecessário para um caso.

### Rolar só o contêiner, calculando o deslocamento manualmente
`element.scrollIntoView()` rola todos os ancestrais roláveis, incluindo a página — no mobile isso jogaria a página para baixo até o carrossel, violando "rolagem restrita ao carrossel". Em vez disso, guardar um `ref` na `div.colRail`, achar a miniatura ativa (`rail.children[idx]`) e calcular com `getBoundingClientRect()` de ambos o deslocamento relativo; então chamar `rail.scrollBy({ top, left, behavior })`. O mesmo cálculo cobre os dois eixos (no desktop só `top` difere de zero de forma útil; no mobile só `left`), sem precisar detectar o breakpoint.

- **Centralizar** (link direto / `hashchange`): deslocamento = posição da miniatura − posição do carrossel − (tamanho do carrossel − tamanho da miniatura) / 2, nos dois eixos; `behavior: "auto"` (instantâneo).
- **Mínimo necessário** (navegação): se a miniatura extrapola o início, rolar até alinhar ao início; se extrapola o fim, alinhar ao fim; caso contrário, não rolar. `behavior: "smooth"`.

### Como diferenciar "link" de "navegação"
Como todas as miniaturas já estão renderizadas, `syncFromHash` centraliza o carrossel diretamente na miniatura do link (`"center"`, instantâneo), logo após o `setIdx`. A navegação comum é tratada por um `useEffect` dependente de `idx` que aplica `"nearest"`; ele guarda o último índice num `useRef` e não faz nada quando o índice não mudou. Isso é necessário porque, na montagem, esse efeito rodaria com `idx = 0` logo depois do link já ter centralizado o carrossel e, vendo a primeira miniatura fora de vista, rolaria o carrossel de volta ao início (o mesmo vale para a dupla execução de efeitos do StrictMode).

Alternativa descartada: um `useRef` com o "modo da próxima rolagem" lido pelo efeito de `idx`. Na montagem, o efeito de `idx` roda no mesmo commit do efeito do `#`, ainda com `idx = 0`, consumindo o modo `"center"` antes da re-renderização com o índice do link.

## Risks / Trade-offs

- [Links já compartilhados com `#gado-na-estrada` abrem a primeira foto] → Aceito pelo usuário; foto foi publicada recentemente.
- [Respeitar `prefers-reduced-motion`] → Usar `"smooth"` só quando `matchMedia("(prefers-reduced-motion: reduce)")` não casar; caso contrário `"auto"`.
- [Layout ainda não estabilizado no primeiro efeito (fontes, CSS)] → As miniaturas têm tamanho reservado por `width`/`height`; se na verificação manual a centralização ficar imprecisa, executar a rolagem dentro de `requestAnimationFrame`.
- [Navegação rápida por teclado com `smooth` enfileira rolagens] → `scrollBy` com smooth é interrompido pela próxima chamada; comportamento aceitável.
