/**
 * 合并两个有序数组，要求时间复杂度是O(n)
 * @param {*} arr1
 * @param {*} arr2
 */

var arr1 = [1, 2, 3, 4, 5, 6, 9, 12];
var arr2 = [1, 2, 4, 7, 10, 15];

function foo(arr1, arr2) {
  let i1 = 0;
  let i2 = 0;
  let arr = [];
  const arr1Len = arr1.length;
  const arr2Len = arr2.length;
  while (1) {
    if (arr1[i1] === arr2[i2]) {
      arr.push(arr1[i1++]);
      i2++;
    } else if (arr1[i1] < arr2[i2]) {
      arr.push(arr1[i1++]);
    } else {
      arr.push(arr2[i2++]);
    }
    if (i1 === arr1Len || i2 === arr2Len) break;
  }

  arr = arr.concat(
    i1 === arr1Len ? arr2.slice(i2, arr2Len) : arr1.slice(i1, arr1Len)
  );

  return arr;
}

console.log(foo(arr1, arr2));
