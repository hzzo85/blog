const { less, exch } = require('./util');

const test1 = 'EASYSHELLSORTQUESTION'.split('');

function insertion(arr) {
  const len = arr.length;
  let h = 1;
  while (h < len / 3) h = h * 3 + 1;

  while (h !== 0) {
    for (let i = 0; i < len; i += 1) {
      for (let j = i; j >= h && less(arr[j], arr[j - h]); j -= h) {
        exch(arr, j, j - h);
      }
    }

    h = Math.floor(h / 3);
  }

  return arr;
}

console.log(insertion(test1).join(''));
