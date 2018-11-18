import * as esprima from 'esprima';
import { FunctionDeclaration, Loop, If, AssignmentExpression, VariableDeclarator, ReturnStatement } from './model';
import { isNumber } from 'util';

var table;
var stopLine = false;
const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse);    
};

const objectTable = (parsedCode) => {
    table = { 'Rows': [] };
    createObjectTable(parsedCode);
    return table;
};

function isElseIf(obj) {
    if (obj !== null && obj.type === 'IfStatement'){
        obj.type = 'Else If Statement';
        return 'ifElse';
    }
    else if (obj!==null){
        return 'else';
    }
    else
        return 'if';

}
function bodyType(obj) {
    if (obj.hasOwnProperty('body'))
        return 'body';
    else if (obj.hasOwnProperty('alternate')) {
        return isElseIf(obj.alternate); 
    }
    return '';
}

function IfBody(obj)
{
    if (obj.type ==='BlockStatement')
        return obj;
    else
        return [obj];
}

function handleBody(obj) {
    switch (bodyType(obj)) {
    case 'body':
        createObjectTable(obj.body);
        break;
    case 'ifElse':
        createObjectTable(IfBody(obj.consequent));
        createObjectTable(IfBody(obj.alternate));
        break;
    case 'else':
        createObjectTable(IfBody(obj.alternate));
        break;
    case 'if':
        createObjectTable(IfBody(obj.consequent));
        break;
    default:
        break;
    }
}

function Contains(obj){
    var list = ['WhileStatement', 'ForStatement', 'ForInStatement', 'ForOfStatement', 'If Statement', 'Else If Statement'];
    if (list.indexOf(obj.type)>=0)
        return true;
    return false;
}

function isBelong(index)
{
    if (table.Rows.length > 0 && table.Rows[table.Rows.length-1].hasOwnProperty('belong') && index == 0)
        stopLine = true;
}

function addToTable(newObj, obj){
    if (stopLine)
        table.Rows.push({ 'obj': newObj, 'belong': true });
    else
        table.Rows.push({ 'obj': newObj });
    if (Contains(obj))
        stopLine = true;
}

export function createObjectTable(obj) {
    if (obj.hasOwnProperty('length')) {
        for (var index = 0; index < obj.length; index++) {
            isBelong(index);
            var newObj = ExtractElements(obj[index]);
            if (!isNumber(newObj)) {
                addToTable(newObj, obj[index], index);
                handleBody(obj[index]);
            }
        }
        stopLine = false;
    }
    else {
        createObjectTable(obj.body);
    }
}

function ExtractElements(obj) {
    switch (obj.type) {
    case 'VariableDeclaration':
        for (var index = 0; index < obj.declarations.length; index++)
            table.Rows.push({ 'obj': new VariableDeclarator(obj.declarations[index]) });
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

function isLoop(obj)
{
    var loopDic = ['WhileStatement', 'DoWhileStatement', 'ForStatement', 'ForOfStatement', 'ForInStatement'];
    if (loopDic.indexOf(obj.type) >= 0)
        return true;     
}

function isIf(obj)
{
    var ifDic = ['IfStatement', 'Else If Statement'];
    if (ifDic.indexOf(obj.type) >= 0)
        return true;
}

function ExtractElement(obj) {
    if (obj.type === 'FunctionDeclaration')
        return new FunctionDeclaration(obj);
    if (obj.type === 'AssignmentExpression')
        return new AssignmentExpression(obj);
    else 
        return ExtractSpecial(obj);
}

function ExtractSpecial(obj){
    if (isIf(obj))
        return new If(obj);
    if (isLoop(obj))
        return new Loop(obj);
    return 0;
}

export {parseCode, objectTable};
