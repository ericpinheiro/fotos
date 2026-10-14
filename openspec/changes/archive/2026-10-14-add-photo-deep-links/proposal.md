## Why

Hoje a galeria guarda a foto atual só em estado do React (`useState(0)` em `src/components/Gallery.tsx`), então qualquer acesso ao site sempre abre na primeira foto e não há como mandar para alguém o link de uma foto específica. Queremos que a URL reflita a foto exibida, para que ela possa ser copiada e compartilhada.

## What Changes

- Cada foto passa a ter um identificador estável e legível, derivado do nome do arquivo sem o prefixo numérico de ordenação (ex.: `002-roda-gigante.jpg` → `roda-gigante`).
- Ao navegar (anterior/próxima, setas do teclado ou clique numa miniatura), a URL é atualizada para `/#<id-da-foto>` (ex.: `https://…/#roda-gigante`), sem recarregar a página e sem criar entradas no histórico.
- Ao abrir o site com um fragmento `#<id>` válido, a galeria abre direto naquela foto.
- Ao abrir o site sem fragmento, o comportamento continua o mesmo: primeira foto, URL limpa.
- Fragmento desconhecido (foto removida/renomeada ou digitado errado) cai na primeira foto e o fragmento inválido é removido da URL.
- Alterar o fragmento manualmente com a página aberta (colar outro link na mesma aba) troca para a foto correspondente.
- Usa-se fragmento (`#id`) em vez de query string (`?foto=id`), conforme preferência — é plenamente possível no navegador.

## Capabilities

### New Capabilities
- `photo-deep-links`: endereçamento de fotos individuais da galeria pela URL (`#<id>`), incluindo sincronização da URL durante a navegação e abertura direta a partir de um link.

### Modified Capabilities
<!-- Nenhuma: não há specs existentes em openspec/specs/. -->

## Impact

- `src/lib/photo-types.ts`: novo campo `id` em `Photo`.
- `src/lib/photos.ts`: popular `id` a partir do nome do arquivo sem prefixo numérico (mesma chave já usada para `photoOverrides`).
- `src/components/Gallery.tsx`: ler o fragmento ao montar, escutar `hashchange` e atualizar a URL ao trocar de foto.
- Sem novas dependências e sem mudanças no servidor. Prévias de link (WhatsApp, redes sociais) continuarão mostrando os metadados gerais do site, pois o fragmento não chega ao servidor.
