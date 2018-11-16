class id {
    constructor(type, name) {
        this.type = type;
        this.name = name;
    }
}

class params {
    constructor(objects) {
        this.objects = objects;
    }
}

class body {
    constructor() {
        if (new.target === body) {
            checkBodyType(new.target.type);
        }
    }
}



class Identifier extends body {
    constructor(type, name) {
        super();
        this.type = type;
        this.name = name;
    }
}

class Literal extends body {
    constructor(value, raw) {
        super();
        this.value = value;
        this.raw = raw;
    }
}

class Expression {
    constructor() {
        if (new.target === Expression) {
            checkExpressionType(new.target.type);
            //    throw new TypeError('Cannot construct Abstract instances directly');
        }
    }
}

function checkExpressionType(type) {
    switch (type) {
    case 'UnaryExpression':
        break;
    case 'BinaryExpression':
        break;
    case 'UpdateExpression':
        break;
    case 'AssignmentExpression':
        break;
    }
}

class right {
    constructor(type, value, raw) {
        if (arguments.length === 3) {
            this.type = type;
            this.value = value;
            this.raw = raw;
        }
        else {
            this.type = new Expression(type);
        }
    }
}

class left {
    constructor(type, name) {
        this.type = type;
        this.name = name;
    }
}

class UnaryExpression extends Expression {
    constructor(operator, argument, prefix) {
        super();
        this.operator = operator;
        this.argument = new Argument(argument);
        this.prefix = prefix;
    }
}


class BinaryExpression extends Expression {
    constructor(operator, left, right) {
        super();
        this.operator = operator;
        this.left = new left(left.type, left.name);
        this.right = new right(right.type, right.value, right.raw);
    }
}

class UpdateExpression extends Expression {
    constructor(operator, argument, prefix) {
        super();
        this.operator = operator;
        this.argument = new Argument(argument);
        this.prefix = prefix;
    }
}

class AssignmentExpression extends Expression {
    constructor(operator, left, right) {
        super();
        this.operator = operator;
        this.left = new left(left.type, left.name);
        this.right = new right(right.type, right.value, right.raw);
    }
}

class Argument extends body {
    constructor(argument) {
        super(argument);
    }
}

class Test extends body {
    constructor(test) {
        super(test);
    }
}

class ReturnStatement {
    constructor(argument) {
        this.argument = new Argument(argument);

    }
}

class ForStatement extends body {
    constructor(init, test, update, body) {
        super();
        this.init = new body(init);
        this.test = new Test(test);
        this.update = new Expression(update);
        this.body = new body(body);
    }
}

class WhileStatement extends body {
    constructor(test, body) {
        super();
        this.test = new Test(test);
        this.body = new body(body);
    }
}

class ExpressionStatement extends body {
    constructor(expression) {
        super();
        this.expression = new Expression();
    }
}

class VariableDeclarator extends body {
    constructor(id, init) {
        super();
        this.id = new id(id.type, id.name);
        this.init = init;
    }
}

class VariableDeclaration extends body {
    constructor(declarations, kind) {
        super();
        this.declarations = declarations;
        this.kind = kind;
    }
}

class BlockStatementBody extends body {
    constructor(listOfObjects) {
        super();
        this.listOfObjects = listOfObjects;
    }
}

class BlockStatement extends body {
    constructor(body) {
        super();
        this.body = new body(body);
    }
}

class FunctionDeclaration extends body {
    constructor(id, params, body, generator, expression, async) {
        super();
        this.id = new id(id.type, id.name);
        this.params = new params(params);
        this.body = new body(body);
        this.generator = generator;
        this.expression = expression;
        this.async = async;
    }
}