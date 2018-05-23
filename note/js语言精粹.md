# 对象
## 函数对象
JavaScript中的函数就是对象。  
对象是“名/值”对的集合并拥有一个连到原型对象的隐藏链接。  
对象自面量产生的对象链接到object.prototype。函数对象连接到Function.prototype（该原型对象本身连接到object.prototype）。   
*每个函数在创建时回附加两个隐藏属性：函数的上下文和实现函数行为的代码（JavaScript创建一个函数对象是，会给该对象设置一个“调用”属性，当JavaScript调用一个函数时，可以理解为调用次函数“调用”属性）  

### 闭包
一个内部函数除了可以访问自己的参数和变量，同时它也能自由访问把它嵌套在其中的父函数的参数与变量。通过函数字面量创建的函数对象包含一个连到外部上下文的连接。

### 调用
调用一个函数会暂停当前函数的执行，传递控制权和参数给新函数。除了声明时定义的形参，每个函数还接收两个附加的参数：this 和 arguments。   
**this**：它的值取决于调用模式 
*方法调用模式*  
```
var myobj = {
    value: 0,
    increment: function (inc) {
        this.value += typeof inc === 'number' ? inc : 1;
    }
}
myobj.increment()
console.log(myobj.value) // 1
myobj.increment(2)
console.log(myobj.value) // 3
```
### 特点
---
1. 函数被保存为对象的一个属性（称之方法）   
2. 方法被调用的时候this被绑定到该对象  
3. this到对象的绑定发生在调用的时候   
#### **函数调用模式**
当一个函数并非一个对象的属性时，按么它就是被当作一个函数来调用：  
```
var sum = add(3, 4)
```
此模式调用函数时，this指向全局对象  
#### *构造器调用模式*
如果一个函数前面带上 new 来调用，那么背地里会创建一个连接到该函数的prototype成员的新对象，同时this会被绑定到那个新对象上。  
```
var Quo = function(string) {
    this.value = string;
}
Quo.prototype.get_status = function () {
    return this.status;
}
var myQuo = new Quo('confused');
console.log(myQuo.get_status())  //confused 
```
如果函数调用时在前面加上了 new 前缀，且返回值不是一个对象，则返回this（该新对象）。
接来下会有更好的构造函数替代方式
#### *apply调用模式*
注意：arguments 是一个伪数组，不具有任何数组方法   
#### *扩充类型的功能*
我们可以通过给object.prototype添加方法，同样的方法也适用于函数、数组、字符串、数字、正则表达式和布尔值。
```
Function.prototype.method = function (name, func) {
    if (!this.prototype[name]) {
        this.prototype[name] = func;
    }
    return this;
}
// 根据数字的正负来判断是使用Math.ceiling 还是 Math.floor
Number.method('integer', function () {
    return Math[this < 0 ? 'ceil' : 'floor'](this);
})
console.log((-10 / 3).integer()); // -3
// 移除字符串空白的方法
String.method('trim1', function() {
    return this.replace(/^\s+|\s+$/g,'')
})
```
#### *递归*
```
// 递归调用
var walk_the_DOM = function walk(node, func) {
    func(node);
    node = node.firstChild;
    while (node) {
        walk(node, func);
        node = node.nextSibling;
    }
}
var getElementsByAttribute = function (att, value) {
    var result = [];
    walk_the_DOM(document.body, function (node) {
        var actual = node.nodeType === 1 && node.getAttribute(att);
        if (typeof actual === 'string'
            && (actual === value || typeof value !== 'string')) {
            result.push(node);
        }
    });
    return result;
}
```
#### *级联*
类似jQuery的链式调用
#### *坷里化*
坷里化允许我们把函数与传递给它的参数相结合，产生出一个新的函数  
```
Function.method('curry', function () {
    var slice = Array.prototype.slice,
        args = slice.apply(arguments),   //转换成数组的小技巧
        that = this;
    return function () {
        return that.aplly(null, args.concat(slice.apply(arguments)))
    }
})
```


# 继承
在基于类的语言中，对象是类的实例，并且类可以从另一个类继承。JavaScript是一门基于原型的语言，这意味着对象直接从其他对象继承。

### 伪类
构造器函数产生对象  
当一个函数对象被创建时，Function构造器产生的函数对象会运行类似这样的代码：   
```
this.prototype = { constructor: this };
```
构造器模式  
新函数对象被赋予一个prototype属性，它的值是一个包含constructor属性且属性值为该新函数的对象。   
```
Function.method('new', funciton() {
    // 创建一个新对象，它继承自构造器函数的原型对象
    var that= Object.create(this.prototype);
    // 调用构造器函数，绑定 -this- 到新对象上
    var other = this.apply(that, arguments);
    // 如果它的返回值不是一个对象，就返回该新对象
    return (typeof other === 'object' && other) || that;
})
```
构造器缺点，没有私有环境。无法访问super(父类)的方法

