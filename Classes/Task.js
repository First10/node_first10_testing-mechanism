const { spawn, spawnSync } = require('child_process');
const path = require('path');


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
      const cucumber = spawn(`node`, ['node_modules/cucumber/bin/cucumber', '-f', 'json:cucumber_report.json'], {
        cwd: path.join(__dirname, '../../..')
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

    const reporter = require('cucumber-html-reporter');

    let osType = os.type();
    let osVersion = os.release();
    osType = (osType === 'Darwin') ? process.env._system_name : osType;
    osVersion = (osType === 'OSX') ? process.env._system_version : osVersion;

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
}
