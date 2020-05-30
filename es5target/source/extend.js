class Father {
  constructor(name) {
    this.name = name;
  }

  fn1() {
    console.log(this.name);
  }

  static fn2() {
    console.log(this.name + '2');
  }
}

// export default new A('test');
class Son extends Father {
  constructor(name, toy) {
    super(name);
    this.toy = toy;
  }

  fn3() {
    console.log('fn3');
  }
}

export default new Son('test2');
