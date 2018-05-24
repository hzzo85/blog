# React性能优化不完全指北
针对 React16 和 webpack4  
以下根据渲染时间排序  

## 1.首屏之前
---
在SPA应用中，他们会以以下方式启动：  
1. html模版文件提供root节点
```
<div id="root"></div>
```
2. 挂载  
```
ReactDOM.render(
    <App/>,
    document.getElementById('root)
);
```
如果你使用webpack打包，那么回生成以下三个文件： 
1.html文件
2.js文件(很大)  
3.css文件(如果有的话)  
第一次加载会有很长一段时间是空白的！
### 优化方案：
#####1. 在html文件上做手脚，例如：
```
<div id="root"><!-- 我是一个动画 --></div>
```
我们可以使用html-webapack-plugin帮助我们实现 
``` 
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path);
var loading = {
    html: fs.readFileSync(...);
    css: '<style>' + fs.readFileSync(你的css文件)+'</style>'
}
var config = {
    ...
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'xxx.html',
            template: 'template.html',
            loading: loading,
        })
    ]
}
```
同时在你的模板中做如下修改
```
<html lang="en">
<head>
    <%= htmlWebpackPlugin.options.loading.css %>
</head>
<body>
    <div id="root">
        <%= htmlWebpackPlugin.options.loading.html %>
    </div>
</body>
</html>
```
#####  2.使用 prerender-spa-plugin
```
plugins: [
  new PrerenderSpaPlugin(
    path.join(__dirname, 'dist'),
    [ '/', '/products/1', '/products/2', '/products/3']
  )
]
```
#####  ~~3.去掉css外链~~

##2. 首次内容渲染
这部分内容会对js代码部分进行优化一般情况下，我们可以将代码分类为    
#####  1.基础框架  
缓存基础框架代码
以下是HTTP缓存方案，来自另外一篇博文  
1.expires
在http头中设置一个过期时间，在这个期间浏览器都不会发出请求。除非清缓存。
缺点：客户端和服务端时间可能不一致
2.cache-control
```
cache-control: max-age=31536000
```
设置过期时间(s)，可以避免1中的缺陷，比较常用对一种方案。  
3.last-modified / if-modified-since  
这是一组请求/响应头    
通过对比modified时间来控制缓存  
4.etag / if-none-match   
与3相似，把时间换成了etag  
   
优先级：cache-control > expires > etag > last-modified  

#####  2.polyfill  
使用动态polyfill
```
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
// 如果你只需要Set/Map
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Map,Set"></script>

```
动态polyfill原理： 它会根据你的浏览器 UA 头，判断你是否支持某些特性，从而返回给你一个合适的 polyfill。  

#####  3.业务基础库
webpack4把 CommonChunksPlugin 抛弃，转而使用SplitChunksPlugin，用于提取公用代码。它会依据模块依赖关系自动打出很多小模块，保证加载进来的代码一定会被依赖到。避免重复加载。4月份发布到现在目前还有一些小坑，一开始把我坑惨了，等待成熟中。  

#####  4.业务代码
使用Tree Shaking减少业务代码体积  

例如我们有下面一个使用了 ES Module标准的模块：
```
// util.js
export function isNumber(x) {
    ...
}

export function isString(x) {
    ...
}
```
你在其他模块中引用了util.js的模块： 
```
// index.js
improt { inNumber } from './util'
isString(111)
```
打包之后util.js的样子如下：
```
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isNumber */
/* harmony export (immutable) */ __webpack_exports__["a"] = cube;
function isNumber(x) {
  ...
}

function isString(x) {
  ...
}
```
注意，这里任然存在我们未引用的isNumber方法，但是多了一行/* unused harmony export isNumber */  
在压缩阶段会丢弃isNumber  
#####  注意⚠️
使用Tree Shaking的时候把babel默认的模块转义关闭   
```
{
  "presets": [
    ["env", {
      "modules": false
      }
    }]
  ]
}
```

##### 更多优化
1. 使用Code Splitting  
一般情况下打包工具会把我们的代码打包成一个很大的bundle，随着项目的庞大，bundle也日益庞大。  
这个时候我们就需要进行代码分割，Code Splitting 可以实现“懒加载”代码，把一个大的bundle拆分成 bundle + 多份动态代码的形式  
import 
```
import { add } from './math';
console.log(add(16, 26));
```
动态import
```
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```
React Loadable 是一个专门用于动态 import 的 React 高阶组件，你可以把任何组件改写为支持动态 import 的形式。
```
import Loadable from 'react-loadable';
import Loading from './loading-component';

const LoadableComponent = Loadable({
  loader: () => import('./my-component'),
  loading: Loading,
});

export default class App extends React.Component {
  render() {
    return <LoadableComponent/>;
  }
}
```
上面的代码在首次加载时，会先展示一个 loading-component，然后动态加载 my-component 的代码，组件代码加载完毕之后，便会替换掉 loading-component。
2. 使用es2015+代码
把代码编译到 ES2015+，然后为少数使用老旧浏览器的用户保留一个 ES5 标准的备胎即可。  
```
<script type="module" src="main.js">  
<script nomodule src="main.es5.js">  //老旧浏览器，会因为无法识别这个标签，而不去加载 ES2015+ 的代码。另外老旧的浏览器同样无法识别 nomodule 熟悉，会自动忽略它，从而加载 ES5 标准的代码。 
``` 
支持type="module"的浏览器支持以下特性  
1. async/await  
2. Promise  
3. Class  
4. 箭头函数、Map/Set、fetch等 

## 交互 
交互阶段可以使用的插件比较多，例如lazyloader，placeholder等等，网上的资料比较多，实际项目中也有用到，后续补充。
