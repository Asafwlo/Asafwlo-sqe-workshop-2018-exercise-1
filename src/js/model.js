export class FunctionDeclaration{
    constructor(obj){
        this.type = 'Function Declaration';
        if (obj.id === null)
            this.name = 'null';
        else
            this.name = obj.id.name;
        this.params = [];
        for (var index = 0; index < obj.params.length;index++)
            this.params.push(new Param(obj.params[index]));
    }
}

class Param{
    constructor(obj){
        this.type = obj.type;
        switch (obj.type){
        case 'AssignmentPattern':
            if (obj.right.id === null)
                this.name = obj.left.id.name + ' = null';
            else
                this.name = obj.left.id.name + ' = ' +  obj.right.id.name;
            break;
        case 'Identifier':
            this.name = obj.name;
            break;
        case 'BindingPattern':
            this.name = 'Binding Pattern was found in Param Model';
            break;
        }
    }
}

function setDeclaration(obj){
    if (obj.type === 'Literal')
        return obj.value;
    if (obj.type === 'Identifier')
        return obj.name;
    return ExtractArgument(obj);
}

export class VariableDeclarator{
    constructor(obj){
        this.type = 'Variable Declarator';
        this.name = obj.id.name;
        if (obj.hasOwnProperty('init') && obj.init != null)
            this.value = setDeclaration(obj.init);
    }
}

// export class ElseStatement{
//     constructor(obj){
//         this.type = 'Else Statement';
//         if (obj.left === null)
//             throw('Else Statement: Left side is null');
//         else
//             this.name = obj.left.name;
//         if (obj.right === null)
//             this.value = 'null';
//         else if (obj.right.type === 'Literal')
//             this.value = obj.right.value;
//         else if (obj.right.type === 'Identifier')
//             this.value = obj.right.name;
//         else
//             this.value = ExtractArgument(obj.right);
//     }
// }

export class AssignmentExpression{
    constructor(obj){
        this.type = 'Assignment Expression';
        if (obj.left === null)
            throw('Assignment Expression: Left side is null');
        else
            this.name = obj.left.name;
        if (obj.right === null)
            this.value = 'null';
        else if (obj.right.type === 'Literal')
            this.value = obj.right.value;
        else if (obj.right.type === 'Identifier')
            this.value = obj.right.name;
        else
            this.value = ExtractArgument(obj.right);
    }
}

function setDoWhileStatement(obj)
{
    if (obj.test.hasOwnProperty('left'))
    {
        return obj.test.left.name + obj.test.operator + obj.test.right.name;
    }
    else if (obj.test.type === 'Literal')
        return obj.test.value;
    else if (obj.test.type === 'Identifier')
        return obj.test.name;
    else
        throw 'Could not get setDoWhileStatement value';

}

function handleForProp(obj){
    if (obj.type === 'Literal')
        return obj.value;
    else if (obj.type === 'Identifier')
        return obj.name;
    else if (obj.type === 'VariableDeclaration'){
        var o = new VariableDeclarator(obj.declarations[0]); 
        return o.name + '=' + o.value;
    }
}


function setForStatement(obj)
{
    if (obj.init === null)
        var init = '';
    else
        init = handleForProp(obj.init);
    if (obj.test === null)
        var test = '';
    else
        test = ExtractArgument(obj.test);
    if (obj.update === null)
        var update = '';
    else
        update = ExtractArgument(obj.update);
    return init + ';' + test + ';' + update;
}
function setForInStatement(obj)
{
    return obj.left.name + ' in ' + obj.right.name;
}

function getLoopCond(obj){
    var whiles = ['WhileStatement','DoWhileStatement'];
    var forIns = ['ForOfStatement','ForInStatement'];
    if (whiles.indexOf(obj.type) >= 0)
        return setDoWhileStatement(obj);
    else if (forIns.indexOf(obj.type) >= 0)
        return setForInStatement(obj);
    else if (obj.type === 'ForStatement')
        return setForStatement(obj);
}
export class Loop{
    constructor(obj){
        this.type = obj.type;
        this.condition = getLoopCond(obj);
        
    }
}

function getIfType(type){
    if (type === 'IfStatement')
        return 'If Statement';
    else
        return type;
}

export class If{
    constructor(obj){
        this.type = getIfType(obj.type);
        if (obj.test.hasOwnProperty('left'))
        {
            if (obj.test.right.type === 'MemberExpression')
                this.condition = obj.test.left.name + obj.test.operator + obj.test.right.object.name+'['+obj.test.right.property.name+']';
            else
                this.condition = obj.test.left.name + obj.test.operator + obj.test.right.id.name;
        }
        else
        {
            if (obj.test.type === 'Literal')
                this.condition = obj.test.value;
            else if (obj.test.type === 'Identifier')
                this.condition = obj.test.name;
        }
    }
}


function handleUnaryExpression(obj){
    var ans = '';
    if (obj.prefix === true)
        ans = ans + obj.operator;
    if (obj.argument.type === 'Literal')
        ans = ans + obj.argument.value;
    else if (obj.argument.type === 'Identifier')
        ans = ans + obj.argument.name;
    else
        ans = ans + ExtractArgument(obj.argument);
    return ans;
}
function handleBinaryExpression(obj){
    var left = '', right = '';
    if (obj.left.type === 'Literal')
        left = obj.left.value;
    else if (obj.left.type === 'Identifier')
        left = obj.left.name;
    else
        left = ExtractArgument(obj.left);
    if (obj.right.type === 'Literal')
        right = obj.right.value;
    else if (obj.right.type === 'Identifier')
        right = obj.right.name;
    else
        right = ExtractArgument(obj.right);
    return left + obj.operator + right;
}

function handleUpdateExpression(obj){
    var ans = '';
    if (obj.argument.type === 'Literal')
        ans = ans + obj.argument.value;
    else if (obj.argument.type === 'Identifier')
        ans = ans + obj.argument.name;
    else
        ans = ans + ExtractArgument(obj.argument);
    if (obj.prefix === true)
        ans = obj.operator+ ans;
    else
        ans = ans + obj.operator;
    return ans;
}
function ExtractArgument(obj){
    switch(obj.type){
    case 'UnaryExpression':
        return handleUnaryExpression(obj);
    case 'BinaryExpression':
        return handleBinaryExpression(obj);
    case 'LogicalExpression':
        return handleBinaryExpression(obj);
    case 'UpdateExpression':
        return handleUpdateExpression(obj);
    }
}
export class ReturnStatement{
    constructor(obj){
        this.type = 'Return Statement';
        if (obj.argument === null)
            this.value = 'null';
        else if (obj.argument.type === 'Literal')
            this.value = obj.argument.value;
        else if (obj.argument.type === 'Identifier')
            this.value = obj.argument.name;
        else
            this.value = ExtractArgument(obj.argument);
    }
}