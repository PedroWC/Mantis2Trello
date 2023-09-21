// https://developer.chrome.com/docs/extensions/mv3/tut_analytics/

var mantis2TrelloOptions = {
    trelloAPIKey: '',
    trelloToken: '',
    trelloBoardId: '',
    trelloColumnId: '',
    tags: []
}

// Document Ready Function: executa quando todo o documento HTML foi completamente carregado.
$(function () {
    // Configura o plugin "steps" no formulário com id "form-total"
    $("#form-total").steps({
        headerTag: "h2", // Define a tag HTML para o cabeçalho de cada passo
        bodyTag: "section", // Define a tag HTML para o corpo de cada passo
        transitionEffect: "fade", // Efeito de transição entre os passos
        enableAllSteps: true, // Habilita todos os passos
        autoFocus: true, // Foca automaticamente o primeiro campo de entrada
        transitionEffectSpeed: 500, // Velocidade do efeito de transição em milissegundos
        titleTemplate: '<div class="title">#title#</div>', // Template para o título de cada passo
        labels: {
            previous: 'Back', // Texto do botão para voltar a um passo anterior
            next: 'Next', // Texto do botão para prosseguir ao próximo passo
            finish: 'Confirm', // Texto do botão para finalizar o formulário
            current: '' // Texto para o passo atual; vazio neste caso
        },
        // Função executada quando se tenta mudar de passo
        onStepChanging: function (event, currentIndex, newIndex) {
            // Concatena o primeiro e último nome para criar o nome completo
            var fullname = $('#first_name').val() + ' ' + $('#last_name').val();
            // Obtém o valor do campo "room"
            var room = $('#room').val();
            // Obtém o valor do campo "day"
            var day = $('#day').val();
            // Obtém o valor do campo "time"
            var time = $('#time').val();

            // Atualiza os elementos com os IDs correspondentes com os novos valores
            $('#fullname-val').text(fullname);
            $('#room-val').text(room);
            $('#day-val').text(day);
            $('#time-val').text(time);

            return true; // Permite a mudança de passo
        }
    });

    // Configura o datepicker no campo com id "day"
    $("#day").datepicker({
        dateFormat: "MM - DD - yy", // Formato da data
        showOn: "both", // Mostra o datepicker quando o campo de entrada ou o botão são clicados
        buttonText: '<i class="zmdi zmdi-chevron-down"></i>', // Texto (ícone, neste caso) para o botão do datepicker
    });
});



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

function add() {
    var tag = {
        name: document.getElementById("tagName").value,
        xpath: document.getElementById("tagXpath").value,
        value: document.getElementById("tagValue").value
    }

    addTag(tag);
}

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
    chrome.storage.sync.set({ 'mantis2TrelloOptions': mantis2TrelloOptions }, function () {
        console.log("Settings saved to chrome storage.");
    });

}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Obtém a variável mantis2TrelloOptions do chrome.storage
    chrome.storage.sync.get('mantis2TrelloOptions', function (data) {
        let mantis2TrelloOptions = data.mantis2TrelloOptions;

        if (mantis2TrelloOptions) {
            // Restaura as opções nas caixas de texto correspondentes
            document.getElementById('trelloAPIKey').value = mantis2TrelloOptions.trelloAPIKey || "";
            document.getElementById('trelloToken').value = mantis2TrelloOptions.trelloToken || "";
            document.getElementById('trelloBoardId').value = mantis2TrelloOptions.trelloBoardId || "";
            document.getElementById('trelloColumnId').value = mantis2TrelloOptions.trelloColumnId || "";

            // Restaurar as tags é um pouco mais complicado porque temos múltiplas
            if (Array.isArray(mantis2TrelloOptions.tags)) {
                mantis2TrelloOptions.tags.forEach(element => {
                    addTag(element);
                });
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);