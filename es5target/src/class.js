function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var ClsName = (function () {
  // 执行constructor
  function ClsName(name) {
    this.name = name;
  }

  _createClass(
    A,
    // 定义私有方法 在A.prototype上
    [
      {
        key: 'fn1',
        value: function fn1() {
          console.log(this.name);
        },
      },
    ],
    // 定义静态方法 在A上
    [
      {
        key: 'fn2',
        value: function fn2() {
          console.log(this.name + '2');
        },
      },
    ]
  );

  return ClsName;
})();
