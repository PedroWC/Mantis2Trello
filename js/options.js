// https://developer.chrome.com/docs/extensions/mv3/tut_analytics/
var mantis2TrelloOptions = {
    trelloAPIKey: '',
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
        transitionEffect: "slide", // Efeito de transição entre os passos
        enableAllSteps: true, // Habilita todos os passos
        autoFocus: true, // Foca automaticamente o primeiro campo de entrada
        transitionEffectSpeed: 500, // Velocidade do efeito de transição em milissegundos
        titleTemplate: '<div class="title">#title#</div>', // Template para o título de cada passo
        enableFinishButton: true,
        onFinished: save_options,
        labels: {
            next: 'Next', // Texto do botão para prosseguir ao próximo passo
            current: "current step:",
        }
    });
});



function addTag(tag) {
    var div = document.createElement("div");
    div.className = "form-check form-switch form-check";

    var input = document.createElement("input");
    input.className = "form-check-input ativo";
    input.type = "checkbox";
    input.id = "flexSwitchCheckReverse";

    var label_name = document.createElement("label");
    label_name.className = "form-check-label tagName";
    label_name.setAttribute("for", "flexSwitchCheckReverse");
    label_name.textContent = tag.name;
    
    var label_xpath = document.createElement("label");
    label_xpath.className = "tagXpath";
    label_xpath.setAttribute("hidden", "");
    label_xpath.setAttribute("type", "text");
    label_xpath.textContent = tag.xpath;
    
    var label_tagvalue = document.createElement("label");
    label_tagvalue.className = "tagValue";
    label_tagvalue.setAttribute("hidden", "");
    label_tagvalue.setAttribute("type", "text");
    label_tagvalue.textContent = tag.value;

    var label_tagId = document.createElement("label");
    label_tagId.className = "tagId";
    label_tagId.setAttribute("hidden", "");
    label_tagId.setAttribute("type", "text");
    label_tagId.textContent = tag.tagId;

    div.appendChild(input);
    div.appendChild(label_name);
    div.appendChild(label_xpath);
    div.appendChild(label_tagvalue);
    div.appendChild(label_tagId);


    var conteudoAdicionado = document.getElementById("tagList");
    conteudoAdicionado.appendChild(div);
}

function add() {
    var tag = {
        name: document.getElementById("tagName").value,
        xpath: document.getElementById("tagXpath").value,
        value: document.getElementById("tagValue").value,
        tagId: document.getElementById("tagId").value
    }

    addTag(tag);
}

function save_options() {

    mantis2TrelloOptions.trelloAPIKey = document.getElementById('trelloAPIKey').value;
    mantis2TrelloOptions.trelloBoardId = document.getElementById('trelloBoardId').value;
    mantis2TrelloOptions.trelloColumnId = document.getElementById('trelloColumnId').value;

    let ativo = document.getElementsByClassName("ativo");
    let nametags = document.getElementsByClassName("tagName");
    let xpathtags = document.getElementsByClassName("tagXpath");
    let valuetags = document.getElementsByClassName("tagValue");
    let tagIds = document.getElementsByClassName("tagId");

    let tags = [];

    for (let i = 0; i < nametags.length; i++) {
        if (ativo[i].checked){
            tags.push({
                name: nametags[i].value,
                xpath: xpathtags[i].value,
                value: valuetags[i].value,
                tagId: tagIds[i].value
            });
        }
    }

    mantis2TrelloOptions.tags = tags;

    // Salvar a variável mantis2TrelloOptions em chrome.storage
    chrome.storage.sync.set({ 'mantis2TrelloOptions': mantis2TrelloOptions }, function () {
        console.log("Settings saved to chrome storage.");
    });

    loadScript('https://www.googletagmanager.com/gtag/js?id=G-SNVFE94072', function() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-SNVFE94072');
    gtag('event', 'options_saved');
    });

    alert('Configurações salvas com sucesso!');
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    try {
    // Obtém a variável mantis2TrelloOptions do chrome.storage
        chrome.storage.sync.get('mantis2TrelloOptions', function (data) {
            let mantis2TrelloOptions = data.mantis2TrelloOptions;

            if (mantis2TrelloOptions) {
                // Restaura as opções nas caixas de texto correspondentes
                document.getElementById('trelloAPIKey').value = mantis2TrelloOptions.trelloAPIKey || "";
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
    } catch {
        console.log('Não existem dados salvos na sessão...')
    }
}


document.addEventListener('DOMContentLoaded', restore_options);