const { less, exch } = require('./util');

const test1 = 'EASYQUESTION'.split('');

function insertion(arr) {
  const len = arr.length;

  for (let i = 0; i < len; i += 1) {
    for (let j = i; j >= 1 && less(arr[j], arr[j - 1]); j--) {
      exch(arr, j, j - 1);
    }
  }

  return arr;
}

console.log(insertion(test1));
