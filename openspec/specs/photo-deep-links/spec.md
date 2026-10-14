# photo-deep-links Specification

## Purpose
TBD - created by archiving change add-photo-deep-links. Update Purpose after archive.

## Requirements
### Requirement: Identificador estável por foto
Cada foto da galeria MUST ter um identificador derivado do nome do arquivo em `public/photos`, sem extensão e sem o prefixo numérico de ordenação (`^\d+[-_]`). O identificador MUST permanecer o mesmo quando apenas o prefixo numérico do arquivo mudar.

#### Scenario: Identificador a partir do nome do arquivo
- **WHEN** existe o arquivo `002-roda-gigante.jpg`
- **THEN** o identificador da foto é `roda-gigante`

#### Scenario: Reordenação não quebra o identificador
- **WHEN** o arquivo `002-roda-gigante.jpg` é renomeado para `010-roda-gigante.jpg`
- **THEN** o identificador da foto continua sendo `roda-gigante`

### Requirement: URL reflete a foto exibida após navegação
Ao trocar a foto exibida por interação do usuário (botões anterior/próxima, setas do teclado ou clique em miniatura), o sistema SHALL atualizar o fragmento da URL para `#<identificador>` da nova foto, sem recarregar a página, sem rolar a página e sem adicionar entradas ao histórico do navegador.

#### Scenario: Avançar para a próxima foto
- **WHEN** o usuário está na primeira foto e clica em "Próxima"
- **THEN** a URL passa a terminar em `#<identificador da segunda foto>`

#### Scenario: Clicar numa miniatura
- **WHEN** o usuário clica na miniatura da foto `roda-gigante`
- **THEN** a foto `roda-gigante` é exibida e a URL passa a terminar em `#roda-gigante`

#### Scenario: Voltar para a primeira foto
- **WHEN** o usuário navega de volta até a primeira foto
- **THEN** a URL passa a terminar em `#<identificador da primeira foto>`

#### Scenario: Histórico não é poluído
- **WHEN** o usuário navega por várias fotos e depois usa o botão "voltar" do navegador
- **THEN** o navegador sai do site (ou volta à página anterior a ele), em vez de percorrer as fotos vistas

### Requirement: Abrir o site direto numa foto
Ao carregar a página com um fragmento `#<identificador>` que corresponde a uma foto existente, o sistema SHALL exibir essa foto, com o contador e a miniatura ativa correspondentes.

#### Scenario: Link compartilhado válido
- **WHEN** alguém abre `/#roda-gigante`
- **THEN** a galeria exibe a foto `roda-gigante`, o contador mostra a posição dela e a miniatura dela está marcada como ativa

### Requirement: Abertura sem fragmento mantém o comportamento atual
Ao carregar a página sem fragmento, o sistema SHALL exibir a primeira foto e MUST NOT adicionar fragmento à URL até que o usuário navegue.

#### Scenario: Acesso direto ao site
- **WHEN** alguém abre `/` sem fragmento
- **THEN** a galeria exibe a primeira foto e a URL permanece sem fragmento

### Requirement: Fragmento inválido cai na primeira foto
Ao carregar a página (ou ao mudar o fragmento) com um fragmento que não corresponde a nenhuma foto, o sistema SHALL exibir a primeira foto e SHALL remover o fragmento inválido da URL sem adicionar entrada ao histórico.

#### Scenario: Foto inexistente
- **WHEN** alguém abre `/#foto-que-nao-existe`
- **THEN** a galeria exibe a primeira foto e a URL fica sem fragmento

### Requirement: Mudança manual do fragmento troca a foto
Com a página já aberta, quando o fragmento da URL mudar por ação externa (ex.: o usuário cola outro link `#<identificador>` na mesma aba), o sistema SHALL exibir a foto correspondente.

#### Scenario: Colar outro link na mesma aba
- **WHEN** a galeria está em `/#galope` e o usuário altera a URL para `/#roda-gigante`
- **THEN** a galeria passa a exibir a foto `roda-gigante`

### Requirement: Carrossel posicionado na foto do link
Ao carregar a página com um fragmento `#<identificador>` válido, ou quando o fragmento mudar com a página aberta, o sistema SHALL rolar o carrossel de miniaturas (vertical no desktop, horizontal no mobile) de modo que a miniatura da foto selecionada fique visível e centralizada no carrossel, sem animação perceptível no carregamento inicial.

#### Scenario: Link direto para foto no meio da galeria (desktop)
- **WHEN** alguém abre `/#gado-fotogenico` numa janela larga (> 820px)
- **THEN** o carrossel lateral já aparece rolado com a miniatura de `gado-fotogenico` visível, centralizada e marcada como ativa

#### Scenario: Link direto para foto no meio da galeria (mobile)
- **WHEN** alguém abre `/#gado-fotogenico` numa tela estreita (≤ 820px)
- **THEN** o carrossel inferior já aparece rolado horizontalmente com a miniatura de `gado-fotogenico` visível e centralizada

#### Scenario: Abrir sem fragmento
- **WHEN** alguém abre `/` sem fragmento
- **THEN** o carrossel permanece no início, como hoje

### Requirement: Carrossel acompanha a navegação
Ao trocar de foto por botões anterior/próxima, setas do teclado ou clique em miniatura, o sistema SHALL rolar o carrossel apenas o necessário para que a miniatura ativa fique totalmente visível; se ela já estiver totalmente visível, o carrossel MUST NOT se mover.

#### Scenario: Avançar além da área visível
- **WHEN** a miniatura ativa é a última visível no carrossel e o usuário clica em "Próxima"
- **THEN** o carrossel rola até a nova miniatura ativa ficar totalmente visível

#### Scenario: Clicar numa miniatura visível
- **WHEN** o usuário clica numa miniatura que já está totalmente visível
- **THEN** o carrossel não se move

#### Scenario: Voltar ao início pelo "Próxima" na última foto
- **WHEN** o usuário está na última foto e clica em "Próxima"
- **THEN** o carrossel rola até a primeira miniatura ficar visível

### Requirement: Rolagem restrita ao carrossel
O posicionamento do carrossel MUST alterar apenas a rolagem do próprio carrossel, sem rolar a página ou outros contêineres.

#### Scenario: Link direto no mobile não rola a página
- **WHEN** alguém abre `/#gado-fotogenico` numa tela estreita (≤ 820px)
- **THEN** a página continua no topo (`window.scrollY` igual a 0) e só o carrossel foi rolado
