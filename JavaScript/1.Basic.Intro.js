/// https://en.wikipedia.org/wiki/JavaScript
/// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_Resources
/// https://www.ecma-international.org/ecma-262/5.1
/// https://developer.mozilla.org/bm/docs/Web/JavaScript

/// \u{13102}, \ud80c\udd02
/// https://zh.wikipedia.org/wiki/IEEE_754

/// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics
/// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS
/// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete

/// https://stackoverflow.com/questions/3709866/whats-a-valid-left-hand-side-expression-in-javascript-grammar

(function(global) {
    var g = global;
    
    var getArgs = g.getArgs = function(argObj, startIndex) {
        return Array.apply(null, argObj).slice(startIndex);
    };

    var invoke = g.invoke = function(func) {
        console.groupCollapsed(func.name || func.toString());
            func.apply(null, getArgs(arguments, 1));
        console.groupEnd();
    };

    var consoleGroup = g.consoleGroup = function(label) {
        console.groupCollapsed(label);
            console.log.apply(console, getArgs(arguments, 1));
        console.groupEnd();
    };

    var logObj = g.logObj = function(v, name) {
        console.groupCollapsed(name || 'obj');
            for (var p in v)
                console.log('p: %s, v[p]: %s', p, v[p]);
        console.groupEnd();
    };
    
    var forIn = g.forIn = function(v) {
        console.dir(v);
        for (var p in v)
            console.log('p: %s, v[p]: %s', p, v[p]);
    };
})(window);

/// 'void'
/// MDN:
///     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void
invoke(function voidOperator() {
    console.log(void 0);
    console.log(void 1);
    console.log(void undefined);
    console.log(void true);
    console.log(void NaN);
    console.log(void null);
    console.log(void '');
    console.log(void function() { return true });
    console.log(void (function() { return true })());
});

/// 'Boolean'
/// MDN:
///     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
invoke(function jsBoolean() {
    var logBool = function(v) {
        if (v) console.log(true);
        else console.log(false);
    };
    invoke(function if1() {
        logBool(false);
        logBool(undefined);
        logBool(null);
        logBool(0);
        logBool(-0);
        logBool(NaN);
        logBool('');
    });
    invoke(function if2() {
        logBool(void 0);
        logBool(void true);
        logBool([]);
        logBool({});
        logBool(function() {});
        logBool(function() { return false });
        logBool((function() { return false })());
        logBool( (function() { return new Boolean( void function() { return true }() ) })() );
    });
    invoke(function booleanFunc() {
        logBool(Boolean(true));
        logBool(Boolean(false));
        logBool(Boolean(''));
        logBool(Boolean([]));
        logBool(Boolean({}));
    });
    invoke(function booleanObject() {
        logBool(new Boolean());
        logBool(new Boolean(true));
        logBool(new Boolean(false));
        logBool(new Boolean().value);
        logBool(new Boolean(true).value);
        logBool(new Boolean(false).value);
        logBool(new Boolean().valueOf());
        logBool(new Boolean(true).valueOf());
        logBool(new Boolean(false).valueOf());
    });
});

/// 'switch'
/// MDN:
///     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
invoke(function jsSwitch() {
    invoke(function switch1(x) {  // normal
        switch (x) {
            case 1:
                console.log('case 1');
                break;
            case 2:
                console.log('case 2');
                break;
            default:
                console.log('default');
                break;
        }
    }, '1');
    invoke(function switch2(x) {  // order
        switch (x) {
            case 'a':
                console.log('case "a"');
            default:
                console.log('default');
            case 'b':
                console.log('case "b"');
        }
    }, 'a');
    invoke(function switch3(x) {  // order
        switch (x) {
            default:
                console.log('default');
            case 'a':
                console.log('case "a"');
            case 'b':
                console.log('case "b"');
        }
    }, 'z');
    invoke(function switch4(x) {  // combine
        switch (x) {
            case 'a':
            case 'b':
                console.log('case "b"');
        }
    }, 'a');
    invoke(function switch5(x) {  // fall through
        switch (x) {
            case 'a':
            default:
                console.log('default');
            case 'b':
                console.log('case "b"');
                break;
        }
    }, 'a');
    invoke(function switch6(x) {  // empty
        switch (x) {
        }
    }, void 0);
    invoke(function switch7(x) {  // expression
        var t = 1;
        var u = 2;

        switch (x) {
            default:
                console.log('default');
                break;
            case t:
                console.log('case t');
                break;
            case u:
                console.log('case u');
                break;
            case console.log('This is a case expression, too!'):
                console.log('case console.log()');
                break;
            case (function() { return t + u })():
                console.log('case t + u');
                break;
        }
    }, void 0);
    invoke(function switch8(x) {  // expression evaluation
        var t = 1;

        switch (x) {
            case (t += 6):
                console.log('case t');
                break;
            case t:
                console.log('t');
                break;
            case NaN:
                console.log('NaN');
                break;
        }
    }, 7);
});

