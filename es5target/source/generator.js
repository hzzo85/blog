function* myGenerator() {
  console.log(yield '1'); //test1
  console.log(yield '2'); //test2
  console.log(yield '3'); //test3
}

// 获取迭代器
const gen = myGenerator();

gen.next();
gen.next('test1');
gen.next('test2');
gen.next('test3');

//
function* myGenerator2() {
  console.log(yield Promise.resolve(1)); //1
  console.log(yield Promise.resolve(2)); //2
  console.log(yield Promise.resolve(3)); //3
}

function run(gen) {
  return new Promise((resolve, reject) => {
    var g = gen(); //由于每次gen()获取到的都是最新的迭代器,因此获取迭代器操作要放在step()之前,否则会进入死循环

    function step(val) {
      try {
        //封装一个方法, 递归执行next()
        var res = g.next(val); //获取迭代器对象，并返回resolve的值
      } catch (e) {
        reject(e);
      }
      if (res.done) return resolve(res.value); //递归终止条件
      Promise.resolve(res.value).then(
        val => {
          //Promise的then方法是实现自动迭代的前提
          step(val); //等待Promise完成就自动执行下一个next，并传入resolve的值
        },
        err => {
          //抛出错误
          g.throw(err);
        }
      );
    }
    step(); //第一次执行
  });
}

const res = run(myGenerator2);
