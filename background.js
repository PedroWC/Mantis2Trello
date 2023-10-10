// Este ouvinte é chamado quando a extensão é instalada ou atualizada
chrome.runtime.onInstalled.addListener(function () {
  // Remove todas as regras existentes para a extensão
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // Adiciona novas regras para a extensão
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // Condições para ativar a extensão
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            // Padrões de URL que ativam a extensão
            pageUrl: { urlMatches: 'mantis/view.php || bugs/view.php || view.php' },
          })
        ],
        // Ação a ser tomada quando as condições são atendidas
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
  // Abre a página de opções da extensão após a instalação
  chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
});

// Função executada quando o ícone da extensão é clicado
function sendClickMessage() {
  // Obtém a aba ativa atual
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currentTab = tabs[0].id;
    // Muda o ícone da extensão para um ícone de "carregando"
    chrome.action.setIcon({
      path: "assets/icons/Mantis2TrelloLoadingIcon16.png",
      tabId: currentTab
    });
    // Envia uma mensagem para o conteúdo da aba atual
    chrome.tabs.sendMessage(currentTab, "");
  });
}

// Callback para mensagens recebidas da extensão
function onMessageCallback(request, sender, sendResponse) {
  // Obtém a aba ativa atual
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currentTab = tabs[0].id;
    // Muda o ícone da extensão de volta para o ícone padrão
    chrome.action.setIcon({
      path: "icons/Mantis2TrelloIcon16.png",
      tabId: currentTab  // O tabId ainda pode ser usado se você quiser que o ícone seja atualizado apenas para uma aba específica
    });
  });  
}

// Adiciona um ouvinte para o evento de clique no ícone da extensão
chrome.action.onClicked.addListener(sendClickMessage);

// Adiciona um ouvinte para mensagens recebidas da extensão
chrome.runtime.onMessage.addListener(onMessageCallback);