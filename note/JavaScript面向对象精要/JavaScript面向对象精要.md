# 一、原始类型和引用类型
其他编程语言使用堆存储原始类型，栈存储引用类型，而JavaScript则完全不同，它使用变量对象追踪存储，原始类型直接存储在变量，而引用对象则作为指针保存在变量内。  
### 原始类型
每个原始类型都是有自己的存储空间，一个变量的改变不会影响其他变量。
```
var a = 'pink';
var b = a;
b = 'yellow'
console.log(a)  // pink
```
#### 鉴别
```
typeof 'a'  //string
typeof 1  //number
typeof true  //boolean
typeof undefined  //undefined
typeof null  //object
/*
 * 注意一个小技巧
 */
console.log(undefined == null)  // true
console.log(undefined == undefined)  // true
console.log(null == null)  // true
```
### 引用类型
引用类型是指JavaScript中的对象，对象以key-value的形式无序存储，而引用值就是对象的实例。
#### 创建对象
```
var obj = new Object();
```
观察以上代码，引用类型不在变量中直接保存对象，而是一个指向内存中实际对象所在的指针（引用）,当你将一个保存对象的变量a赋值给另一个变量b的时候，实际上是赋值了一个指针的拷贝。他们公用同一份内存地址。
#### 对象引用解除
```
obj = null // 这是极妙的
```
#### 鉴别   
函数
```
var fn = function() {};
console.log(typeof fn)   // function
```
鉴别其他其他引用类型推荐使用instanceof
```
var arr = [];
var obj ={};
var fn = functioon(){};
console.log(arr instanceof Array)  // true
console.log(obj instanceof Object)  // true
console.log(fn instanceof Function)  // true
console.log(fn instanceof Object)  // true
console.log(fn instanceof Object)  // true
console.log(fn instanceof Object)  // true
```
由于instanceof操作符可以鉴别继承类型。这意味着所有对象都是Object的实例，因为所有引用类型都继承自Object   

数组
鉴别数组的最佳方法是Array.isArray()方法。
### 原始封装类型
JavaScript为我们封装好了三种原始封装类型（String、Number、Boolean）
当读取字符串、数字或布尔值时，原始封装类型会被自动创建，观察以下代码
```
var name = 'yangte';
var firstChar = name.charAt(0);
console.log(firstChar)  // 'y'
```
这三行代码实际上发生的故事是
```
var name = 'yangte';
var temp = new String(name);    //在读取的时候（之前）被创建
var firstChar = temp.charAt(0);
temp = null;                    //仅用于该语句，随后立即被销毁    
console.log(firstChar);   // ''y
```
为了证明以上观点，观察以下代码
```
var name = 'yangte';
name.last = 'te';
console.log(name.last)  // undefined
```
实际上，他们发生了下面这个故事
```
var name = 'yang';
var temp = new String(name);
temp.last = 'te';
temp = null;

var temp = new String(name);
console.log(temp.last);   //undefined
temp = null
```
注意，instanceof操作符并没有读取任何东西，所以零时对象也没有被创建；
```
var str = 'yang';
var num = 10;
var found = true;
console.log(str instanceof String)    // false
console.log(num instanceof Number)    // false
console.log(found instanceof Boolead) // false
```

