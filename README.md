# Mantis2Trello
Extensão do chrome para criar cards no Trello a partir de casos do Mantis PRODEMGE.


## Requisitos de configuração
![primeiroPassoConfiguracao](https://github.com/PedroWC/Mantis2Trello/assets/63911644/ed131ea6-dd05-40ab-932b-96d07aaae417)

1. Você precisa de uma chave de API do Trello.
2. Você precisa ter a chave de identificação de quadro do Trello, em qual quadro deseja criar cartões Mantis.
3. Você precisa ter a chave de identificação da coluna do quadro do Trello, em qual coluna deseja criar cartões Mantis.

### Como obter a chave da API do Trello

1) Obtenha sua chave de API pelo link [Chave de API](https://trello.com/power-ups/admin)
2) Adicione uma nova Power-up.
   ![configuracaoPowerUpTrello](https://github.com/PedroWC/Mantis2Trello/assets/63911644/c3166b45-ddf4-424b-9a0e-a7e547ad6eda)
   2.1) Dê um título à integração.<br>
   2.2) Adicione a área de trabalho onde está o quadro de destino dos cards.<br>
   2.3) Preencha seu email nos campos "Email" e "Contato de suporte".<br>
   2.4) Preencha seu nome no campo "Autor".
   
3) Após criar uma Power-up, na aba lateral esquerda, o botão "Chave de API" levará até a chave necessária.

### Como obter a chave de identificação de quadro do Trello

1) Navegue até o quadro de destino.
2) Crie um Card de teste na coluna de destino dos novos cards.
3) Dentro do card de teste, clique em compartilhar nas opções à direita.
4) Escolha Compartilhar JSON.<br>
    Essa tela você usará nos próximos passos posteriores.
6) Busque pela propriedade "idBoard".

### Como obter a chave de identificação da coluna do quadro do Trello

1) Ainda no arquivo JSON do passo anterior, busque pela propriedade "idList".


## Adicionar TAGs

1) Para adicionar um novo filtro basta escolher uma das categoria, circuladas em vermelho, abaixo:

![mantisExemplo](https://github.com/PedroWC/Mantis2Trello/assets/63911644/ba61585b-503f-4df2-9c57-ef0f4effff79)

2) Selecione a categoria desejada no campo "Escolha..." e clique em adicionar.
3) No campo "Valor", digite os caracteres que deseja filtrar no campo escolhido no item 1.
4) No campo "Tag", digite o nome exato da etiqueta do trello.
   <br>Obs: A etiqueta deve existir no trello.
5) Ative os filtros de tags desejados pela chave localizada abaixo do campo Tag.
6) Para apagar um filtro de tag basta clicar no X localizado na parte superior direita do card correspondente.


### Por fim basta clicar em "Finish" na aba "Confirm".


## Use o plugin pela primeira vez

Ao usar o plug-in pela primeira vez, um pop-up de trello será aberto para conceder acesso aos seus conselhos:

