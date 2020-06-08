// 如何使用generator

function* GenTest(status = 0) {
  let data;
  // 根据传入的status 这个yield可以不被执行
  if (status === 0) {
    /**
     * 调用第一个next()，执行第一个yield右边的语句
     * 赋值date = undefined
     * => console.log('status = ', status)
     * 返回 { value: undefined, done: false }
     */
    data = yield console.log('status = ', status);
    /* --- 第二个next()开始 --- */
    console.log('data = ', data);
  }
  console.log('data = ', data);
  /**
   * 调用第二个next('hah')
   * 赋值date = 'hah'
   * 执行yield右边的语句, 以及第一个yield之下的所有语句
   * 返回 { value: f, done: false }
   */
  data = yield () => 'status 1';
  /* --- 第二个next()结束 --- */
  /* --- 第三个next()开始 --- */
  data = yield 'status 2';
  /* --- 第三个next()结束 --- */
  /* --- 第四个next()开始 --- */
  yield console.log('data', data);
  /* --- 第四个next()结束 --- */
}

var gen = GenTest(0); // 传入0
gen.next(); // log => 'status = 0'
gen.next('hah'); // log => 'data = undefined', log => 'data = undefined'
