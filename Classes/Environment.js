const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs   = require('fs');
const defaults = {
  deps: ['jest', 'puppeteer', 'request'],
  // ToDo: Investigate why npm 5 rempves packages.
  coreDependencies: ['npx', 'js-yaml', 'git+ssh://git@github.com/First10/node_first10_testing-mechanism.git#master'],
  siteUrl: 'localhost'
};

const correctPath = path.resolve(path.join(__filename, '/../../..'));


module.exports = class Environment {
  constructor(config, location) {
    // Merge in default dependencies.
    config = config || {};
    config.coreDependencies = defaults.coreDependencies;
    config.dependencies = defaults.deps;
    this.config = config;

    // Set the site url to a default common DNS.
    this.siteUrl = process.env.siteUrl = defaults.siteUrl;

  }

  init() {
    const npmFlags = this.setupCoreDependancies();

    return [this.setupDependancies(npmFlags)];
  }

  getConfig(config) {
    switch (config) {
      case 'testFramework':
        return this.testFramework;
      default:
        throw new Error('Test framework unknown');
    }
  }

  setupCoreDependancies() {
    // Check npm version.
    console.log(correctPath);
    const npmVersion = spawnSync('npm', ['-v'], {
      cwd: correctPath
    });

    console.log('Checking npm version');

    // Force npm 4 to use cached local deps.
    let npmFlag = '--prefer-offline';
    const npmVersionIs = parseInt(npmVersion.output.toString('utf8').replace(',', '').split('.')[0]);

    console.log(`You're currently using npm version ${npmVersionIs}`);

    if (npmVersionIs < 4) {
      console.log('You should think about upgrading your npm to at least version 4 as there are various performance benefits.');
      npmFlag = '';
    }

    let npmArgs = ['install'];
    // Add the dependencies.
    npmArgs = npmArgs.concat(this.config.coreDependencies);
    // Add the cache check flag.
    npmArgs = (npmFlag !== '') ? npmArgs.concat(npmFlag) : npmArgs;

    const npmInstall = spawnSync(`npm`, npmArgs, {
      cwd: correctPath
    });

    const testForSuccess = new RegExp(/packages in (\d+)\.(\d+)s/, 'g');

    if (testForSuccess.test(npmInstall.output.toString('utf8'))) {
      console.log('Successfully installed core dependencies');
      return npmFlag
    }
  }

  setupDependancies() {
    let npmArgs = ['install'];
    const yaml = require('js-yaml');

    // Load dependencies from yml file.
    try {
      const yml = yaml.safeLoad(fs.readFileSync(path.join(__filename, '/../../../../tests-config.yml'), 'utf8'));
      console.log('Loaded test-config.yml successfully');

      this.config.dependencies = yml.config.dependencies;
      // Supply the site url through a environmental variable for use later in the testing framework.
      this.siteUrl = process.env.siteUrl = yml.siteUrl;
      this.testFramework = yml.testFramework;
    }
    catch (e) {
      console.log(`There was a problem when trying to retrieve ../tests-config.yml`, e);
    }

    // ToDo: sort out merging defaults and overrides.
    // Add the dependencies.
    npmArgs = npmArgs.concat(this.config.dependencies);
    // Add the cache check flag.

    return new Promise((resolve, reject) => {
      const npmInstall = spawn(`npm`, npmArgs, {
        cwd: correctPath
      });

      const testForSuccess = new RegExp(/packages in (\d+)\.(\d+)s/, 'g');

      npmInstall.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        if (testForSuccess.test(data)) {
          console.log('Found')
          resolve(true);
        }

        npmInstall.stderr.on('data', (data) => {
          //console.log(`stderr: ${data}`);
          // ToDo: Improve error handling.
          //reject(false);
        });
      });
    })
  }

  startServer() {
    // We use npx because gulp binaries can be allusive.
    const webserver = spawn(`npx`, [this.config.runCommand, this.config.commandArgs], {
      cwd: correctPath
    });
  }

  pingUrl() {

    return new Promise((resolve, reject) => {
      // Ping the url to make sure it's up and running before we start the tests.
      const pingProcess = spawn(`ping`, [`-c 10`, `-p ${this.config.port}`, `${this.config.url}`]);
      const testForSuccess = new RegExp('0% packet loss', 'g')
      console.log('Web server up and tested with ping');

      // Count to 30 secs then timeout
      setInterval();
      setTimeout();

      if (pingProcess.output.toString('utf8').match(testForSuccess)) {
        resolve(true);
      }

    })
  }
}













//
// webserver.stdout.on('data', (data) => {
//   console.log(`gulp -> ${data}`);
// const taskName = new RegExp(`Finished '${config.commandArgs}'`, 'g');
//
// // Watch the console output for the gulp task.
// if (String(data).match(taskName)) {
//   console.log('\'Finished\' detected in gulp output so node server is up.');
//   pingUrl(config.url);
// }
// });
//
// webserver.stderr.on('data', (data) => {
//   console.log(`gulp error -> ${data}`);
// });
//
// webserver.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });
//
//
// function pingUrl (url) {
//   // Ping the url to make sure it's up and running before we start the tests.
//   const pingProcess = spawnSync(`ping`, [`-c 10`, `-p ${config.port}`, `${url}`]);
//   const testForSuccess = new RegExp('0% packet loss', 'g')
//   console.log('Web server up and tested with ping');
//
//   if (pingProcess.output.toString('utf8').match(testForSuccess)) {
//     runTests();
//   }
//
//   return pingProcess
// }
