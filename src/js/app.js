import $ from 'jquery';
import { parseCode } from './code-analyzer';
import './model';

var data;
var table = { 'Rows': [] };
var treeTable = { 'tree': [] };

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

// function checkBodyType(type) {
//     switch (type) {
//         case 'FunctionDeclaration':
//             return 'FunctionDeclaration';
//             break;
//         case 'BlockStatement':
//             break;
//         case 'VariableDeclaration':
//             break;
//         case 'BlockStatementBody':
//             break;
//         case 'VariableDeclarator':
//             break;
//         case 'ExpressionStatement':
//             break;
//         case 'WhileStatement':
//             break;
//         case 'ForStatement':
//             break;
//         case 'Test':
//             break;
//         case 'Argument':
//             break;
//         case 'Identifier':
//             break;
//         case 'Literal':
//             break;
//     }
// }

function createTable() {
    var row = 1;
    var tableBody = document.getElementById('parsedTableBody');
    var currentObj = data;
    do {
        currentObj = currentObj.body;
        var lineCol = row;
        var typeCol = currentObj.type;
        var nameCol = checkName(currentObj);
        var condCol = checkCond(currentObj);
        var valCol = checkVal(currentObj);
        row++;
    }
    while (isBodyExist(currentObj));
    for (var key in currentObj) {
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

function checkName(obj) {
    switch (obj.type) {
        case 'FunctionDeclaration':
            return obj.id.name;
        case 'id':
            return obj.name;
        case 'Identifier':
            return obj.name;
        case 'left':
            return obj.name;
        default:
            return '';
    }
}

function checkVal(obj) {
    switch (obj.type) {
        case 'Literal':
            return obj.value;
        case 'right':
            return obj.name;
        case 'Identifier':
            return obj.name;
        case 'left':
            return obj.name;
        default:
            return '';
    }
}

function checkCond(obj) {
    switch (obj.type) {
        case 'BinaryExpression':
            return obj.left.name + obj.operator + getRight(obj.right);
        case 'id':
            return obj.name;
        case 'Identifier':
            return obj.name;
        case 'left':
            return obj.name;
        default:
            return '';
    }
}

function getRight(right) {
    if (right.length === 3)
        return right.value;
    else
        return '(' + checkCond(right.type) + ')';
}

function handleBindingPattern(obj) {
    var ans = [];
    for (var index = 0; index < obj.length; ++index) {
        switch (obj[index].type) {
            case 'ArrayPattern':
                ans.push(handleArrayPattern(obj[index]));
                break;
            case 'ObjectPattern':
                ans.push(handleObjectPattern(obj[index]));
                break;
        }
    }
    return ans;
}

function handleArrayPatternElement(obj) {
    var ans = [];
    for (var index = 0; index < obj.length; ++index) {
        switch (obj.type) {
            case 'AssignmentPattern':
            ans.push(handleAssignmentPattern(obj[index]));
            break;
            case 'Identifier':
            ans.push(handleIdentifier(obj[index]));
            break;
            case 'BindingPattern':
            ans.push(handleBindingPattern(obj[index]));
            break;
            case 'RestElement':
            ans.push(handleRestElement(obj[index]));
            break;
            default:
            ans.push(null);
            break;
        }
    }
    return ans;
}

function handleArrayPattern(obj) {
    return handleArrayPatternElement(obj.elements);
}

function handleObjectPattern(obj) {
    return handleProperty(obj.properties);
}

function handleProperty(obj) {
    var ans = [];
    for (var index = 0; index < obj.length; ++index) {
        switch (obj[index].value) {
            case null:
                ans.push(null);
                break;
            default:
                ans.push(handleExpression(obj[index]));
                break;
        }
    }
    return ans;
}

function handleExpression(obj){
    switch(obj.type){
        case 'ThisExpression':
        return handleThisExpression(obj);
        case 'Identifier':
        return handleIdentifier(obj);
        case 'Literal':
        return handleLiteral(obj);
        case 'ArrayExpression':
        return handleArrayExpression(obj);
        case 'ObjectExpression':
        return handleObjectExpression(obj);
        case 'FunctionExpression':
        return handleFunctionExpression(obj);
        case 'ArrowFunctionExpression':
        return handleArrowFunctionExpression(obj);
        case 'ClassExpression':
        return handleClassExpression(obj);
        case 'TaggedTemplateExpression':
        return handleTaggedTemplateExpression(obj);
        case 'MemberExpression':
        return handleMemberExpression(obj);
        case 'Super':
        return handleSuper(obj);
        case 'MetaProperty':
        return handleMetaProperty(obj);
        case 'NewExpression':
        return handleNewExpression(obj);
        case 'CallExpression':
        return handleCallExpression(obj);
        case 'UpdateExpression':
        return handleUpdateExpression(obj);
        case 'AwaitExpression':
        return handleAwaitExpression(obj);
        case 'UnaryExpression':
        return handleUnaryExpression(obj);
        case 'BinaryExpression':
        return handleBinaryExpression(obj);
        case 'LogicalExpression':
        return handleLogicalExpression(obj);
        case 'ConditionalExpression':
        return handleConditionalExpression(obj);
        case 'YieldExpression':
        return handleYieldExpression(obj);
        case 'AssignmentExpression':
        return handleAssignmentExpression(obj);
        case 'SequenceExpression':
        return handleSequenceExpression(obj);
    }
}

function handleThisExpression(obj) {
    return [{'Type':obj.type, 'Name':'', 'Condition': '', 'Value':''}];
}


function handleIdentifier(obj) {
    return obj.name;
}

function handleLiteral(obj) {
    return obj.value;
}

function handleArrayExpression(obj) {
    return handleArrayExpressionElement(obj);
}

function handleArrayExpressionElement(obj) {
    var ans = [];
    for (var index = 0; index < obj.length; ++index) {
        switch (obj[index].type) {
            case 'SpreadElement':
                ans.push(handleSpreadElement(obj[index]));
                break;
            default:
                ans.push(handleExpression(obj[index]));
                break;
        }
    }
    return ans;
}

function handleObjectExpression(obj) {
    return handleProperty(obj.properties);
}

function handleFunctionExpression(obj) {
    var ans = [];
    ans.push([{'Type': obj.type, 'Name': handleIdentifier(obj.id), 'Condition': '', 'Value':''}]);
    ans.push(handleFunctionParameter(obj.params));
    ans.push(handleBlockStatement(obj.body));
    return ans;
}

function handleFunctionParameter(obj) {
    var ans = [];
    for (var index = 0; index < obj.length; ++index) {
        switch (obj[index].type) {
            case 'AssignmentPattern':
                ans.push(handleAssignmentPattern(obj[index]));
                break;
                case 'Identifier':
                ans.push(handleIdentifier(obj[index]));
                break;
                case 'BindingPattern':
                ans.push(handleBindingPattern(obj[index]));
                break;
        }
    }
    return ans;
}

function handleArrowFunctionExpression(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':handleIdentifier(obj.id), 'Condition':'', 'Value':''}]);
    ans.push(handleFunctionParameter(obj.params));
    switch(obj.body.type){
        case 'BlockStatement':
        ans.push(handleBlockStatement(obj.body));
        break;
        default:
        ans.push(handleExpression(obj.body));
        break;
    }
    return ans;
}

function handleClassExpression(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':handleIdentifier(obj.id), 'Condition':'', 'Value':''}]);
    ans.push(handleClassBody(obj.body));
    return ans;
}

function handleTaggedTemplateExpression(obj) {

}

function handlctMemberExpression(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':'', 'Condition':'', 'Value':''}]);
    ans.push(handleExpression(obj.object));
    ans.push(handleExpression(obj.property));
    return ans;
}

function handleSuper(obj) {
    return [{'Type':obj.type, 'Name':'', 'Condition':'', 'Value':''}];
}

function handleMetaProperty(obj) {

}
function handleNewExpression(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':'', 'Condition':'', 'Value':''}]);
    ans.push(handleExpression(obj.callee));
    ans.push(handleArgumentListElement(obj.arguments));
    return ans;
}
function handleCallExpression(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':'', 'Condition':'', 'Value':''}]);
    ans.push(handleExpression(obj.callee));
    ans.push(handleArgumentListElement(obj.arguments));
    return ans;
}
function handleUpdateExpression(obj) {
    return [{'Type':obj.type, 'Name':obj.operator, 'Condition':'', 'Value':handleExpression(obj.argument)}];
}
function handleAwaitExpression(obj) {
    return [{'Type':obj.type, 'Name':handleExpression(obj.argument), 'Condition':'', 'Value':''}];
}
function handleUnaryExpression(obj) {
    return [{'Type':obj.type, 'Name':obj.operator, 'Condition':'', 'Value':handleExpression(obj.argument)}];
}
function handleBinaryExpression(obj) {
    return [{'Type':obj.type, 'Name':handleExpression(obj.left), 'Condition':'', 'Value':handleExpression(obj.right)}];
}
function handleLogicalExpression(obj) {
    return [{'Type':obj.type, 'Name':handleExpression(obj.left), 'Condition':'', 'Value':handleExpression(obj.right)}];
}
function handleConditionalExpression(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':'', 'Condition':handleExpression(obj.test), 'Value':''}]);
    ans.push(handleExpression(obj.consequent));
    ans.push(handleArgumentListElement(obj.alternate));
    return ans;
}
function handleYieldExpression(obj) {
    if (obj.argument === null)
        return [{'Type':obj.type,'Name':handleExpression(obj.argument),'Condition':'', 'Value':''}];
    else
        return [{'Type':obj.type,'Name':'null','Condition':'', 'Value':''}];
}
function handleAssignmentExpression(obj) {
    return [{'Type':obj.type, 'Name':handleExpression(obj.left), 'Condition':'', 'Value':handleExpression(obj.right)}];
}
function handleSequenceExpression(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':'', 'Condition':'', 'Value':''}]);
    for (var index = 0; index < obj.expressions.length; ++index) {
        ans.push(handleExpression(obj.expressions[index]));
    }
    return ans;
}
function handleAssignmentPattern(obj) {
    switch(obj.left.type){
        case 'Identifier':
        return [{'Type':obj.type, 'Name':handleIdentifier(obj.left), 'Condition':'', 'Value':handleExpression(obj.right)}]; 
        default:
        return [{'Type':obj.type, 'Name':handleBindingPattern(obj.left), 'Condition':'', 'Value':handleExpression(obj.right)}];
    }
    
}
function handleRestElement(obj) {
    switch(obj.argument.type){
        case 'Identifier':
        return [{'Type':obj.type, 'Name':handleIdentifier(obj.argument), 'Condition':'', 'Value':''}]; 
        default:
        return [{'Type':obj.type, 'Name':handleBindingPattern(obj.argument), 'Condition':'', 'Value':''}];
    }
}
function handleSpreadElement(obj) {
    return [{'Type':obj.type, 'Name':handleExpression(obj.argument), 'Condition':'', 'Value':''}];
}
function handleBlockStatement(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':'', 'Condition':'', 'Value':''}]);
    ans.push(handleStatementListItem(obj.body));
    return ans;
}

function handleTemplateLiteral(obj) {

}
function handleTemplateElement(obj) {

}
function handleArgumentListElement(obj) {
    var ans = [];
    for (var index = 0; index < obj.length; ++index) {
        switch (obj[index].type) {
            case 'Expression':
                ans.push(handleExpression(obj[index]));
                break;
            case 'SpreadElement':
                ans.push(handleSpreadElement(obj[index]));
                break;
        }
    }
    return ans;
}
function handleBreakStatement(obj) {
    return [{'Type':obj.type, 'Name':handleIdentifier(obj.label), 'Condition':'', 'Value':''}];
}
function handleContinueStatement(obj) {
    return [{'Type':obj.type, 'Name':handleIdentifier(obj.label), 'Condition':'', 'Value':''}];
}
function handleDebuggerStatement(obj) {
    return [{'Type':obj.type, 'Name':'', 'Condition':'', 'Value':''}];
}
function handleDoWhileStatement(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':'', 'Condition':handleExpression(obj.test), 'Value':''}]);
    ans.push(handleStatement(obj.body));
    return ans;
}

function handleStatement(obj){
    switch(obj.type){
        case 'BlockStatement':
        return handleBlockStatement(obj);
        case 'BreakStatement':
        return handleBreakStatement(obj);
        case 'ContinueStatement':
        return handleContinueStatement(obj);
        case 'DebuggerStatement':
        return handleDebuggerStatement(obj);
        case 'DoWhileStatement':
        return handleDoWhileStatement(obj);
        case 'EmptyStatement':
        return handleEmptyStatement(obj);
        case 'ExpressionStatement':
        return handleExpressionStatement(obj);
        case 'ForStatement':
        return handleForStatement(obj);
        case 'ForInStatement':
        return handleForInStatement(obj);
        case 'ForOfStatement':
        return handleForOfStatement(obj);
        case 'IfStatement':
        return handleIfStatement(obj);
        case 'LabeledStatement':
        return handleLabeledStatement(obj);
        case 'ReturnStatement':
        return handleReturnStatement(obj);
        case 'SwitchStatement':
        return handleSwitchStatement(obj);
        case 'ThrowStatement':
        return handleThrowStatement(obj);
        case 'TryStatement':
        return handleTryStatement(obj);
        case 'VariableDeclaration':
        return handleVariableDeclaration(obj);
        case 'WhileStatement':
        return handleWhileStatement(obj);
        case 'WithStatement':
        return handleWithStatement(obj);
    }
}

function handleEmptyStatement(obj) {
    return [{'Type':obj.type, 'Name':'', 'Condition':'', 'Value':''}];
}
function handleExpressionStatement(obj) {
    return [{'Type':obj.type, 'Name':handleExpression(obj.expression), 'Condition':'', 'Value':''}];
}
function handleForStatement(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':'', 'Condition':handleExpression(obj.test), 'Value':''}]);
    ans.push(handleStatement(obj.body));
    return ans;

}
function handleForInStatement(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':'', 'Condition':'', 'Value':handleExpression(obj.right)}]);
    ans.push(handleStatement(obj.body));
    return ans;
}
function handleForOfStatement(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':'', 'Condition':'', 'Value':handleExpression(obj.right)}]);
    ans.push(handleStatement(obj.body));
    return ans;
}
function handleFunctionDeclaration(obj) {
    var ans = [];
    switch(obj.id){
        case null:
        ans.push([{'Type':obj.type, 'Name':'null', 'Condition':'', 'Value':''}]);
        break; 
        default:
        ans.push([{'Type':obj.type, 'Name':handleIdentifier(obj.id), 'Condition':'', 'Value':''}]);
    }
    ans.push(handleBlockStatement(obj.body));
    return ans;
}
function handleIfStatement(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':'', 'Condition':handleExpression(obj.test), 'Value':''}]);
    ans.push(handleStatement(obj.consequent));
    if (obj.hasOwnProperty('alternate'))
        ans.push(handleStatement(obj.alternate));
    return ans;
}
function handleLabeledStatement(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':handleIdentifier(obj.label), 'Condition':'', 'Value':''}]);
    ans.push(handleStatement(obj.body));
    return ans;
}
function handleReturnStatement(obj) {
    switch(obj.argument){
        case null:
        return [{'Type':obj.type, 'Name':'null', 'Condition':'', 'Value':''}];
        default:
        return [{'Type':obj.type, 'Name':'', 'Condition':'', 'Value':handleExpression(obj.argument)}];
    }
}
function handleSwitchStatement(obj) {
    var ans = [];
    ans.push([{'Type':obj.type, 'Name':'', 'Condition':handleExpression(obj.discriminant), 'Value':''}]);
    ans.push(handleSwitchCase(obj.cases));
    return ans;
}
function handleThrowStatement(obj) {

}
function handleTryStatement(obj) {

}
function handleVariableDeclaration(obj) {

}
function handleWhileStatement(obj) {

}
function handleWithStatement(obj) {

}
function handleStatementListItem(obj) {

}
function handleClassBody(obj) {

}
function handleSwitchCase(obj) {
    for (var index = 0; index < obj.length; ++index) {
        switch (obj[index].test) {
            case null:
                ans.push(handleExpression(obj[index]));
                break;
            case 'SpreadElement':
                ans.push(handleSpreadElement(obj[index]));
                break;
        }
    }
    return ans;
}
function handleCatchClause(obj) {

}
function handleVariableDeclarator(obj) {

}
