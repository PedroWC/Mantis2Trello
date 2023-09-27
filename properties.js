var categoria = gx('/html/body/table[3]/tbody/tr[3]/td[2]');
var gravidade = gx('/html/body/table[3]/tbody/tr[3]/td[3]');
var frequencia = gx('/html/body/table[3]/tbody/tr[3]/td[4]');
var relator = gx('/html/body/table[3]/tbody/tr[5]/td[2]');
var visibilidade = gx('/html/body/table[3]/tbody/tr[5]/td[4]');
var prioridade = gx('/html/body/table[3]/tbody/tr[7]/td[2]');
var st = gx('/html/body/table[3]/tbody/tr[7]/td[2]');

var mantis_number = gx('/html/body/table[3]/tbody/tr[3]/td[1]');
var data_envio = gx('/html/body/table[3]/tbody/tr[3]/td[5]');
var resumo = gx('/html/body/table[3]/tbody/tr[10]/td[2]');
var desc = gx('/html/body/table[3]/tbody/tr[11]/td[2]');

var tags = { 
    Categoria : {
        valor : '',
        tag : '',
        switch : ''
    },    
    Gravidade : {
        valor : '',
        tag : '',
        switch : ''
    },    
    Frequencia : {
        valor : '',
        tag : '',
        switch : ''
    },  
    Visibilidade : {
        valor : '',
        tag : '',
        switch : ''
    },    
    Atribuido : {
        valor : '',
        tag : '',
        switch : ''
    },    
    Prioridade : {
        valor : '',
        tag : '',
        switch : ''
    }, 
    Status : {
        valor : '',
        tag : '',
        switch : ''
    }
}