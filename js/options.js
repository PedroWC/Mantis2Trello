var mantis2TrelloOptions = {
    trelloAPIKey: '',
    trelloBoardId: '',
    trelloColumnId: '',
    tags: {}
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


function save_options() {

    mantis2TrelloOptions.trelloAPIKey = document.getElementById('trelloAPIKey').value;
    mantis2TrelloOptions.trelloBoardId = document.getElementById('trelloBoardId').value;
    mantis2TrelloOptions.trelloColumnId = document.getElementById('trelloColumnId').value;

    var tags = {
        Categoria: {
            valor: document.getElementById('valorCategoria').value,
            tag: document.getElementById('tagCategoria').value,
            switch: document.getElementById('switchCategoria').checked
        },
        Gravidade: {
            valor: document.getElementById('valorGravidade').value,
            tag: document.getElementById('tagGravidade').value,
            switch: document.getElementById('switchGravidade').checked
        },
        Frequencia: {
            valor: document.getElementById('valorFrequencia').value,
            tag: document.getElementById('tagFrequencia').value,
            switch: document.getElementById('switchFrequencia').checked
        },
        Relator: {
            valor: document.getElementById('valorRelator').value,
            tag: document.getElementById('tagRelator').value,
            switch: document.getElementById('switchRelator').checked
        },
        Visibilidade: {
            valor: document.getElementById('valorVisibilidade').value,
            tag: document.getElementById('tagVisibilidade').value,
            switch: document.getElementById('switchVisibilidade').checked
        },
        Prioridade: {
            valor: document.getElementById('valorPrioridade').value,
            tag: document.getElementById('tagPrioridade').value,
            switch: document.getElementById('switchPrioridade').checked
        },
        Status: {
            valor: document.getElementById('valorStatus').value,
            tag: document.getElementById('tagStatus').value,
            switch: document.getElementById('switchStatus').checked
        }
    }

    mantis2TrelloOptions.tags = tags;

    // Salvar a variável mantis2TrelloOptions em chrome.storage
    chrome.storage.sync.set({'mantis2TrelloOptions': mantis2TrelloOptions}, function () {
        console.log("Settings saved to chrome storage.");
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
            var mantis2TrelloOptions = data.mantis2TrelloOptions;

            if (mantis2TrelloOptions) {
                document.getElementById('trelloAPIKey').value = mantis2TrelloOptions.trelloAPIKey;
                document.getElementById('trelloBoardId').value = mantis2TrelloOptions.trelloBoardId;
                document.getElementById('trelloColumnId').value = mantis2TrelloOptions.trelloColumnId;

                var tags = mantis2TrelloOptions.tags;
                if (tags) {
                    // Categoria
                    document.getElementById('valorCategoria').value = tags.Categoria.valor;
                    document.getElementById('tagCategoria').value = tags.Categoria.tag;
                    document.getElementById('switchCategoria').checked = tags.Categoria.switch;
                    // Gravidade
                    document.getElementById('valorGravidade').value = tags.Gravidade.valor;
                    document.getElementById('tagGravidade').value = tags.Gravidade.tag;
                    document.getElementById('switchGravidade').checked = tags.Gravidade.switch;
                    // Frequencia
                    document.getElementById('valorFrequencia').value = tags.Frequencia.valor;
                    document.getElementById('tagFrequencia').value = tags.Frequencia.tag;
                    document.getElementById('switchFrequencia').checked = tags.Frequencia.switch;
                    // Relator
                    document.getElementById('valorRelator').value = tags.Relator.valor;
                    document.getElementById('tagRelator').value = tags.Relator.tag;
                    document.getElementById('switchRelator').checked = tags.Relator.switch;
                    // Visibilidade
                    document.getElementById('valorVisibilidade').value = tags.Visibilidade.valor;
                    document.getElementById('tagVisibilidade').value = tags.Visibilidade.tag;
                    document.getElementById('switchVisibilidade').checked = tags.Visibilidade.switch;
                    // Prioridade
                    document.getElementById('valorPrioridade').value = tags.Prioridade.valor;
                    document.getElementById('tagPrioridade').value = tags.Prioridade.tag;
                    document.getElementById('switchPrioridade').checked = tags.Prioridade.switch;
                    // Status
                    document.getElementById('valorStatus').value = tags.Status.valor;
                    document.getElementById('tagStatus').value = tags.Status.tag;
                    document.getElementById('switchStatus').checked = tags.Status.switch;

                }
            }
        });
    } catch {
        console.log('Não existem dados salvos na sessão...');
    }
}


function criarCard(categoria) {

    const cat = document.getElementById("inputGroupSelect03").value;

    let num = (document.getElementsByClassName("card").length + 1).toString();

    // Criação do elemento principal <div class="col">
    const divCol = document.createElement('div');
    divCol.className = "col";

    // Criação do elemento <div class="card">
    const divCard = document.createElement('div');
    divCard.className = "card";
    divCard.id = "cardNum" + num;

    const butsvg = document.createElement("div");
    butsvg.type = "button";
    butsvg.onclick = click("cardNum" + num);
    butsvg.className = "close-icon";

    // Crie o elemento SVG
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('height', '1em');
    svg.setAttribute('viewBox', '0 0 384 512');

    // Crie o elemento PATH para o SVG
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z');

    // Adicione o elemento PATH ao SVG
    svg.appendChild(path);

    // Criação do elemento <div class="card-body">
    const divCardBody = document.createElement('div');
    divCardBody.className = "card-body";

    // Criação do elemento <h5 class="card-title">Status</h5>
    const h5 = document.createElement('h5');
    h5.className = "card-title";
    h5.textContent = cat;

    // Criação dos grupos de input
    const createInputGroup = (id, labelText) => {
        const divInputGroup = document.createElement('div');
        divInputGroup.className = "input-group mb-3";

        const span = document.createElement('span');
        span.className = "input-group-text discreetEdge spanCard";
        span.textContent = labelText;

        const input = document.createElement('input');
        input.id = id;
        input.type = "text";
        input.className = "form-control discreetEdge inputCard";
        input.setAttribute("aria-describedby", "basic-addon3");

        divInputGroup.appendChild(span);
        divInputGroup.appendChild(input);

        return divInputGroup;
    };

    const divInputGroupValor = createInputGroup("valor" + categoria, "Valor");
    const divInputGroupTag = createInputGroup("tag" + categoria, "Tag");

    // Criação do switch
    const divFormSwitch = document.createElement('div');
    divFormSwitch.className = "form-check form-switch";

    const inputSwitch = document.createElement('input');
    inputSwitch.id = "switch" + categoria;
    inputSwitch.className = "form-check-input";
    inputSwitch.type = "checkbox";
    inputSwitch.setAttribute("role", "switch");

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
}

function click (cardNum) {
    console.log(cardNum);
    // document.getElementById(cardNum).remove();
}


document.addEventListener('DOMContentLoaded', restore_options);