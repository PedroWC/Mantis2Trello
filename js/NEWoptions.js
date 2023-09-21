

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
    trelloAPIKey: '',
    trelloToken: '',
    trelloBoardId: '',
    trelloColumnId: '',
    tags: []
}

$(function () {
    $("#form-total").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "fade",
        enableAllSteps: true,
        autoFocus: true,
        transitionEffectSpeed: 500,
        titleTemplate: '<div class="title">#title#</div>',
        labels: {
            previous: 'Back',
            next: 'Next',
            finish: 'Confirm',
            current: ''
        },
        onStepChanging: function (event, currentIndex, newIndex) {
            var fullname = $('#first_name').val() + ' ' + $('#last_name').val();
            var room = $('#room').val();
            var day = $('#day').val();
            var time = $('#time').val();

            $('#fullname-val').text(fullname);
            $('#room-val').text(room);
            $('#day-val').text(day);
            $('#time-val').text(time);

            return true;
        }
    });
    $("#day").datepicker({
        dateFormat: "MM - DD - yy",
        showOn: "both",
        buttonText: '<i class="zmdi zmdi-chevron-down"></i>',
    });
});

function save_options() {

    mantis2TrelloOptions.trelloAPIKey = document.getElementById('trelloAPIKey').value;
    mantis2TrelloOptions.trelloToken = document.getElementById('trelloToken').value;
    mantis2TrelloOptions.trelloBoardId = document.getElementById('trelloBoardId').value;
    mantis2TrelloOptions.trelloColumnId = document.getElementById('trelloColumnId').value;

    let nametags = document.getElementsByClassName("tagName");
    let xpathtags = document.getElementsByClassName("tagXpath");
    let valuetags = document.getElementsByClassName("tagValue");

    let tags = [];

    for (let i = 0; i < nametags.length; i++) {
        tags.push({
            name: nametags[i].value,
            xpath: xpathtags[i].value,
            value: valuetags[i].value
        });
    }

    mantis2TrelloOptions.tags = tags;

    // Salvar a variável mantis2TrelloOptions em chrome.storage
    chrome.storage.sync.set({ 'mantis2TrelloOptions': mantis2TrelloOptions }, function() {
        console.log("Settings saved to chrome storage.");
    });

}



function add() {
    var tag = {
        name : document.getElementById("tagName").value,
        xpath : document.getElementById("tagXpath").value,
        value : document.getElementById("tagValue").value
    }

    addTag(tag);
}

function addTag(tag) {
    // Crie um elemento div com as classes especificadas
    var div = document.createElement("div");
    div.className = "form-check form-switch form-check";

    // Crie um elemento de input do tipo checkbox
    var input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "checkbox";
    input.id = "flexSwitchCheckReverse";

    // Crie um elemento de label com a classe e o atributo "for" especificados
    var label = document.createElement("label");
    label.className = "form-check-label";
    label.setAttribute("for", "flexSwitchCheckReverse");
    label.textContent = tag.name;

    var label_tagxpath = document.createElement("label");
    label_tagxpath.class = "tagXpath";
    label_tagxpath.setAttribute("hidden", "");
    label_tagxpath.setAttribute("type", "text");
    var label_tagvalue = document.createElement("label");
    label_tagvalue.class = "tagValue";
    label_tagvalue.setAttribute("hidden", "");
    label_tagvalue.setAttribute("type", "text");

    // Adicione o input e o label à div
    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(label_tagvalue);
    div.appendChild(label_tagxpath);


    // Adicione a div à div com ID "tagList"
    var conteudoAdicionado = document.getElementById("tagList");
    conteudoAdicionado.appendChild(div);
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default values.
    chrome.storage.sync.get(mantis2TrelloOptions, function (items) {
        document.getElementById('trelloAPIKey').value = mantis2TrelloOptions.trelloAPIKey;
        document.getElementById('trelloToken').value = mantis2TrelloOptions.trelloToken;
        document.getElementById('trelloBoardId').value = mantis2TrelloOptions.trelloBoardId;
        document.getElementById('trelloColumnId').value = mantis2TrelloOptions.trelloColumnId;
        items.tags.forEach(element => {
            addTag(element);
        });
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);