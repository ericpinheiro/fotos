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