### 原型

### 函数化
模块模式，特点是拥有私有的属性，灵活性高，并且可以处理父类方法。该函数包括4个步骤  
1. 创建一个新对象
2. 有选择的定义私有实例变量和方法。这些就是函数中通过var语句定义的普通变量。
3. 给这个新对象扩充方法。这些方法拥有特权去访问参数，以及在第2步中通过var语句定义的变量。
4. 返回新对象
```
var constructor = function (spec, my) { // spec对象包含构造器需要构造一个新实例的所有信息。my对象是一个为继承链中的构造器提供秘密共享的容器。
    var that,  其他的私有实例变量; // 声明私有的实例变量和方法。内部函数可以访问私有变量和方法。
    my = my || {};  // 给my对象添加共享的秘密成员。 例如my.member = value;
    把共享的变量和函数添加到my中;
    that = 一个新对象;
    添加给 that 的特权方法（
    var methodical = function () {
        ...
    };
    that.methodical = methodical;
    ）;
    return that;
}
```
现在，把以上的方法应用到mammal🌰里。
name和saying属性完全私有。只有通过对外暴露的get_name和says两个特权方法才可以访问他们。
```
var mammal = function (spec) {
    var that = {};
    that.get_name = function() {
        return spec.name;
    }
    that.says = function () {
        return spec.saying || '';
    }
    return that;
}
var myMammal = mammal({name: 'Herb'});
var cat = function (spec) {
    spec.saying = spec.saying || 'meow';
    var that = mammal(spec);
    that.puur = function(n) {
        var i, s = '';
        for (i = 0; i < n; i += 1) {
            if (s) {
                s += '-';
            }
            s += 'r';
        }
        return s;
    };
    that.get_name = function () {
        return that.says() + ' ' + spec.name + ' ' + that.says();
    };
    return that;
}
var myCat = cat({name: 'Henrietta'});
```
函数化模式还提供了一个处理父类方法的方法。
```
Object.method('superior', function (name) {
    var that = this,
        method = that[name];
    return function () {
        return method.apply(that, arguments);
    }
})
var coolcat = function (spec) {
    var that = cat(spec),
        super_get_name = that.superior('get_name);
    that.get_name = function (n) {
        return 'like ' + super_get_name() + 'baby';
    }
    return that;
}
var myCoolCat = coolcat({name: 'Bix'});
var name = myCoolCat.get_name();  // 'like meow Bix meow baby'
```

### 部件
构造一个给任何对象添加简单是件处理特性的函数。它会给对象添加一个on方法，一个fire方法和一个私有的事件注册表对象。
```
var eventuality = function (that) {
    var registry = {};  // 注册
    that.fire = function (event) {
        // 在对象上出发一个事件。该事件可以是一个包含事件名称的字符串，或者是一个拥有包含事件名称的 type 属性对象。通过‘on’方法注册的是件处理程序中匹配事件名称的函数将被调用。
        var array,
            func,
            handler,
            i,
            type = typeof event === 'string' ? event : event.type;
        // 如果这个事件存在一组事件处理程序，那么久遍历他们并按顺序依次执行。
        if (registry.hasOwnProperty(type)) {
            array = registry[type];
            for (i = 0; i < array.length; i += 1) {
                handler = array[i]
                // 每个处理程序包含一个方法和一组可选的参数。
                // 如果该方法是一个字符串形式的名字，那么寻找到该函数。
                func = handler.method;
                if (typeof func === 'string') {
                    func = this[func];
                }
                // 调用一个处理程序。如果该条目包含参数，那么传递条目过去。否则，传递该事件对象。
                func.applu(this, hadnler.parameters || [event]);
            }
        }
        return this;
    };
    this.on = function(type, method, parameters) {
        // 注册一个事件。构造一条处理程序条目。将它插入到处理程序数组中，如果这种类型的是件还不存在，就创造一个。
        var handler = {
            method: method,
            parameters: parameters,
        };
        if (registry.hasOwnProperty(type)) {
            registry[type].push(handler);
        } else {
            registry[type] = [handler];
        }
        return this;
    }
    return that;
};
```
# 数组
数组是一段线性分配的内存，它通过整数计算偏移并访问其中的元素。   
[]后置下标运算符是把它所含的表达式转换成一个字符串，如果该表达式有toString方法，就使用该方法的值。这个字符串将被用作属性名。

### 删除
由于JavaScript的数组其实就是对象，所以delete运算符可以用来从数组中移除元素，删除后留下undefined；
```
numbers = [1, 2, 3, 4】
delete numbers[2]; // [1, 2, undefined, 4];
// 也可以使用splice方法
numbers.splice(2, 1); // [1, 2, 4];
// 因为被删除属性后的每个属性必须被移除，对大型数组的效率比较低
```

