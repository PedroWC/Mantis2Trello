(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date(); a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-51911409-5', 'auto');
ga('set', 'checkProtocolTask', function () { }); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');
ga('send', 'pageview', '/options.html');

var mantis2TrelloOptions = {
  trelloAPIKey        : '',
  trelloIdMantisList  : '',
  trelloBoardId       : '',
  trelloColumnId      : '',
  tags                : []
};

// Saves options to chrome.storage
function save_options() {

  mantis2TrelloOptions.trelloAPIKey = document.getElementById('trelloAPIKey').value;
  mantis2TrelloOptions.trelloToken = document.getElementById('trelloToken').value;
  mantis2TrelloOptions.trelloBoardId = document.getElementById('trelloBoardId').value;
  mantis2TrelloOptions.trelloColumnId = document.getElementById('trelloColumnId').value;
  mantis2TrelloOptions. = document.getElementById('');
  mantis2TrelloOptions. = document.getElementById('');
  mantis2TrelloOptions. = document.getElementById('');
  mantis2TrelloOptions. = document.getElementById('');
  mantis2TrelloOptions. = document.getElementById('');
  mantis2TrelloOptions. = document.getElementById('');
  mantis2TrelloOptions. = document.getElementById('');

  chrome.storage.sync.set(mantis2TrelloOptions, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 1000);
  });
};

function addTagStorage() 





// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default values.
  chrome.storage.sync.get(mantis2TrelloOptions, function (items) {
    document.getElementById('trelloAPIKey').value = items.trelloAPIKey;
    document.getElementById('trelloIdMantisList').value = items.trelloIdMantisList;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);