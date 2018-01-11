const Environment = require('./Classes/Environment');
const Task = require('./Classes/Task');

// Setup environment.
const environment = new Environment();
const task = new Task();


Promise.all(environment.init()).then((values) => {
  task.runTests(environment.getConfig('testFramework'))
    .then((result) => {
      console.log('Finished');
      console.log(result);
  });
});


// Run tests.

// Report results


// var options = {
//   theme: 'bootstrap',
//   jsonFile: 'test/report/cucumber_report.json',
//   output: 'test/report/cucumber_report.html',
//   reportSuiteAsScenarios: true,
//   launchReport: true,
//   metadata: {
//     "App Version":"0.3.2",
//     "Test Environment": "STAGING",
//     "Browser": "Chrome  54.0.2840.98",
//     "Platform": "Windows 10",
//     "Parallel": "Scenarios",
//     "Executed": "Remote"
//   }
// };
//
// reporter.generate(options);
//

