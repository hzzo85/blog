/**
 * 给定一个先增后降的数组，找出其中的最大值
 */

var arr = [1, 1, 2, 3, 5, 6, 8, 22, 19, 15, 10, 7, 5, 3];

function foo(arr) {
  var start = 0;
  var end = arr.length - 1;
  let big = null;
  while (1) {
    if (arr[start] === arr[end]) {
      big = arr[start++];
      end--;
    } else if (arr[start] > arr[end]) {
      big = arr[start];
      end--;
    } else {
      big = arr[end];
      start++;
    }
    if (start === end) break;
  }

  return big;
}

console.log(foo(arr));
