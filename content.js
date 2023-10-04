// Criação de um novo elemento de script
var scriptElement = document.createElement('script');
scriptElement.async = true;
scriptElement.src = 'https://www.googletagmanager.com/gtag/js?id=G-SNVFE94072';

// Carregamento do script
document.head.appendChild(scriptElement);

// Callback a ser executado quando o script for carregado
scriptElement.onload = function() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-SNVFE94072');
};

var mantis2TrelloOptions = {
  trelloAPIKey: '',
  trelloBoardId: '',
  trelloColumnId: '',
  tags: []
};

chrome.storage.sync.get('mantis2TrelloOptions', function (data) {
  const { trelloAPIKey, trelloBoardId, trelloColumnId, tags } = data.mantis2TrelloOptions;
  Object.assign(mantis2TrelloOptions, { trelloAPIKey, trelloBoardId, trelloColumnId, tags });
});

function gx(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
};

var authenticationSuccess = function () {
  console.log('Autenticação bem-sucedida');
  console.log('Tentando criar um cartão Trello...');
  createCard();
};

var authenticationFailure = function () {
  console.log('Falha na autenticação');
  alert('Não consegui autenticar com o Trello. O cartão não será criado.')
};

var creationSuccess = function (data) {
  console.log('Cartão criado com sucesso. Dados retornados:' + JSON.stringify(data));
  alert('Cartão criado com sucesso.');

};

var creationFailure = function (data) {
  console.log('Error:' + JSON.stringify(data));
  alert('Error:' + JSON.stringify(data));
};

function searchTag(tagName) {
  labels = Trello.get('/boards/' + mantis2TrelloOptions.trelloBoardId + '/labels/');

  JSON.parse()

  labels.forEach(element => {
    if (element.name.equals(tagName)) {
      return element.id
    }

    return ''
  });
}

function selectTags (tags) {
  var labels = []
  const tagKeys = [
    'categoria',    'gravidade', 
    'frequencia',   'relator', 
    'visibilidade', 'prioridade', 
    'st'
  ];
  const xpathMap = {
    'categoria'     : '/html/body/table[3]/tbody/tr[3]/td[2]',
    'gravidade'     : '/html/body/table[3]/tbody/tr[3]/td[3]',
    'frequencia'    : '/html/body/table[3]/tbody/tr[3]/td[4]',
    'relator'       : '/html/body/table[3]/tbody/tr[5]/td[2]',
    'visibilidade'  : '/html/body/table[3]/tbody/tr[5]/td[4]',
    'prioridade'    : '/html/body/table[3]/tbody/tr[7]/td[2]',
    'st'            : '/html/body/table[3]/tbody/tr[7]/td[2]'
  };
  
  tagKeys.forEach(tagKey => {
    if (tags[tagKey].switch) {

      const value = gx(xpathMap[tagKey]).innerText;

      if (tags[tagKey] === value) {
        labels.push({
          "id": searchTag(tags[tagKey].tag)
        });
      }
    }
  });

  return labels
}

var createCard = function () {
  var newCard = {
    name: gx('/html/body/table[3]/tbody/tr[10]/td[2]').innerText,
    desc: gx('/html/body/table[3]/tbody/tr[11]/td[2]').innerText,
    idList: mantis2TrelloOptions.trelloColumnId,
    pos: 'top',
    urlSource: window.location.href,
    idLabels: selectTags(mantis2TrelloOptions.tags)
  };

  Trello.post('/cards/', newCard, creationSuccess, creationFailure);
  gtag('event', 'click_add_card');
};

var authorizationTrello = function (mantis2TrelloOptions) {
  Trello.setKey(mantis2TrelloOptions.trelloAPIKey);
  Trello.authorize({
    type: 'popup',
    name: 'Mantis2Trello',
    scope: {
      read: true,
      write: true
    },
    expiration: 'never',
    success: authenticationSuccess,
    error: authenticationFailure
  });
};

var onMessageCallback = function (request, sender, sendResponse) {
  chrome.storage.sync.get(mantis2TrelloOptions, authorizationTrello);
};

chrome.runtime.onMessage.addListener(onMessageCallback);