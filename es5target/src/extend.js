function _createSuper(Derived) {
  return function () {
    var result = Derived.__proto__.apply(this, arguments);
    if (typeof result === 'object' || typeof call === 'function') {
      return result;
    }
    return this;
  };
}

function Father(name) {
  this.name = name;
}

Father.prototype.sayHi = function () {
  console.log(`hello, i am ${this.name}`);
};

var Son = /*#__PURE__*/ (function (_Father) {
  Son.prototype = Object.create(_Father.prototype);
  Son.prototype.constructor = Son;
  Son.__proto__ = _Father;

  var _super = _createSuper(Son);

  function Son(name, toy) {
    var _this = _super.call(this, name);
    _this = _super.call(this, name);
    _this.toy = toy;
    return _this;
  }

  Son.prototype.showToy = function () {
    console.log(`my toy is ${this.toy}`);
  };

  return Son;
})(Father);
