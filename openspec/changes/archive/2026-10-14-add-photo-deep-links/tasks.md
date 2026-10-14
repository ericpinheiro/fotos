## 1. Identificador da foto

- [x] 1.1 Adicionar `id: string` ao tipo `Photo` em `src/lib/photo-types.ts`
- [x] 1.2 Em `src/lib/photos.ts`, preencher `id` com o nome do arquivo sem extensão e sem prefixo numérico (o `overrideKey` já calculado) e emitir `console.warn` se dois arquivos gerarem o mesmo id
- [x] 1.3 Atualizar o comentário de `photoOverrides` em `src/lib/photo-captions.ts` para mencionar que essa chave também é o id usado nos links (`/#<id>`)

## 2. Sincronização da URL na galeria

- [x] 2.1 Em `src/components/Gallery.tsx`, criar `show(i)` que faz `setIdx(i)` e `history.replaceState(history.state, "", "#" + encodeURIComponent(photos[i].id))`; usar em `goPrev`, `goNext` e no `onClick` das miniaturas
- [x] 2.2 Adicionar efeito de montagem que lê `location.hash`, seleciona a foto correspondente, ou volta para a primeira e remove o fragmento inválido via `replaceState` (sem fragmento: não altera a URL)
- [x] 2.3 Registrar o mesmo handler no evento `hashchange` (com limpeza no retorno do efeito)

## 3. Verificação

- [x] 3.1 Rodar `npm run lint` e `npm run build` sem erros (ajustar conforme o risco do `set-state-in-effect` no design, se acusar)
- [x] 3.2 No `npm run dev`, conferir manualmente: `/` abre na primeira foto sem fragmento; navegar por botões, setas e miniaturas atualiza `#id`; abrir `/#roda-gigante` em nova aba exibe essa foto com contador e miniatura corretos; `/#nao-existe` cai na primeira foto e limpa a URL; trocar o fragmento na mesma aba troca a foto; "voltar" do navegador não percorre fotos
