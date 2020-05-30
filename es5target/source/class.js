class A {
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

const a = new A('test');

console.log(a);

export default A;
