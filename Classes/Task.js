const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');


module.exports = class Task {
  constructor(config) {
    // Setup environment variables for passing data back from the tests.
    process.env.testData = {
      browserVersion: null
    };
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

      let cucumberBin = '../../../node_modules/bin/cucumber';

      cucumberBin.then((cucumberBin) => {

        console.log(path.join(__dirname, '../../../features/'));

        const cucumber = spawn(`node`, [`node_modules/cucumber/bin/${cucumberBin}`, '-f', 'json:cucumber_report.json'], {
          cwd: path.join(__dirname, '../../..')
        });

        cucumber.stdout.on('data', (data) => {
          if (data !== '.') {
            console.log(`cucumber -> ${data}`);
          }
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
  });
  }

  reportCucumber() {

    const reporter = require('cucumber-html-reporter');

    let osType = null;
    let osVersion = null;

    if (typeof os === 'object') {
      osType = os.type();
      osVersion = os.release();
      osType = (osType === 'Darwin') ? process.env._system_name : osType;
      osVersion = (osType === 'OSX') ? process.env._system_version : osVersion;
    }
    else {
      osType = 'unknown';
      osVersion = 'unknown';
    }

    let options = {
      theme: 'bootstrap',
      jsonFile: 'cucumber_report.json',
      output: 'cucumber_report.html',
      reportSuiteAsScenarios: true,
      launchReport: true,
      metadata: {
        "App Version": process.env.npm_package_dependencies_cucumber,
        "Test Environment": "STAGING",
        "Browser": process.env.testData.browserVersion,
        "Platform": osType + ' ' + osVersion,
        "Parallel": "Scenarios",
        "Executed": "Local"
      }
    };

    reporter.generate(options);
  }

  // ToDo: Move to somewhere better.
  findFile(thePath, beginsWith) {
    return new Promise(function(resolve, reject) {
      console.log('Full path: ', path.join(__dirname, thePath));
      fs.readdir(path.join(__dirname, thePath), (error, items) => {
        if (error) throw new Error('Directory reading error: ' + JSON.stringify(error));
        let correctFile = null;

        items.forEach((item) => {
          console.log(item);
          if (item.startsWith(beginsWith)) {
            correctFile = item;
          }
        });

        if (correctFile === null) {
          throw new Error(`Failed to find ${beginsWith} in ${path}`)
        }
        return resolve(correctFile);
      })
    });
  }
}
