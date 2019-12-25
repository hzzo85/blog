/*
 * @Author: yangte
 * @Date:   2019-05-28 14:58:48
 * @Last Modified by: yangte
 * @Last Modified time: 2019-05-28 15:01:16
 */
/* eslint-disable */
var fs = require('fs');
var path = require('path');
var glob = require('glob');

// const ignoreFile = entry(path.resolve(__dirname, 'src'));
let files = '';
glob.sync(path.resolve(__dirname, 'src/**/*.{js,vue}'), { matchBase: true }).forEach(function(entry) {
    // return entry
    files += `${entry.replace(__dirname + '/', '')}\n`;
});

console.log(files);

fs.appendFile(path.resolve(__dirname, '.eslintignore'), files, function() {
    console.log('追加内容完成');
});
