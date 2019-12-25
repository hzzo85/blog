# 作用域和闭包
## 作用域
### 编译原理
通常我们了解到JS是一门解释执行语言，但事实上它是一门编译语言。与传统的编译语言不同，它不是提前编译的，编译结果也不能在分布式系统中进行移植。  
在传统编译语言的流程中，程序的源代码在执行前会经历三个步骤，统称为“编译”。  
1. 分词/词法分析  
这个过程会将由字符串组成的字符串分解成由意义的代码块，这些代码块被称为词法单元。例如， ```var a = 2;``` 会被分解成以下词法单元：```var、a、=、2、;``` 空格是否会被当做词法单元取决于空格在这门语言是否具有意义。  
2. 解析/语法分析
这个过程是讲词法单元流（数组）转换成一个由元素逐渐嵌套所组成的代表了程序语法结构的树。这个🌲被称为“抽象语法🌲”。（AST）
```var a = 2;```的抽象语法🌲大致如下：  
|--VariableDeclaration  
|　|--Identifier（它的值是a）  
|　|　|--AssigmentExpression  
|　|　|　|--NumericLiteral(它的值是2)   
3. 代码生成  
将AST转换为可执行代码的过程。这个过程与与语言、目标平台等息息相关。简单的来说就是将2中的AST转为一组机器指令，用来创建一个叫做a的变量（包括分配内存等），将一个值储存在a中。  
比起传统编译，JavaScript的引擎更加复杂，在词法分析和代码生成阶段会进行性能优化。    
### 作用域链
```var a = 2;```的解析过程可以简化为2个动作  
1. 在当前作用域声明一个变量（如果之前没有声明过）  
2. 运行时引擎会在作用域中查找该变量，如果能找到就会对它赋值  
#### 引擎查询  
引擎查询可以分为LHS（赋值操作的目标是谁，从左侧），RHS（谁是赋值操作的源头，从右侧）  
接下来会有几个🌰  
```
console.log(a); //其中对a的引用是一个RHS引用，因为这里a并没有赋予任何值。相应的，需查找并取得a的值，才能传递给console.log(...)方法
```
```
a = 2; // 这里对a的引用是LHS引用，因为实际上我们不会去关心a的值是什么，我们只想要为 = 2这个赋值操作找到一个目标。
```
```
function foo(a) {  //含有一个隐式的赋值操作，为LHS引用
    console.log(a); // 2
}
foo(2); //RHS引用
```
上述代码引用查询分析：  
1. foo() // RHS  
2. a // LHS  
3. console // RHS  
4. a // RHS

### 异常
为什么要区分LHS和RHS？  
因为在变量还没有声明（在任何作用域中都无法找到该变量）的情况下，着两种查询行为是不一样的。  
```
function foo(a) {
    console.log(a + b);  // RHS在所有作用域中查询b,失败，抛出ReferenceError
    b = a;
}
foo(2);
```
LHS查询（非严格模式下），如果在顶层也无法发找到目标变量，全局作用域就会创建一个变量，并返回引擎；  
TypeError和ReferenceError的区别  
ReferenceError 作用域判别失败   
TypeError 作用域判别成功了，但是对结果的操作是非法或不合理的。  

## 模块
可以把export理解成
```
var foo = (function CoolModule() {
    var something = 'cool';
    var another = [1, 2, 3];
    function doSomething() {
        console.log(something);
    }
    function doAnother() {
        console.log(another.join('!'));
    }
    return {
        doSomething,
        doAnother
    }
})();
```
或者我们可以这么搞：
```
var MyModules = (function Manager() {
    var modules = {};
    function define(name, deps, impl) {
        for (var i = 0; i < deps.length; i++) {
            deps[i] = module[deps[i]]; //核心代码，为了模块的定义引入了包装函数（可以传入依赖），并将返回值，储存在一个根据名字来管理的模块列表中。
        }
        module[name] = impl.apply(impl, deps);
    }
    function get(name) {
        return module[name];
    }
    return {
        define: define,
        get: get
    }
});
MyModules.define('bar', [], function() {
    function hello(who) {
        return `let me introdece: ${who}`;
    }
    returen {
        hello
    }
});
MyModules.define('foo', ['bar'], function() {
    var hungy = 'hippo';

    function awsome() {
        console.log(bar.hello(hungry)).toUpperCase());
    }
    returen {
        awsome
    }
});
var bar = MyModules.get( "bar" );
var foo = MyModules.get( "foo" );
console.log(bar.hello('hippo')); // Let me introduce: hippo
foo.awesome(); // LET ME INTRODUCE: HIPPO
```