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
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"Variable Declarator","name":"a","value":1}}]}');
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
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"If Statement","condition":"X<V[mid]"}},{"obj":{"type":"Assignment Expression","name":"high","value":"mid-1"}},{"obj":{"type":"Else If Statement","condition":"X>V[mid]"}},{"obj":{"type":"Assignment Expression","name":"low","value":"mid+1"}}]}');
    });

    it('is converting simple If Return Statement correctly', ()=>{
        var parsed = parseCode('function simpleDeclaration(){return;};');
        var table = objectTable(parsed);
        assert.equal(JSON.stringify(table),'{"Rows":[{"obj":{"type":"Function Declaration","name":"simpleDeclaration","params":[]}},{"obj":{"type":"Return Statement","value":"null"}}]}');
    });
});
