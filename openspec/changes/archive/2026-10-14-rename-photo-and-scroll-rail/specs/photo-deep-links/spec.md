## ADDED Requirements

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
