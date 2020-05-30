function f1() {
  let sum = 0;
  for (let i = 1; i < 10; i++) {
    for (let j = 0; j < i; j++) 
      sum++
  }

  console.log(sum) // 500500 - 1000 = 499500
}

f1()