/// 'for...in'
/// MDN:
///     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
invoke(function jsForIn() {
    var obj = (function() {
        var obj = {};
        Object.defineProperties(obj, {
            a: { value: 1 },
            b: { value: 2, enumerable: true },
            x: { get: function() { return obj.a + obj.b } },
            y: { get: function() {}, enumerable: true },
        });
        obj.t = 'Hello';
        obj.u = 'World';

        return obj;
    })();
    var arr = (function() {
        var arr = new Array(3);
        arr[5] = '666';

        return arr;
    })();
    var forIn = function(v) {
        console.dir(v);
        var p;
        for (p in v)
            console.log('typeof p: %s, p: %s, v[p]: %s', typeof p, p, v[p]);
    };

    invoke(forIn, obj);
    invoke(forIn, arr);
});

/// 'object'
/// MDN:
///     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer
invoke(function objectBasic() {
    invoke(function literal() {
        var o = {
            a: 1,
            b: 2,
            f: function() { console.log('hello') },
            get x() { return this.a + this.b },
            set x(v) { this.a = this.b = v / 2 },
            get y() { return this.a * this.b },
            set z(v) { return 1 + (this.a = this.b = 999) },
            1: 'the name is 1',
            1e3: 'the name is 1e3',
            1.23e1: 'the name is 1.23e1',
            '2&*/-+1': 'the name is 2&*/-+1',
            null: 'the name is null',
            undefined: 'the name is undefined',
            '__proto__': 5566,
        };

        invoke(forIn, o);
        delete o[1];
        delete o[1e3];
        delete o[12.3];
        delete o['2&*/-+1'];
        delete o[null];
        delete o[undefined];

        invoke(o.f);
        delete o.f;

        o.x = 666;
        invoke(forIn, o);

        o.y = 777;
        invoke(forIn, o);

        o.z = void 0;
        invoke(forIn, o);
    });
    invoke(function dot() {
        var o = {
            p1: {
                p1: {
                    p1: 1
                },
            },
            p2: [],
            p3: void 0,
        };

        invoke(function show() {
            forIn(o);
        });
        invoke(function subNamespace() {
            consoleGroup('o.p1.p1.p1', o.p1.p1.p1);
        });
        invoke(function addNewProperty() {
            o.p4 = 444;
            o.null = 222;
            o.undefined = 333;
            invoke(forIn, o);
        });

        invoke(forIn, o);
    });
    invoke(function bracket() {
        var o = {
            p1: {
                p1: {
                    p1: 1
                },
            },
            p2: [],
            p3: void 0,
        };

        invoke(function show() {
            forIn(o);
        });
        invoke(function subNamespace() {
            consoleGroup("o['p1']['p1']['p1']", o['p1']['p1']['p1']);
        });
        invoke(function addNewProperty() {
            o['p4'] = 444;
            o[null] = 222;
            o[undefined] = 333;
            o[666] = 666;
            o[void 0] = 888;
            o[[]] = 999;
            o[[1,2,3,4]] = 1234;
            invoke(forIn, o);
        });
    });
});

/// 'prototype chain'
/// References:
///     https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes
///     https://www.ecma-international.org/ecma-262/5.1/#sec-11.2.1
///     https://www.ecma-international.org/ecma-262/5.1/#sec-8.7.1
///     https://www.ecma-international.org/ecma-262/5.1/#sec-8.12.3
///     https://www.ecma-international.org/ecma-262/5.1/#sec-8.12.2
///     https://www.ecma-international.org/ecma-262/5.1/#sec-11.13.1
///     https://www.ecma-international.org/ecma-262/5.1/#sec-8.7.2
///     https://www.ecma-international.org/ecma-262/5.1/#sec-8.12.5
invoke(function prototypeChain() {
    var x;
    var y;
    var z;

    invoke(function() {
        x = Object.create(null);
        y = Object.create(x);
        z = Object.create(y);

        console.log(Object.getPrototypeOf(x) === null);
        console.log(Object.getPrototypeOf(y) === x);
        console.log(Object.getPrototypeOf(z) === y);
    });
    invoke(function() {
        x.a = 87;

        console.log(x.a);
        console.log(y.a);
        console.log(z.a);
    });
    invoke(function() {
        y.b = 94;

        console.log(x.b);
        console.log(y.b);
        console.log(z.b);
    });
    invoke(function() {
        y.a = 1313;

        console.log(x.a);
        console.log(y.a);
        console.log(z.a);
    });
});

///
