var _mantis2TrelloOptions = {
  trelloAPIKey: '12d839f0981c6d5d8fdfeef6a6377965',
  trelloIdMantisList: '645add568a77dfb3cbc6df5d'
};

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


function selectPriority(cardPriority) {
  // if (cardPriority.includes('baixa')) {
  //   return {
  //     "id": "63b82fc2436dd10169c90da8",
  //     "idBoard": "5aa82b65a64c6258b61a4f68",
  //     "name": "Prioridade: baixa",
  //     "color": "red_dark"
  //   }
  // } else if (cardPriority.includes('normal')) {
  //   return {
  //     "id": "63b82fd7a39344039295f287",
  //     "idBoard": "5aa82b65a64c6258b61a4f68",
  //     "name": "Prioridade: normal",
  //     "color": "red_dark"
  //   }
  // } else if (cardPriority.includes('alta')) {
  //   return {
  //     "id": "63b82fe24c68bb016afd6ed6",
  //     "idBoard": "5aa82b65a64c6258b61a4f68",
  //     "name": "Prioridade: alta",
  //     "color": "red_dark"
  //   }
  // } else {
  //   return {
  //     "id": "63b82fe24c68bb016afd6ed6",
  //     "idBoard": "5aa82b65a64c6258b61a4f68",
  //     "name": "Prioridade: alta",
  //     "color": "red_dark"
  //   }
  // }
  if (cardPriority.includes('baixa')) {
    return "64fe9edec4b65b649a80a5fd"
  } else if (cardPriority.includes('normal')) {
    return "64fe9eeb8d3cfd89300c9e4e"
  } else if (cardPriority.includes('alta')) {
    return "64fe9ef65b7ca1576250fa3a"
  } else {
    return "64fe9ef65b7ca1576250fa3a"
  }
}

function selectSystem(category) {
  // if (category.includes('SISOR')) {
  //   return {
  //     "id": "63c15458a270c703d9d95eea",
  //     "idBoard": "5aa82b65a64c6258b61a4f68",
  //     "name": "SISOR",
  //     "color": "green_light"
  //   }
  // }
  // else if (category.includes('SIGPLAN')) {
  //   return {
  //     "id": "63c1547defd83403697870f1",
  //     "idBoard": "5aa82b65a64c6258b61a4f68",
  //     "name": "SIGPLAN",
  //     "color": "green_light"
  //   }
  // }
  if (category.includes('SISOR')) {
    return "64fe9f1a0d6c417d1d711f91"
  }
  else if (category.includes('SIGPLAN')) {
    return "64fe9f26a9d7c163bec59110"
  }
  else {
    alert("Categoria não cadastrada no Trello. Categoria do mantis: " + category);
    throw new Error("Categoria não cadastrada. Categoria do mantis: " + category);
  }
}


var createCard = function () {
  var mantisSummary = gx('/html/body/table[3]/tbody/tr[10]/td[2]').innerText;
  var mantisDescription = gx('/html/body/table[3]/tbody/tr[11]/td[2]').innerText;
  var mantisUrl = window.location.href;
  var mantisPriority = gx('/html/body/table[3]/tbody/tr[7]/td[2]').innerText;
  var mantisCategory = gx('/html/body/table[3]/tbody/tr[3]/td[2]').innerText;

  var mantisList = '';
  var cardPosition = 'bottom';
  var cardDue = '';

  mantisList = _mantis2TrelloOptions.trelloIdInmediatoLabel;
  cardPosition = 'top';
  var cardDate = new Date();
  cardDue = cardDate.toISOString();

  var newCard = {
    name: mantisSummary,
    desc: mantisDescription,
    idList: _mantis2TrelloOptions.trelloIdMantisList,
    pos: cardPosition,
    urlSource: mantisUrl,
    idLabels: [
      selectPriority(mantisPriority),
      selectSystem(mantisCategory)
    ]
  };

  Trello.post('/cards/', newCard, creationSuccess, creationFailure);
};

var authorizationTrello = function (mantis2TrelloOptions) {
  _mantis2TrelloOptions = mantis2TrelloOptions;

  Trello.setKey(_mantis2TrelloOptions.trelloAPIKey);
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
  chrome.storage.sync.get(_mantis2TrelloOptions, authorizationTrello);
};

chrome.runtime.onMessage.addListener(onMessageCallback);

