import $ from 'jquery';
import { parseCode } from './code-analyzer';
import { FunctionDeclaration, Loop, If, AssignmentExpression, VariableDeclarator, ReturnStatement } from './model';
import { isNumber } from 'util';

var data;
var table = { 'Rows': [] };

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        data = parsedCode;
        table = { 'Rows': [] };
        createObjectTable(data);
        drawTable(table.Rows);
    });
});

function isElseIf(obj) {
    if (obj.type === 'IfStatement')
        obj.type = 'Else If Statement';

}
function bodyType(obj) {
    if ('body' in obj && 'body' in obj.body)
        return 'body';
    else if ('alternate' in obj) {
        isElseIf(obj.alternate);
        return 'ifElse';
    }
    else if ('consequent' in obj)
        return 'if';
    return '';
}

function handleBody(obj) {
    switch (bodyType(obj)) {
        case 'body':
            createObjectTable(obj.body);
            break;
        case 'ifElse':
            createObjectTable([obj.consequent]);
            createObjectTable([obj.alternate]);
            break;
        case 'if':
            createObjectTable([obj.consequent]);
            break;
        default:
            break;
    }
}

function createObjectTable(obj) {
    if ('length' in obj) {
        for (var index = 0; index < obj.length; index++) {
            var newObj = ExtractElements(obj[index]);
            if (!isNumber(newObj)) {
                table.Rows.push({ 'obj': newObj });
                handleBody(obj[index]);
            }
        }
    }
    else {
        createObjectTable(obj.body);
    }
}

function ExtractElements(obj) {
    switch (obj.type) {
        case 'VariableDeclaration':
            for (var index = 0; index < obj.declarations.length; index++) {
                table.Rows.push({ 'obj': new VariableDeclarator(obj.declarations[index]) });
            }
            break;
        case 'ExpressionStatement':
            return ExtractElement(obj.expression);
        case 'ReturnStatement':
            return new ReturnStatement(obj);
        default:
            return ExtractElement(obj);
    }
    return 0;
}

function ExtractElement(obj) {
    var loopDic = ['WhileStatement', 'DoWhileStatement', 'ForStatement', 'ForOfStatement', 'ForInStatement'];
    var ifDic = ['IfStatement', 'Else If Statement'];
    switch (obj.type) {
        case 'FunctionDeclaration':
            return new FunctionDeclaration(obj);
        case 'AssignmentExpression':
            return new AssignmentExpression(obj);
        default:
            if (ifDic.indexOf(obj.type) >= 0)
                return new If(obj);
            if (loopDic.indexOf(obj.type) >= 0)
                return new Loop(obj);
            else
                return 0;
    }
}

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
function clearTable() {
    var table = document.getElementById('parsedTableBody');
    var length = table.rows.length;
    for (var index = 0; index < length; index++) {
        table.rows.splice(0,1);
    }
}
function drawTable(dataTable) {
    clearTable();
    var line = 1;
    for (var index = 0; index < dataTable.length; index++) {
        if (dataTable[index].obj.type === 'Function Declaration')
            addFuncDecRow(dataTable[index].obj, line);
        else {
            addObjRow(dataTable[index].obj, line);
            if (index + 1 < dataTable.length && dataTable[index + 1].obj.type === 'Variable Declarator')
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