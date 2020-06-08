const getData = () =>
  new Promise(resolve => setTimeout(() => resolve('data'), 1000));

function* testG() {
  // await被编译成了yield
  const data = yield getData();
  console.log('data: ', data);
  const data2 = yield getData();
  console.log('data2: ', data2);
  return 'success';
}

function asyncToGenerator(generatorFunc) {
  return new Promise((resolve, reject) => {
    var gen = generatorFunc();

    function step(arg) {
      try {
        var res = gen.next(arg);
      } catch (e) {
        return reject(e);
      }

      if (res.done) {
        resolve(res.value);
      } else {
        // 除了最后结束的时候外，每次调用gen.next()
        // 其实是返回 { value: Promise, done: false } 的结构，
        // 这里要注意的是Promise.resolve可以接受一个promise为参数
        // 并且这个promise参数被resolve的时候，这个then才会被调用
        return Promise.resolve(res.value).then(
          val => {
            step(val);
          },
          err => {
            gen.throw(err);
          }
        );
      }
    }
    step();
  });
}

const res = asyncToGenerator(testG);
