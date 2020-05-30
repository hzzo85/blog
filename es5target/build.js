/**
 * Build npm lib
 */
const signale = require('signale');
const path = require('path');
const { execSync } = require('child_process');
const { Signale } = signale;

const resolve = dir => path.resolve(__dirname, dir);

const tasks = [
  // 'rm -rf lib',
  `rollup -c ${resolve('./rollup.config.js')}`,
];

tasks.forEach(task => {
  signale.start(task);

  const interactive = new Signale({ interactive: true });
  interactive.pending(task);
  execSync(`${task}`, {
    stdio: [0, 1, 2],
  });
  interactive.success(task);
});
