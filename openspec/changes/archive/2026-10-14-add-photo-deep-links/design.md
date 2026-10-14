## Context

A galeria é uma única página (`src/app/page.tsx`) que carrega as fotos no servidor (`loadPhotos` em `src/lib/photos.ts`) e as passa para o client component `Gallery` (`src/components/Gallery.tsx`). A foto atual é só `useState(0)`; navegação acontece por botões, setas do teclado e miniaturas, todas chamando `setIdx`. Cada `Photo` já tem `slug` (nome do arquivo sem extensão, com prefixo numérico, ex.: `002-roda-gigante`), e `loadPhotos` já calcula `overrideKey` (sem o prefixo) para buscar legendas em `photo-captions.ts`. Hoje não há dois arquivos que colidam após remover o prefixo.

## Goals / Non-Goals

**Goals:**
- Link compartilhável por foto no formato `/#<id>` (ex.: `/#roda-gigante`).
- Abrir o site sem fragmento continua indo para a primeira foto com URL limpa.
- Ids estáveis frente a reordenação dos arquivos.

**Non-Goals:**
- Prévias de link específicas por foto (Open Graph por foto) — o fragmento não é enviado ao servidor; exigiria rotas `/foto/<id>` ou query string renderizada no servidor.
- Botão "copiar link" na interface (a URL na barra já resolve o caso pedido; pode vir depois).
- Usar o botão "voltar" do navegador para percorrer fotos.
- Rolar a trilha de miniaturas até a foto ativa (a galeria não faz isso hoje em nenhuma navegação).

## Decisions

### Fragmento (`#id`) em vez de query string (`?foto=id`)
É o formato preferido pelo usuário e é totalmente suportado. Como a página é estática e a foto é escolhida no cliente, o fragmento é a opção natural: não gera nova requisição nem mudança de rota no Next, e não exige `useSearchParams`/Suspense. Alternativa considerada: `?foto=` (permitiria escolher a foto no servidor e metadados por foto), descartada por estética e por não ser necessária para o objetivo.

### Id = nome do arquivo sem prefixo numérico
Adicionar `id: string` a `Photo`, preenchido em `loadPhotos` com o `overrideKey` já existente. Assim o id é legível (`roda-gigante`), coincide com a chave usada em `photoOverrides` e não muda quando a ordem dos arquivos muda. Alternativa: usar o `slug` completo (`002-roda-gigante`) — mais feio e quebra links ao renumerar. Alternativa: índice numérico (`#2`) — quebra ao inserir/remover fotos.

### Atualizar a URL com `history.replaceState`
Em toda troca de foto disparada pelo usuário, chamar `history.replaceState(history.state, "", "#" + id)`. Diferente de atribuir `location.hash`, `replaceState` não cria entrada no histórico, não dispara `hashchange` (evitando laço com o listener) e não tenta rolar até um elemento com aquele id. Preserva-se `history.state` porque o App Router do Next guarda estado ali. Alternativa: `pushState` por foto — tornaria o "voltar" uma navegação foto a foto, o que poluiria o histórico após olhar dezenas de fotos.

Implementação sugerida: centralizar a troca numa função `show(i)` que faz `setIdx(i)` e atualiza a URL, usada por `goPrev`, `goNext` e pelas miniaturas (os updaters de `goPrev`/`goNext` passam a calcular o próximo índice a partir do `idx` atual em vez de `setIdx(fn)`, para que a URL use o mesmo índice). Alternativa: um `useEffect` em `idx` que escreve a URL — mais simples, mas escreveria o fragmento da primeira foto já no carregamento, violando "URL limpa sem fragmento"; exigiria flag extra.

### Ler o fragmento após montar
Num `useEffect` de montagem: ler `location.hash`, decodificar (`decodeURIComponent`), procurar o índice pelo `id`; se achar, `setIdx`; se houver fragmento mas não achar, `setIdx(0)` e `replaceState` removendo o fragmento (`location.pathname + location.search`). O mesmo handler é registrado em `window` para `hashchange`. Ler `window` no inicializador do `useState` não é possível sem quebrar a hidratação, pois o servidor não conhece o fragmento.

## Risks / Trade-offs

- [Primeira foto aparece por um instante antes da foto do link, já que o servidor renderiza o índice 0] → Aceitável para um portfólio; a imagem da primeira foto já está com `priority`. Se incomodar, uma melhoria futura é esconder o palco até o efeito de montagem rodar.
- [Regra `react-hooks/set-state-in-effect` do eslint-config-next pode reclamar do `setIdx` no efeito de montagem] → Rodar `npm run lint`; se acusar, estruturar a sincronização como handler de evento chamado no efeito ou usar `useSyncExternalStore` para o fragmento.
- [Renomear o nome do arquivo (não só o prefixo) quebra links antigos] → Cai na primeira foto (comportamento definido na spec); documentar no comentário de `photo-captions.ts` que o nome sem prefixo é também o id público.
- [Dois arquivos com o mesmo nome após remover o prefixo teriam o mesmo id] → Não ocorre hoje; a busca usa a primeira ocorrência. Pode-se emitir um `console.warn` em `loadPhotos` ao detectar duplicata.
- [Prévia do link no WhatsApp/redes mostra o site genérico, não a foto] → Fora de escopo; registrado em Non-Goals.
