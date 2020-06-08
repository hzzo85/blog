function Father(name) {
  this.name = name;
}

Father.prototype.sayHi = function () {
  console.log(`hello, i am ${this.name}`);
};

var Son = (function (_Father) {
  function Son(name, toy) {
    // 执行父类构造函数
    _Father.call(this, name);
    this.toy = toy;
  }

  // 改变构造函数
  Son.prototype = Object.create(_Father.prototype);
  Son.prototype.constructor = Son;
  Son.__proto__ = _Father;

  Son.prototype.showToy = function () {
    console.log(`my toy is ${this.toy}`);
  };

  return Son;
})(Father);
