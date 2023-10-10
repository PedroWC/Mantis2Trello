let mantis2TrelloOptions = {
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
    document.getElementById("criaCard").addEventListener('click', criarCard);
    restore_options();
    // document.addEventListener('DOMContentLoaded', restore_options);
});

function removeCardOnClick(event) {
    // Obtém o card mais próximo (elemento pai)
    let card = event.target.closest('.closeCard');

    // Verifica se um card foi encontrado
    if (card) {
        // Remove o card do DOM
        card.parentElement.removeChild(card);
    }
}

function criarCard(values = {titulo: '', valor: '', tag: '', switchStatus: false}) {
        if (!values.titulo) {
        values.titulo = document.getElementById("inputGroupSelect03").value;

        if (values.titulo === "Escolha...") {
            return;
        }
    }

    let num = (document.getElementsByClassName("card").length + 1).toString();

    // Criação do elemento principal <div class="col closeCard">
    const divCol = document.createElement('div');
    divCol.className = "col closeCard";

    // Criação do elemento <div class="card">
    const divCard = document.createElement('div');
    divCard.className = "card";
    divCard.id = "cardNum" + num;

    const butsvg = document.createElement("div");
    butsvg.type = "button";
    butsvg.className = "close-icon";

    // Crie o elemento SVG
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('height', '1em');
    svg.setAttribute('viewBox', '0 0 384 512');

    // Crie o elemento PATH para o SVG
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z');

    // Adicione o elemento PATH ao SVG
    svg.appendChild(path);

    // Criação do elemento <div class="card-body">
    const divCardBody = document.createElement('div');
    divCardBody.className = "card-body";

    // Criação do elemento <h5 class="card-title">Status</h5>
    const h5 = document.createElement('h5');
    h5.className = "card-title";
    h5.textContent = values.titulo;

    // Criação dos grupos de input
    const createInputGroup = (labelText, value) => {
        const divInputGroup = document.createElement('div');
        divInputGroup.className = "input-group mb-3";

        const span = document.createElement('span');
        span.className = "input-group-text discreetEdge spanCard";
        span.textContent = labelText;

        const input = document.createElement('input');
        input.type = "text";
        input.className = "form-control discreetEdge inputCard" + labelText;
        input.className += " form-itens";
        input.setAttribute("aria-describedby", "basic-addon3");
        input.value = value;

        divInputGroup.appendChild(span);
        divInputGroup.appendChild(input);

        return divInputGroup;
    };

    const divInputGroupValor = createInputGroup("Valor", values.valor);
    const divInputGroupTag = createInputGroup("Tag", values.tag);

    // Criação do switchStatus
    const divFormSwitch = document.createElement('div');
    divFormSwitch.className = "form-check form-switch";

    const inputSwitch = document.createElement('input');
    inputSwitch.className = "form-check-input inputCardSwicth";
    inputSwitch.type = "checkbox";
    inputSwitch.setAttribute("role", "switchStatus");
    inputSwitch.checked = values.switchStatus;

    divFormSwitch.appendChild(inputSwitch);

    // Adicionando todos os elementos ao card body
    divCardBody.appendChild(h5);
    divCardBody.appendChild(divInputGroupValor);
    divCardBody.appendChild(divInputGroupTag);
    divCardBody.appendChild(divFormSwitch);

    butsvg.appendChild(svg);
    divCard.appendChild(butsvg);

    // Adicionando o card body ao card
    divCard.appendChild(divCardBody);

    // Adicionando o card à coluna principal
    divCol.appendChild(divCard);

    document.getElementById("cardsContainer").appendChild(divCol);

    // Adiciona um evento de clique em todas as divs com classe close-icon
    let closeIcons = document.querySelectorAll('.close-icon');
    for (let i = 0; i < closeIcons.length; i++) {
        closeIcons[i].addEventListener('click', removeCardOnClick);
    }
}

function save_options() {

    // Seleciona todos os cards dentro do container
    let cards = document.querySelectorAll('#cardsContainer .card');

    mantis2TrelloOptions.trelloAPIKey = document.getElementById("trelloAPIKey").value;
    mantis2TrelloOptions.trelloBoardId = document.getElementById("trelloBoardId").value;
    mantis2TrelloOptions.trelloColumnId = document.getElementById("trelloColumnId").value;

    // Lista que armazenará os valores dos inputs de cada card
    let tags = [];

    // Percorre cada card e obtém os valores dos inputs
    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];

        // Obtém o valor do titulo com a classe card-title
        let title = card.querySelector('.card-title').textContent;

        // Obtém o valor do input com a classe inputCardValor
        let valor = card.querySelector('.inputCardValor').value;

        // Obtém o valor do input com a classe inputCardTag
        let tag = card.querySelector('.inputCardTag').value;

        // Verifica o status do checkbox
        let switchStatus = card.querySelector('.inputCardSwicth').checked;

        // Adiciona os valores na lista
        tags.push({
            titulo: title,
            valor: valor,
            tag: tag,
            switchStatus: switchStatus
        });
    }

    mantis2TrelloOptions.tags = tags;

    // Salvar a variável mantis2TrelloOptions em chrome.storage
    chrome.storage.sync.set({'mantis2TrelloOptions': mantis2TrelloOptions}, function () {
        console.log("Configurações salvas no armazenamento do Chrome.");
    });

    alert('Configurações salvas com sucesso!');

    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', 'G-SNVFE94072');
    gtag('event', 'options_saved');
}

function restore_options() {
    try {
        // Buscar a variável mantis2TrelloOptions em chrome.storage
        chrome.storage.sync.get('mantis2TrelloOptions', function (data) {
            let mantis2TrelloOptions = data.mantis2TrelloOptions;

            if (mantis2TrelloOptions) {
                document.getElementById('trelloAPIKey').value = mantis2TrelloOptions.trelloAPIKey;
                document.getElementById('trelloBoardId').value = mantis2TrelloOptions.trelloBoardId;
                document.getElementById('trelloColumnId').value = mantis2TrelloOptions.trelloColumnId;

                let tags = mantis2TrelloOptions.tags;
                if (tags.length) {
                    for (let i = 0; i < tags.length; i++) {
                        let tag = tags[i];
                        criarCard({
                            titulo: tag.titulo,
                            valor: tag.valor,
                            tag: tag.tag,
                            switchStatus: tag.switchStatus
                        });
                    }

                } else {
                    console.log("Não existem filtros de tags salvos.");
                }

            console.log('Dados recuperados da sessão...');
            } else {
                console.log('Não existem dados válidos salvos na sessão...');
            }
        });
    } catch {
        console.log('Não existem dados válidos salvos na sessão...');
    }
}