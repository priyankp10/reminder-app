const { spawn } = require('child_process');
const path = require('path');

const devProcesses = new Map();
const spawnOpts = {
  cwd: path.resolve(__dirname, '..'),
  env: process.env,
  stdio: 'inherit',
  windowsHide: true
};

const ArgParser = require('../app/argparser');
const args = new ArgParser('Runs the reminder-app development server');
args.add('--webpack-output', { type: 'boolean', alias: '-w',
  help: 'Enables webpack output for dev-server' });
args.add('--debug', { type: 'boolean', alias: '-d',
  help: 'Launches dev-server node process with --inspect flag' });
args.parse();

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const webpackArgs = ['webpack-dev-server', '--config', 'tools/webpack.config.js', '--hot'];
if (!args['webpack-output']) {
  webpackArgs.push('--quiet');
}

const appArgs = ['app', '--dev'];
if (args.debug) {
  appArgs.unshift('--inspect');
}

const webpackProcess = spawn(npx, webpackArgs, spawnOpts);
const expressServer = spawn('node', appArgs, spawnOpts);

devProcesses.set('webpack', webpackProcess);
devProcesses.set('express-server', expressServer);

let alreadyKilled = false;
function killProcesses() {
  if (alreadyKilled) {
    return;
  }

  alreadyKilled = true;
  devProcesses.forEach((proc) => {
    process.kill(proc.pid);
  });
}

process.on('SIGINT', killProcesses);
process.on('SIGTERM', killProcesses);
