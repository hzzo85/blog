/**
 * 1. Promise本质是一个状态机，且状态只能为以下三种：
 * Pending（等待态）、Fulfilled（执行态）、Rejected（拒绝态），
 * 状态的变更是单向的，只能从Pending -> Fulfilled 或 Pending -> Rejected，状态变更不可逆
 *
 * 2. then方法接收两个可选参数，分别对应状态改变时触发的回调。
 * then方法返回一个promise。then 方法可以被同一个 promise 调用多次。
 *
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class IPromise {
  constructor(executor) {
    this._status = PENDING;
    this._value = undefined; // 储存then回调return的值
    this._resolveQueue = [];
    this._rejectQueue = [];
    this._done = false;

    // 由于resolve/reject是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
    let _resolve = val => {
      //把resolve执行回调的操作封装成一个函数,放进setTimeout里,以兼容executor是同步代码的情况
      const run = () => {
        if (this._status !== PENDING) return; // 对应规范中的"状态只能由pending到fulfilled或rejected"
        this._status = FULFILLED; // 变更状态
        this._value = val; // 储存当前value

        // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
        while (this._resolveQueue.length) {
          const callback = this._resolveQueue.shift();
          callback(val);
        }
      };
      setTimeout(run);
    };
    // 实现同resolve
    let _reject = val => {
      const run = () => {
        if (this._status !== PENDING) return; // 对应规范中的"状态只能由pending到fulfilled或rejected"
        this._status = REJECTED; // 变更状态
        this._value = val; // 储存当前value
        while (this._rejectQueue.length) {
          const callback = this._rejectQueue.shift();
          callback(val);
        }
      };
      setTimeout(run);
    };
    // new IPromise()时立即执行executor,并传入resolve和reject
    executor(_resolve, _reject);
  }

  // then方法,接收一个成功的回调和一个失败的回调
  then(resolveFn, rejectFn) {
    // 根据规范，如果then的参数不是function，则我们需要忽略它, 让链式调用继续往下执行
    typeof resolveFn !== 'function' && (resolveFn = value => value);
    typeof rejectFn !== 'function' && (rejectFn = error => error);

    // return一个新的promise
    return new IPromise((resolve, reject) => {
      // 把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
      const fulfilledFn = value => {
        try {
          // 执行第一个(当前的)Promise的成功回调,并获取返回值
          let x = resolveFn(value);
          // 分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
          x instanceof IPromise ? x.then(resolve, reject) : resolve(x);
        } catch (error) {
          reject(error);
        }
      };

      // reject同理
      const rejectedFn = error => {
        try {
          let x = rejectFn(error);
          x instanceof IPromise ? x.then(resolve, reject) : resolve(x);
        } catch (error) {
          reject(error);
        }
      };

      switch (this._status) {
        // 当状态为pending时,把then回调push进resolve/reject执行队列,等待执行
        case PENDING:
          this._resolveQueue.push(fulfilledFn);
          this._rejectQueue.push(rejectedFn);
          break;
        // 当状态已经变为resolve/reject时,直接执行then回调
        case FULFILLED:
          fulfilledFn(this._value); // this._value是上一个then回调return的值(见完整版代码)
          break;
        case REJECTED:
          rejectedFn(this._value);
          break;
      }
    });
  }

  catch(rejectFn) {
    return this.then(undefined, rejectFn);
  }

  //finally方法
  finally(callback) {
    return this.then(
      value => IPromise.resolve(callback()).then(() => value), // IPromise.resolve执行回调,并在then中return结果传递给后面的Promise
      reason =>
        IPromise.resolve(callback()).then(() => {
          throw reason;
        }) // reject同理
    );
  }

  //静态的resolve方法
  static resolve(value) {
    if (value instanceof IPromise) return value; // 根据规范, 如果参数是Promise实例, 直接return这个实例
    return new IPromise(resolve => resolve(value));
  }

  //静态的reject方法
  static reject(reason) {
    return new IPromise((resolve, reject) => reject(reason));
  }

  //静态的all方法
  static all(promiseArr) {
    let index = 0;
    let result = [];
    return new IPromise((resolve, reject) => {
      promiseArr.forEach((p, i) => {
        //IPromise.resolve(p)用于处理传入值不为Promise的情况
        IPromise.resolve(p).then(
          val => {
            index++;
            result[i] = val;
            //所有then执行后, resolve结果
            if (index === promiseArr.length) {
              resolve(result);
            }
          },
          err => {
            //有一个Promise被reject时，IPromise的状态变为reject
            reject(err);
          }
        );
      });
    });
  }

  static race(promiseArr) {
    return new IPromise((resolve, reject) => {
      //同时执行Promise,如果有一个Promise的状态发生改变,就变更新IPromise的状态
      for (let p of promiseArr) {
        IPromise.resolve(p).then(
          //IPromise.resolve(p)用于处理传入值不为Promise的情况
          value => {
            resolve(value); //注意这个resolve是上边new IPromise的
          },
          err => {
            reject(err);
          }
        );
      }
    });
  }
}
