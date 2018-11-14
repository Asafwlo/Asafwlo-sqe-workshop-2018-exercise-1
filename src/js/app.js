import $ from 'jquery';
import { parseCode } from './code-analyzer';

var data;
var functionDeclaration = ['id', 'params', 'body'];
var blockStatement = ['body'];


var functionDeclarationBody = ['BlockStatement'];
var param = ['type', 'name'];
var id = ['type', 'name'];

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        data = parsedCode;
        createTable();
    });
});

function isBodyExist(object) {
    for (var key in object) {
        if (key == 'body')
            return true;
    }
    return false;
}

function createRow(line, type, name, condition, value) {
    var newRow = document.createElement('tr');
    var lineCol = document.createElement('td');
    var typeCol = document.createElement('td');
    var nameCol = document.createElement('td');
    var condCol = document.createElement('td');
    var valCol = document.createElement('td');

    lineCol.innerHTML = line;
    typeCol.innerHTML = type;
    nameCol.innerHTML = name;
    condCol.innerHTML = condition;
    valCol.innerHTML = value;

    newRow.appendChild(lineCol);
    newRow.appendChild(typeCol);
    newRow.appendChild(nameCol);
    newRow.appendChild(condCol);
    newRow.appendChild(valCol);

    return newRow;

}

function createTable() {
    var row = 1;
    var tableBody = document.getElementById('parsedTableBody');
    var currentObj = data;
   
    do {
        currentObj = currentObj.body;
        var lineCol = row;
        var typeCol = currentObj.type;
        var nameCol = currentObj.id.name;
        var condCol = '';
        var valCol;
    }
    while (isBodyExist(currentObj));
    for (var key in parsedCode) {
        if (parsedCode.hasOwnProperty(key)) {
            var newRow = document.createElement('tr');
            var lineCol = document.createElement('td');
            var typeCol = document.createElement('td');
            var nameCol = document.createElement('td');
            var condCol = document.createElement('td');
            var valCol = document.createElement('td');
        }
    }
}

