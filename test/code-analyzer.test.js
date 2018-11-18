import assert from 'assert';
import {parseCode, objectTable} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });    
});

describe('The convertion from parsed data to models object',()=>{
    it('is converting simple variable declaration correctly', ()=>{
        var parsed = parseCode('let a = 1;');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"Variable Declaration","name":"a","value":1}}]}');
    });

    it('is converting simple Assignment Expression correctly', ()=>{
        var parsed = parseCode('a = 1;');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"Assignment Expression","name":"a","value":1}}]}');
    });

    it('is converting simple Function Declaration correctly', ()=>{
        var parsed = parseCode('function simpleDeclaration(){};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"Function Declaration","name":"simpleDeclaration","params":[]}}]}');
    });

    it('is converting simple While Statement correctly', ()=>{
        var parsed = parseCode('while(true){};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"WhileStatement","condition":true}}]}');
    });

    it('is converting simple For Statement correctly', ()=>{
        var parsed = parseCode('for(var i=0;i<10;i++){};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"ForStatement","condition":"i=0;i<10;i++"}}]}');
    });

    it('is converting simple For-in Statement correctly', ()=>{
        var parsed = parseCode('for (i in number){};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"ForInStatement","condition":"i in number"}}]}');
    });

    it('is converting simple For-of Statement correctly', ()=>{
        var parsed = parseCode('for (i of number){};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"ForOfStatement","condition":"i in number"}}]}');
    });

    it('is converting simple If Statement correctly', ()=>{
        var parsed = parseCode('if(true){};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"If Statement","condition":true}}]}');
    });

    it('is converting simple If Else Statement correctly', ()=>{
        var parsed = parseCode('if(X < V[mid])high = mid - 1;else if (X > V[mid])low = mid + 1;');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"If Statement","condition":"X<V[mid]"}},{"obj":{"type":"Assignment Expression","name":"high","value":"mid-1"}},{"obj":{"type":"Else If Statement","condition":"X>V[mid]"}},{"obj":{"type":"Assignment Expression","name":"low","value":"mid+1"},"belong":true}]}');
    });

    it('is converting simple If Return Statement correctly', ()=>{
        var parsed = parseCode('function simpleDeclaration(){return;};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"Function Declaration","name":"simpleDeclaration","params":[]}},{"obj":{"type":"Return Statement","value":"null"}}]}');
    });

    it('is converting complex function with While loop correctly', ()=>{
        var parsed = parseCode('function binarySearch(X, V, n){let low, high, mid;low = 0;high = n - 1;while (low <= high) {mid = (low + high)/2;if (X < V[mid])high = mid - 1;else if (X > V[mid]) low = mid + 1;else return mid;}return -1;}');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"Function Declaration","name":"binarySearch","params":[{"type":"Identifier","name":"X"},{"type":"Identifier","name":"V"},{"type":"Identifier","name":"n"}]}},{"obj":{"type":"Variable Declaration","name":"low"}},{"obj":{"type":"Variable Declaration","name":"high"}},{"obj":{"type":"Variable Declaration","name":"mid"}},{"obj":{"type":"Assignment Expression","name":"low","value":0}},{"obj":{"type":"Assignment Expression","name":"high","value":"n-1"}},{"obj":{"type":"WhileStatement","condition":"low<=high"}},{"obj":{"type":"Assignment Expression","name":"mid","value":"low+high/2"},"belong":true},{"obj":{"type":"If Statement","condition":"X<V[mid]"},"belong":true},{"obj":{"type":"Assignment Expression","name":"high","value":"mid-1"},"belong":true},{"obj":{"type":"Else If Statement","condition":"X>V[mid]"},"belong":true},{"obj":{"type":"Return Statement","value":"mid"},"belong":true},{"obj":{"type":"Return Statement","value":"-1"}}]}');
    });

    it('is converting complex function with For loop correctly', ()=>{
        var parsed = parseCode('function binarySearch(X, V, n){let low, high, mid;low = 0;if (X < V[mid]){for (var i = 0; i<10;i++){ }}else if (X > V[mid]){low = mid + 1; high = -1;}return -1;}');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"Function Declaration","name":"binarySearch","params":[{"type":"Identifier","name":"X"},{"type":"Identifier","name":"V"},{"type":"Identifier","name":"n"}]}},{"obj":{"type":"Variable Declaration","name":"low"}},{"obj":{"type":"Variable Declaration","name":"high"}},{"obj":{"type":"Variable Declaration","name":"mid"}},{"obj":{"type":"Assignment Expression","name":"low","value":0}},{"obj":{"type":"If Statement","condition":"X<V[mid]"}},{"obj":{"type":"ForStatement","condition":"i=0;i<10;i++"}},{"obj":{"type":"Else If Statement","condition":"X>V[mid]"}},{"obj":{"type":"Assignment Expression","name":"low","value":"mid+1"},"belong":true},{"obj":{"type":"Assignment Expression","name":"high","value":"-1"},"belong":true},{"obj":{"type":"Return Statement","value":"-1"}}]}');
    });

    it('is converting function with assignment parameter correctly', ()=>{
        var parsed = parseCode('function a(v=1){let t = v+1;v=a;};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"Function Declaration","name":"a","params":[{"type":"AssignmentPattern","name":"v","value":1}]}},{"obj":{"type":"Variable Declaration","name":"t","value":"v+1"}},{"obj":{"type":"Assignment Expression","name":"v","value":"a"}}]}');
    });

    it('is converting do while whith value in condition correctly', ()=>{
        var parsed = parseCode('do{}while(1);do{}while(time);');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"DoWhileStatement","condition":1}},{"obj":{"type":"DoWhileStatement","condition":"time"}}]}');
    });

    it('is converting complex For condition correctly', ()=>{
        var parsed = parseCode('for(i;i<10;i++){};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"ForStatement","condition":"i;i<10;i++"}}]}');
    });

    it('is converting complex For condition with null correctly', ()=>{
        var parsed = parseCode('for(;i<10;i++){};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"ForStatement","condition":";i<10;i++"}}]}');
    });

    it('is converting complex For condition with literal correctly', ()=>{
        var parsed = parseCode('for(1;i<10;i++){};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"ForStatement","condition":"1;i<10;i++"}}]}');
    });

    it('is converting complex For condition with all null correctly', ()=>{
        var parsed = parseCode('for(;;){};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"ForStatement","condition":";;"}}]}');
    });

    it('is converting complex If statement correctly', ()=>{
        var parsed = parseCode('if(a){};if(i=1+2){};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"If Statement","condition":"a"}},{"obj":{"type":"If Statement","condition":"i=1+2"}}]}');
    });

    it('is converting complex If statement correctly2', ()=>{
        var parsed = parseCode('if(true||(a&&b)){};if(!true){};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"If Statement","condition":"true||a&&b"}},{"obj":{"type":"If Statement","condition":"!true"}}]}');
    });

    it('is converting update with prefix false correctly', ()=>{
        var parsed = parseCode('for(;;++i){};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"ForStatement","condition":";;++i"}}]}');
    });
});

