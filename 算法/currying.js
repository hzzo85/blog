/**
 * 实现一个sum方法【sum(1, 2, 3)(4)，sum(1, 2)(3, 4)类似的调用】
 * 同时console.log(sum(1, 2, 3)(4) => //输出10
 */
function foo(...arg1) {
  if (!arg1.length) arg1 = [0];
  let prev = arg1.reduce((acc, cur) => acc + cur);
  return (...arg2) => arg2.reduce((acc, cur) => acc + cur, prev);
}

console.log(foo()(4, 5, 6));

function add() {
  // 第一次执行时，定义一个数组专门用来存储所有的参数
  var _args = Array.prototype.slice.call(arguments);

  // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
  var _adder = function () {
    _args.push(...arguments);
    return _adder;
  };

  // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
  _adder.toString = function () {
    return _args.reduce(function (a, b) {
      return a + b;
    });
  };
  return _adder;
}

add(1)(2)(3); // 6
add(1, 2, 3)(4); // 10
add(1)(2)(3)(4)(5); // 15
add(2, 6)(1); // 9
