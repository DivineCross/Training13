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

/// 'scope'
/// MDN:
///     https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Functions#Function_scope_and_conflicts
///     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#Closure_Scope_Chain
invoke(function scope() {
    invoke(function scope1() {
        gX = 1000;
        var makeValueGetter = function(x) {
            x = 10;
            return function(x) {
                return gX-- + 100 + x;
            };
        };

        var getter = makeValueGetter(94);
        console.log(gX);
        console.log(makeValueGetter(94)(87));
        console.log(getter(87));

        delete gX;
    });
    invoke(function scope2() {
        var i = 87;
        for (var i = 0; i < 10; ++i) {
            continue;
        }
        if (true) {
            var i = 94;
        }

        console.log(i);
    });
});

/// 'apply, call'
/// References:
///     https://www.ecma-international.org/ecma-262/5.1/#sec-15.3.4.3
///     https://www.ecma-international.org/ecma-262/5.1/#sec-15.3.4.4
///     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
///     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
invoke(function functionApplyAndCall() {
    var getBmi = function(heightOffset, weightOffset) {
        var h = this.height + heightOffset;
        var w = this.weight + weightOffset;
        return w / (h * h);
    };

    var itl = {
        height: 1.76,
        weight: 59.0,
    };

    consoleGroup('BMI of ITL by apply', getBmi.apply(itl, [+0.02, -2]));
    consoleGroup('BMI of ITL by call', getBmi.call(itl, +0.02, -2));
});

/// 'new'
/// References:
///     https://www.ecma-international.org/ecma-262/5.1/#sec-11.2.2
///     https://www.ecma-international.org/ecma-262/5.1/#sec-13
///     https://www.ecma-international.org/ecma-262/5.1/#sec-13.2
///     https://www.ecma-international.org/ecma-262/5.1/#sec-13.2.2
///     https://www.ecma-international.org/ecma-262/5.1/#sec-A.3
///     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof
///     https://www.ecma-international.org/ecma-262/5.1/#sec-15.3.5.3
///     https://www.vojtechruzicka.com/javascript-constructor-functions-and-new-operator
///     https://medium.com/javascript-scene/javascript-factory-functions-vs-constructor-functions-vs-classes-2f22ceddf33e
/// Pseudocode:
///     // Creating Function Objects
///     var createFunction = function() {
///         var f = Object.create(null);
///         f.[[Class]] = 'Function';
///         f.[[Prototype]] = Function.prototype;
///
///         var proto = Object.create(null);
///         proto.constructor = f;
///         f.prototype = proto;
///
///         return f;
///     };
///
///     // [[Construct]]
///     var construct = function(args) {
///         var f = thisFunction;
///
///         var obj = Object.create(null);
///         obj.[[Class]] = 'Object';
///
///         var proto = f.prototype;
///         obj.[[Prototype]] = typeof proto === 'object'
///             ? proto
///             : Object.prototype;
///
///         var result = f.[[Call]](obj, args);
///
///         return typeof result === 'object'
///             ? result
///             : obj;
///     };
///
///     // The new Operator
///     var newOperator = function(constructor, args) {
///         return constructor.[[Construct]].call(null, args);
///     };
invoke(function jsNew() {
    invoke(function prototype(prototypeOfDog) {
        var Dog;
        var dog;
        var dogProto;

        invoke(function() {
            Dog = function Dog(name) {
                this.name = name;
            };
            Dog.prototype = prototypeOfDog || Dog.prototype;

            dog = new Dog('Charlie');
            dogProto = Object.getPrototypeOf(dog);
        });
        invoke(function() {
            console.dir(Dog);
            console.dir(dog);
        });
        invoke(function() {
            console.log(dog.constructor === Dog);
            console.log(dog.constructor === Dog.prototype.constructor);
            console.log(dog instanceof Dog);
            console.log(dogProto === Dog);
            console.log(dogProto === Dog.prototype);
        });
    }, void 0);  // function() {}
    invoke(function newFromThis() {
        var Dog = function Dog(name) {
            this.name = name;
        };
        var dog = (function() {
            return new this('Charlie');
        }).call(Dog);

        console.dir(dog);
        console.log(dog.constructor === Dog);
        console.log(dog instanceof Dog);
    });

    var newDogByCheck = (function() {
        var Dog = function Dog(name) {
            if (!(this instanceof Dog))
                return new Dog(name);

            this.name = name;
        };

        return Dog;
    })();
    var newDogByAnother = (function() {
        var Dog = function Dog(name) {
            return new dogCtor(name);
        };
        var dogCtor = function(name) {
            this.name = name;
        };
        dogCtor.prototype = Dog.prototype;

        return Dog;
    })();
    var withoutNew = function(constructor) {
        var Dog = constructor;
        var dog1 = new Dog('Charlie');
        var dog2 = Dog('Max');

        invoke(function() {
            console.log(dog1 instanceof Dog);
            console.log(dog2 instanceof Dog);
            console.log(dog1.constructor === Dog);
            console.log(dog2.constructor === Dog);
        });
    };
    invoke(withoutNew, newDogByCheck);
    invoke(withoutNew, newDogByAnother);
});
