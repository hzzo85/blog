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
在基于类的语言中，对象是类的实力，并且类可以从另一个类继承。JavaScript是一门基于原型的语言，这以为着对象直接从其他对象继承。