# 二、函数
为什么函数被称为特殊的对象，因为他具有一个['[Call]]属性，表示该对象可以被执行。


# 三  、理解对象

### 定义属性
当一个属性第一次被添加给对象时，JavaScript在对象上调用一个名为[[Put]]的内部方法。[[Put]]会在对象上创建一个新节点保存属性（保存值和特性），就像第一个次在哈希表上添加一个键一样。调用[[Put]]的结果是在对象上创建了一个【自有属性】，该属性被保存在实例内。   
当一个已有的属性被赋予新值时，调用了一个名为[[Set]]的方法

### 属性探测
观察以下代码：
```
if (person.name) {
    console.log('find you!');
}
```
如果name为NaN, 0, false, null, 空字符串, 则会判定错误，更加可靠的方法是使用 in 操作符

#### in操作符 和 hasOwnProperty()
in操作符是在哈希表中查找一个键是否存在，in 操作符只会判断属性是否存在，而不会去读取属性的值，所以在性能上是good good 的。但是in的缺陷就是他会去检查自有属性和原型属性，hasOwnProperty() 可以检查自有属性。
```
var person = {
    name: 'te',
    age: 26
};
console.log('name' in person)                       // true
console.log(person.hasOwnProperty('name'))          // true
console.log('toString' in person)                   // true
console.log(person.hasOwnProperty('toString'))      // false
```
### 删除属性
```
var person = {
    name: 'te',
    age: 26
};

console.log(person.hasOwnProperty('name'))          // true
delete person.name
console.log(person.hasOwnProperty('name'))          // false
```

### 属性枚举
添加的属性默认时可枚举的，[[Enumerable]]被设置为true。以下两种方法都可以枚举自有属性。  
```
for (item in obj) {
    if (obj.hasOwnProperty(item)) {
        console.log(obj[item])
    }
}
// ES5 引入了 Object.keys(), 它可以获得可枚举属性的名字的数组
var properties = Object.keys(obj);
for (var i = 0, len = properties.length; i < len; i++) {
    console.log(`${properties[i]}=${obj[properties[i]]}`)
}
```
实际上，对象的大部分原生方法的[[Enumerable]]都被设置为false，可以使用propertyIsEnumerable()，检查一个属性是否可以被枚举。

### 属性类型
属性有两种类型，数据属性和访问器属性，数据属性包含一个值，[[Put方法的默认行为时创建数据属性]]。访问器属性不包含值而是定义了一个当属性被读取时调用的函数（getter）和当属性被写入时调用的函数（setter）。   
定义访问器属性。
```
var person = {
    _name: 'yangte',
    get name() {
        console.log('read');
        return this._name;
    },
    set name(value) {
        console.log('set');
        this._name = value;
    }
}
```
#### 数据属性和访问器属性
##### 共有属性  
[[Enumberable]] 可枚举  
[[Configurable]]  是否可配置，可以用delete删除一个可配置的属性（可配置属性的类型可以从数据属性变成访问器属性或相反，可以使用Object.defineProperty()改变属性特征；
```
var person = {
    name: 'yangte'
}
Object.defineProperty(person, 'name', {
    configurable: false
})

delete person.name;
console.log('name' in person);            // true

Object.defineProperty(person, 'name', {
    configurable: true                    // error!!!
})
```
##### 数据属性
数据属性独有的特征包含：  
[[Value]]       属性的值
[[Writable]]    属性是否可以写入

##### 访问器属性
[[Get]]
[[Set]]

### 获取属性特征
```
var persong = {
    name: 'yangte';
}
var desc = Object.getOwnPropertyDescriptor(person, 'name');
cosnole.log(desc); 
```

### 禁止修改对象
禁止扩展 Object.preventExtensions()  检查 Object.isExtensible
对象封印 Object.seal()   Object.isSealed()
对象冻结 （某一时间点上的快照）  Object.freeze() Object.isFrozen()

# 四、原型对象

# 五、继  承

### 原型对象和Object.prototype

#### 继承自Object.prototype的方法
1. valueOf()   
每当一个操作符用于一个对象时就会调用valueOf()方法。默认返回对象实例本身
2. toString()  
一旦valueOf()返回的是一个引用，就会调用该方法。另外，当JavaScript期望一个字符串时，也会对原始值隐式调用toString()。  
最常见的情况是 
```
console.log(1 + '1')    // '11'
```

### 对象继承
```
var person1 = {
    name: 'yangte',
    sayName: function() {
        console.log(this.name);
    }
}
var person2 = Object.create(person1, {
    name: {
        configurable: true,
        enumerable: true,
        value: 'te',
        writable: true
    }
})
person1.sayName();
person2.sayName();
```

### 构造函数继承
```
// you write this
function fn () {
    // ...
}
// JavaScript engine dose this for you behind the scenes
fn.prototype = Object.crate(Object.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: fn,
        writable: true
    }
})
```

### 构造函数窃取
巧妙使用call

# 对象模式

### 私有成员和特权成员
立即执行函数变量私有化
```
var person = (function() {
    var age = 25;
    return {
        name: 'yangte',
        get age() {
            return age
        },
        old: function() {
            return ++age;
        }
    }
})();
person.age = 100;
console.log(person.age)
console.log(person.old())
```

### 混入
```
funciton mixin(receiver, supplier) {
    for (var property in supplier) {
        if (supplier.hasOwnProperty(property)) {
            recevier[property] = supplier[property];
        }
    }
    return receiver;
}
```
注意，这只是浅复制，如果属性包含以后一个对象，那只是复制了指针，并且访问器属性会变成数据属性。以下是加强版mixin
```
function mixin(receiver, supplier) {
    Object.keys(supplier).forEach(function(property) {
        var descriptor = Object.getOwnPropertyDescriptor(supplier, property);
        Object.defineProperty(receiver, property, descriptor);
    })
    return receiver;
}
```


### 作用域安全的构造函数
```
function Person(name) {
    if (this instanceof Person) {
        this.name = name;
    } else {
        return new Person(name);
    }
}
```