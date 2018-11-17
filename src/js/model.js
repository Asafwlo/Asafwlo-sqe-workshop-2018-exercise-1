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

export class VariableDeclarator{
    constructor(obj){
        this.type = 'Variable Declarator';
        this.name = obj.id.name;
    }
}

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
    if ('left' in obj.test)
    {
        return obj.test.left.name + obj.test.operator + obj.test.right.name;
    }
    else if (obj.test.id === null)
        return '';
    else
        return obj.test.id.name;

}
function setForStatement(obj)
{
    if (obj.init === null)
        var init = '';
    else
        init = obj.init.id.name;
    if (obj.test === null)
        var test = '';
    else
        test = obj.test.id.name;
    if (obj.update === null)
        var update = '';
    else
        update = obj.update.id.name;
    return init + ';' + test + ';' + update;
}
function setForInStatement(obj)
{
    return obj.left.id.name + ' - ' + obj.right.id.name;
}
function setForOfStatement(obj)
{
    return obj.left.id.name + ' in ' + obj.right.id.name;
}
function setWhileStatement(obj)
{

}
function getLoopCond(obj){
    var whiles = ['WhileStatement','DoWhileStatement'];
    var forIns = ['ForOfStatement','ForInStatement'];
    if (whiles.indexOf(obj.type) >= 0)
        return setDoWhileStatement(obj);
    else if (forIns.indexOf(obj.type) >= 0)
        return setForInStatement(obj);
    else if (obj.test === 'ForStatement')
        return setForStatement(obj);
}
export class Loop{
    constructor(obj){
        this.type = obj.type;
        this.condition = getLoopCond(obj);
        
    }
}

export class If{
    constructor(obj){
        if (obj.type === 'IfStatement')
            this.type = 'If Statement';
        else
            this.type = obj.type;
        if ('left' in obj.test)
        {
            if (obj.test.right.type === 'MemberExpression')
                this.condition = obj.test.left.name + obj.test.operator + obj.test.right.object.name+'['+obj.test.right.property.name+']';
            else
                this.condition = obj.test.left.name + obj.test.operator + obj.test.right.id.name;
        }
        else
        {
            this.condition = obj.test.id.name;
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
function ExtractArgument(obj){
    switch(obj.type){
    case 'UnaryExpression':
        return handleUnaryExpression(obj);
    case 'BinaryExpression':
        return handleBinaryExpression(obj);
    case 'LogicalExpression':
        return handleBinaryExpression(obj);
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

// class id {
//     constructor(type, name) {
//         this.type = type;
//         this.name = name;
//     }
// }

// class params {
//     constructor(objects) {
//         this.objects = objects;
//     }
// }

// class body {
//     constructor() {
//         if (new.target === body) {
//             checkBodyType(new.target.type);
//         }
//     }
// }



// class Identifier extends body {
//     constructor(type, name) {
//         super();
//         this.type = type;
//         this.name = name;
//     }
// }

// class Literal extends body {
//     constructor(value, raw) {
//         super();
//         this.value = value;
//         this.raw = raw;
//     }
// }

// class Expression {
//     constructor() {
//         if (new.target === Expression) {
//             checkExpressionType(new.target.type);
//             //    throw new TypeError('Cannot construct Abstract instances directly');
//         }
//     }
// }

// function checkExpressionType(type) {
//     switch (type) {
//     case 'UnaryExpression':
//         break;
//     case 'BinaryExpression':
//         break;
//     case 'UpdateExpression':
//         break;
//     case 'AssignmentExpression':
//         break;
//     }
// }

// class right {
//     constructor(type, value, raw) {
//         if (arguments.length === 3) {
//             this.type = type;
//             this.value = value;
//             this.raw = raw;
//         }
//         else {
//             this.type = new Expression(type);
//         }
//     }
// }

// class left {
//     constructor(type, name) {
//         this.type = type;
//         this.name = name;
//     }
// }

// class UnaryExpression extends Expression {
//     constructor(operator, argument, prefix) {
//         super();
//         this.operator = operator;
//         this.argument = new Argument(argument);
//         this.prefix = prefix;
//     }
// }


// class BinaryExpression extends Expression {
//     constructor(operator, left, right) {
//         super();
//         this.operator = operator;
//         this.left = new left(left.type, left.name);
//         this.right = new right(right.type, right.value, right.raw);
//     }
// }

// class UpdateExpression extends Expression {
//     constructor(operator, argument, prefix) {
//         super();
//         this.operator = operator;
//         this.argument = new Argument(argument);
//         this.prefix = prefix;
//     }
// }

// class AssignmentExpression extends Expression {
//     constructor(operator, left, right) {
//         super();
//         this.operator = operator;
//         this.left = new left(left.type, left.name);
//         this.right = new right(right.type, right.value, right.raw);
//     }
// }

// class Argument extends body {
//     constructor(argument) {
//         super(argument);
//     }
// }

// class Test extends body {
//     constructor(test) {
//         super(test);
//     }
// }

// class ReturnStatement {
//     constructor(argument) {
//         this.argument = new Argument(argument);

//     }
// }

// class ForStatement extends body {
//     constructor(init, test, update, body) {
//         super();
//         this.init = new body(init);
//         this.test = new Test(test);
//         this.update = new Expression(update);
//         this.body = new body(body);
//     }
// }

// class WhileStatement extends body {
//     constructor(test, body) {
//         super();
//         this.test = new Test(test);
//         this.body = new body(body);
//     }
// }

// class ExpressionStatement extends body {
//     constructor(expression) {
//         super();
//         this.expression = new Expression();
//     }
// }

// class VariableDeclarator extends body {
//     constructor(id, init) {
//         super();
//         this.id = new id(id.type, id.name);
//         this.init = init;
//     }
// }

// class VariableDeclaration extends body {
//     constructor(declarations, kind) {
//         super();
//         this.declarations = declarations;
//         this.kind = kind;
//     }
// }

// class BlockStatementBody extends body {
//     constructor(listOfObjects) {
//         super();
//         this.listOfObjects = listOfObjects;
//     }
// }

// class BlockStatement extends body {
//     constructor(body) {
//         super();
//         this.body = new body(body);
//     }
// }

// class FunctionDeclaration extends body {
//     constructor(id, params, body, generator, expression, async) {
//         super();
//         this.id = new id(id.type, id.name);
//         this.params = new params(params);
//         this.body = new body(body);
//         this.generator = generator;
//         this.expression = expression;
//         this.async = async;
//     }
// }