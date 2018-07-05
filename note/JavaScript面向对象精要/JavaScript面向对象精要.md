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
