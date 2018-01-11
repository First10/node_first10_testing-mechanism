const { spawn, spawnSync } = require('child_process');
const path = require('path');


module.exports = class Task {
  constructor(config) {
  }

  runTests(framework) {
    switch(framework) {
      case 'cucumber':
        return this.runCucumber();
        break;
      default:
        throw new Error('Unknown test framework: ' + framework);
    }
  }

  runReports(framework) {
    switch(framework) {
      case 'cucumber':
        this.reportCucumber();
        break;
      default:
        throw new Error('Unknown test framework: ' + framework);
    }
  }

  runCucumber() {
    return new Promise((resolve, reject) => {
      const cucumber = spawn(`node`, ['./cucumber/.bin/cucumber'], {
        cwd: path.join(__dirname, '../..')
      });

    cucumber.stdout.on('data', (data) => {
      console.log(`cucumber -> ${data}`);
    });

    cucumber.stderr.on('data', (data) => {
      console.log(`cucumber error -> ${data}`);
    });

    cucumber.on('close', (code) => {
      console.log('Testing has ended');
      resolve(`cucumber process exited with code ${code}`);
      // webserver.kill('SIGHUP');
    })

  });
  }

  reportCucumber() {

  }
}
