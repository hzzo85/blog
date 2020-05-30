function INew(fn) {
  const ret = {};
  ret.__proto__ = fn.prototype;
  // 把 ret 作为 fn 的this
  const res = fn.apply(ret, Array.prototype.slice.call(arguments, 1));
  const resType = typeof res;
  if (resType === 'function' || resType === 'object') return res;
  return ret;
}

function A(name) {
  this.name = name;
  return function () {
    console.log('ret', name);
  }
}

function B(name) {
  this.name = name;
}


const a1 = INew(A, 'a1');
const b1 = INew(A, 'b2');
const a2 = INew(B, 'a2');
const b2 = INew(B, 'b2');

console.log('a1() ->');
// a1();
console.log('b1() ->');
// b1();
console.log('a2 ->', a2);
console.log('b2 ->', b2);