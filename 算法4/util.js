module.exports = {
  less: (a, b) => a < b,
  exch: (arr, i, j) => {
    [arr[j], arr[i]] = [arr[i], arr[j]];
  },
};