# 正则表达式
可处理正则表达式的方法有
regexp.exec  
regexp.test  
string.match  
string.replace  
string.search  
string.split  
```
var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
var url = 'http://www.ora.com:80/goodparts?q#fragment';
var result = parse_url.exec(url)
```
```
1. ^
// 以...开始
2. (?:([A-Za-z]+):)?
// 仅当后面跟随一个:才匹配。后缀的?表示是可选的,(空格内的东西)表示一个捕获型分组，会复制匹配的文本，并复制到result数组里，第一个补货分组的编号是1
3. (\/{0, 3})
捕获斜杆
4. ([0-9.\-A-Za-z]+)
捕获分组3，匹配一个活多个数字、字母，以及.或者-字符组成
5. (?::(\d))?
匹配端口号，它由一个前置:加上一个或多个数字组成的序列。
6. (?:\/([^?#]*))?
另一个可选分组，以/开始，之后的字符类[^?#]以一个^开始，表示这个类包含除?和#之外所有字符。*表示可以被匹配0次或多次
7. (?:\?([^#]*))?
以?开始，包含0个或多个非#字符
8. (?:#(.*))?
以#开始的。.会匹配除结束符以外所有字符。
```
another🌰
数字匹配的正则表达式。数字可能由一个整数部分加上一个可选的符号，一个可选的小数部分和一个可选的指数部分组成；
```
var parse_number = /^?\-\d+(?:\.\d*)?(?:e[+\-]?\d+)?$/i
/^   $/i
它指引这个正则表达式对文本中所有的字符串都进行匹配。i忽略了大小写
-？
负号后面的?后缀表示这个负号是可选的
\d+
\d匹配数字，+表示可以匹配一个或多个
(?:\.\d*)?
(?: 。。。)? 表示一个可选的非捕获型分组。通常用非捕获型分组来替代少量不优美的捕获型分组是很好的方法。这个分组会匹配后面跟随的0个活多个数字的小数点：
(?:e[+\-]?\d+)?
这是另外一个可选的非捕获型分组。它会匹配一个e(E)、一个可选的正负号以及一个或多个数字
```

### 正则表达式分组
分组共有4种  
1. 捕获型  
一个捕获型分组是一个被包围在圆括号种的正则表达式分支。任何匹配这个分组的字符都会被补货。
2. 非捕获型  
非捕获型分组有一个(?:前缀。非捕获型分组仅做简单的匹配，并不会捕获所匹配的文本。
3. 向前正向匹配  
(?=  
4. 向前负向匹配  
(?!  

# 方法
### Array
array.concat(item...)  
返回一个新数组，并把一个活多个参数item附加在其后  
```
var a = ['a', 'b', 'c'];
var b = ['x', 'y', 'z'];
var c = a.concat(b, true);  // ['a', 'b', 'c', 'x', 'y', 'z']
```
### RegExp
1. regexp.exec(string)   
exec方法是使用正则表达式的最强大（和最慢）的方法。如果它成功匹配regexp和字符串string，它会返回一个数组。  
数组中下标为0的元素将包含正则表达式regexp匹配的子字符串。  
下标1的元素是分组1的捕获文本，  
下标2的元素是分组2的捕获文本，  
......  
如果匹配失败则返回null  
如果regexp带有一个g表示，事情回变得更加复杂。查找不是从这个字符串的其实位置开始，而是regexp.lastIndex(初始值为0)位置开始。如果匹配成功，那么regexp.lastIndex将被设置为  该匹配后第一个字符的位置。不成功的匹配回重置regexp.lastIndex为0。  
[RegExp的test](./lab/regexp.html "Markdown")。  
2. regexp.test(string)  
test方法是使用正则表达式的最简单（最快）的方法，只返回布尔值。不要对这个方法使用g标识。  
   
### String
1. string.charAt(pos)  
返回在string中pos位置处的字符，如果pos小于0或大雨等于字符串长度string.length，返回空字符串。  
``` 
var name = 'yangte';
var initial = name.chatAt(0);   // 'y'
```
2. string.charCodeAt(pos)  
与1的方法类似，返回的是字符编码  
3. string.concat(string...)  
不常用，用+更方便，但是很适合装逼  
4. string.indexOf(searchString, posistion)  
5. string.lastIndexOf(searchString, posistion)  
6. string.localCompare(that)  
比较两个字符串。如果string比that小，那么结果为负数。如果相等为0
```
var m = ['AAA', 'A', 'aa', 'a', 'Aa', 'aaa'];
m.sort((a, b) => a.localeCompare(b))   //  ['a', 'A, 'aa', 'Aa', 'aaa', 'AAA']
```
7. string.match(regexp)  
让字符串和一个正则表达式进行匹配。
8. string.replace(searchValue, replaceValue)  