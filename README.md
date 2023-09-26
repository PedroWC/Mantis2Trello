# Mantis2Trello
Crie cartão Trello a partir do Mantis Ticket

## Requisitos de configuração
![primeiroPassoConfiguracao](https://github.com/PedroWC/Mantis2Trello/assets/63911644/ed131ea6-dd05-40ab-932b-96d07aaae417)

1. Você precisa de uma chave de API do Trello.
2. Você precisa ter a chave de identificação de quadro do Trello, em qual quadro deseja criar cartões Mantis.
3. Você precisa ter a chave de identificação da coluna do quadro do Trello, em qual coluna deseja criar cartões Mantis.

### Como obter a chave da API do Trello

1) Obtenha sua chave de API de: [Chave de API](https://trello.com/power-ups/admin)
2) Adicione uma nova Power-up.
   ![configuracaoPowerUpTrello](https://github.com/PedroWC/Mantis2Trello/assets/63911644/c3166b45-ddf4-424b-9a0e-a7e547ad6eda)
   2.1) Dê um título à integração.<br>
   2.2) Adicione a área de trabalho onde está o quadro de destino dos cards.<br>
   2.3) Preencha seu email nos campos "Email" e "Contato de suporte".<br>
   2.4) Preencha seu nome no campo "Autor".
   
3) Após criar uma Power-up, a aba lateral esquerda o botão "Chave de API" levará até a chave necessária.

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

### Obter id de TAGS

1) Crie uma tag nesse card de exemplo, esse card será usado nos novos cards automáticos gerados pela extensão.
2) No arquivo JSON, busque pelo nome da tag e identifique o id dela, como na imagem abaixo:
   <br><br>
   ![tagExemplo](https://github.com/PedroWC/Mantis2Trello/assets/63911644/078108bc-13dd-4673-a449-c149d3328b53)
   <br>
   No exemplo acima, o id da tag é "64fe9edec4b65b649a80a5fd"


### Adicionar uma nova TAG

1) Adicione um nome para sua nova TAG
2) Na página de qualquer mantis, inspecione o elemento HTML que deseja filtrar e copie seu XPATH completo e cole no campo correspondente na página de configuração da extensão.
3) Adicione no campo "Value", o texto a ser identificado no elemento.
4) Adicione no campo "TAG Id" o id da tag correspondente obtida em [Obter id de TAGS](#obter-id-de-tags)


## Use o plugin pela primeira vez

Ao usar o plug-in pela primeira vez, um pop-up de trello será aberto para conceder acesso aos seus conselhos:

