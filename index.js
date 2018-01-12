const Environment = require('./Classes/Environment');
const Task = require('./Classes/Task');

// Setup environment.
const environment = new Environment();
const task = new Task();


// ToDo: The array literal will need removing once we're returning more than one item.
Promise.all([environment.init()])
.then((values) => {
  console.log('Start running tests.');

  task.runTests(environment.getConfig('testFramework'))
  .then((result) => {
    console.log('Finished tests');
    console.log(result);

    // Report results
    task.reportCucumber();
  });

});
