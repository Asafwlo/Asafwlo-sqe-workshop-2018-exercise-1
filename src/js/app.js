import $ from 'jquery';
import { parseCode, objectTable } from './code-analyzer';

var data;
var table;

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        try {
            let parsedCode = parseCode(codeToParse);
            $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
            data = parsedCode;
            table = objectTable(data);
            drawTable(table.Rows);
        }
        catch (error){
            throw new 'Invalid input.';
        }
    });
});



function addParam(param, line) {
    var row = createRow();
    row.cells[0].innerHTML = line;
    row.cells[1].innerHTML = 'Variable Declaration';
    row.cells[2].innerHTML = param.name;
    row.cells[3].innerHTML = '';
    row.cells[4].innerHTML = '';
    return row;
}

function addFuncDecRow(rowObj, line) {
    var table = document.getElementById('parsedTableBody');
    var row = createRow();
    row.cells[0].innerHTML = line;
    row.cells[1].innerHTML = rowObj.type;
    row.cells[2].innerHTML = rowObj.name;
    row.cells[3].innerHTML = '';
    row.cells[4].innerHTML = '';
    table.appendChild(row);
    for (var index = 0; index < rowObj.params.length; index++) {
        table.appendChild(addParam(rowObj.params[index], line));
    }
}

function addObjRow(rowObj, line) {
    var table = document.getElementById('parsedTableBody');
    var row = createRow();
    row.cells[2].innerHTML = '';
    row.cells[3].innerHTML = '';
    row.cells[4].innerHTML = '';

    row.cells[0].innerHTML = line;
    row.cells[1].innerHTML = rowObj.type;
    if ('name' in rowObj)
        row.cells[2].innerHTML = rowObj.name;
    if ('condition' in rowObj)
        row.cells[3].innerHTML = rowObj.condition;
    if ('value' in rowObj)
        row.cells[4].innerHTML = rowObj.value;
    table.appendChild(row);
}
export function clearTable() {
    var table = document.getElementById('parsedTableBody');
    var length = table.rows.length;
    for (var index = 0; index < length; index++) {
        var child = table.rows[0];
        table.removeChild(child);
    }
}

function dropLine(obj){
    if (obj.type === 'Variable Declarator' || obj.hasOwnProperty('belong'))
        return true;
    return false;

}
export function drawTable(dataTable) {
    clearTable();
    var line = 1;
    for (var index = 0; index < dataTable.length; index++) {
        if (dataTable[index].obj.type === 'Function Declaration')
            addFuncDecRow(dataTable[index].obj, line);
        else {
            addObjRow(dataTable[index].obj, line);
            if (index + 1 < dataTable.length && dropLine(dataTable[index + 1].obj))
                line--;
        }
        line++;
    }
}

function createRow() {
    var newRow = document.createElement('tr');
    var lineCol = document.createElement('td');
    var typeCol = document.createElement('td');
    var nameCol = document.createElement('td');
    var condCol = document.createElement('td');
    var valCol = document.createElement('td');

    newRow.appendChild(lineCol);
    newRow.appendChild(typeCol);
    newRow.appendChild(nameCol);
    newRow.appendChild(condCol);
    newRow.appendChild(valCol);

    return newRow;

}