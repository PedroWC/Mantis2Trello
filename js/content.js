window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-SNVFE94072');

function gx(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

chrome.storage.sync.get('mantis2TrelloOptions', function (data) {
  const { trelloAPIKey, trelloBoardId, trelloColumnId, tags } = data.mantis2TrelloOptions;
  Object.assign(mantis2TrelloOptions, { trelloAPIKey, trelloBoardId, trelloColumnId, tags });
});

let mantis2TrelloOptions = {
  trelloAPIKey: '',
  trelloBoardId: '',
  trelloColumnId: '',
  tags: []
};
const createCard = async function () {
  let newCard = {
    name: "Mantis " + gx('/html/body/table[3]/tbody/tr[10]/td[2]').innerText,
    desc: gx('/html/body/table[3]/tbody/tr[11]/td[2]').innerText,
    idList: mantis2TrelloOptions.trelloColumnId,
    pos: 'top',
    urlSource: window.location.href,
    idLabels: await selectTags(mantis2TrelloOptions.tags)
  };

  window.Trello.post('/cards/', newCard, creationSuccess, creationFailure);
  gtag('event', 'click_add_card');
};
const authenticationSuccess = async function () {
  console.log('Autenticação bem-sucedida');
  console.log('Tentando criar um cartão window.Trello...');
  await createCard();
};

const authenticationFailure = function () {
  console.log('Falha na autenticação');
  alert('Não consegui autenticar com o window.Trello. O cartão não será criado.')
};
const creationSuccess = function (aux, data) {
  console.log('Cartão criado com sucesso. Dados retornados:' + JSON.stringify(data));
  alert('Cartão criado com sucesso.');
};

const creationFailure = function (data) {
  console.log('Error:' + JSON.stringify(data));
  alert('Error:' + JSON.stringify(data));
};



async function searchTag(tagName) {

  let labels = "";

  const response = await window.Trello.get('/boards/' + mantis2TrelloOptions.trelloBoardId + '/labels/');

  response.forEach(element => {
    if (element.name === tagName) {
      labels = element.id
    }
  });

  return labels;
}

async function selectTags(tags) {
  let labels = [];
  const tagKeys = [
    'Categoria', 'Gravidade',
    'Frequencia', 'Relator',
    'Visibilidade', 'Prioridade',
    'Status'
  ];
  const xpathMap = {
    'Categoria': '/html/body/table[3]/tbody/tr[3]/td[2]',
    'Gravidade': '/html/body/table[3]/tbody/tr[3]/td[3]',
    'Frequencia': '/html/body/table[3]/tbody/tr[3]/td[4]',
    'Relator': '/html/body/table[3]/tbody/tr[5]/td[2]',
    'Visibilidade': '/html/body/table[3]/tbody/tr[5]/td[4]',
    'Prioridade': '/html/body/table[3]/tbody/tr[7]/td[2]',
    'Status': '/html/body/table[3]/tbody/tr[7]/td[2]'
  };

  for (const tagKey of tagKeys) {
    if (tags[tagKey].switch) {

      let value = gx(xpathMap[tagKey]).innerText;

      if (value.includes(tags[tagKey].valor)) {
        let res = await searchTag(tags[tagKey].tag);
        if (res) {
          labels.push(res);
        }
      }
    }
  }

  return labels
}

let authorizationTrello = function (mantis2TrelloOptions) {
  window.Trello.setKey(mantis2TrelloOptions.trelloAPIKey);
  window.Trello.authorize({
    type: 'popup',
    name: 'Mantis2Trello',
    persist: true,
    interactive: false,
    scope: {
      read: true,
      write: true
    },
    expiration: 'never',
    success: authenticationSuccess,
    error: authenticationFailure
  });
};

const onMessageCallback = function (request, sender, sendResponse) {
  chrome.storage.sync.get(mantis2TrelloOptions, authorizationTrello);
};

chrome.runtime.onMessage.addListener(onMessageCallback);