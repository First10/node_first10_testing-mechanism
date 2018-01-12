const { defineSupportCode } = require('cucumber');
const assert = require("assert");
// ToDo: Add import for selectors depending on the CMS etc.

defineSupportCode(function({ Given, When, Then }) {

  // GIVEN - steps are used to describe the initial context of the system---the scene of the scenario. It is typically something that happened in the past.
  // When Cucumber executes a Given step it will configure the system to be in a well-defined state, such as creating and configuring objects or adding data to the test database.
  // It's ok to have several Given steps (just use And or But for number 2 and upwards to make it more readable).

  Given('I am on the homepage', async () => {
    this.page = await this.browser.newPage();
    await this.page.goto(process.env.siteUrl, {waitUntil: 'networkidle2'});
  });

  Given(/I am at the url "([^"]*)"/, async (url) => {
    this.page = await this.browser.newPage();
    await this.page.goto(url, {waitUntil: 'networkidle2'});
  });




  // WHEN - steps are used to describe an event, or an action. This can be a person interacting with the system, or it can be an event triggered by another system.
  // It's strongly recommended you only have a single When step per scenario. If you feel compelled to add more it's usually a sign that you should split the scenario up in multiple scenarios.

  /**
   * Specifically built to login as it targets #login-form + the relevant types.
   */
  When(/^I login using the email address: "([^"]*)" and password "([^"]*)"/, async (email, password) => {
    await this.page.click('.authorization-link > a');
    await this.page.waitForSelector('.customer-account-login #pass');

    await this.page.click('#login-form [type="email"]');
    await this.page.keyboard.type(email);

    await this.page.click('#login-form [type="password"]');
    await this.page.keyboard.type(password);

    await this.page.click('#login-form button.login');
    await this.page.waitForSelector('#maincontent');
  });

  When(/^I search for: "([^"]*)"/, async (searchTerm) => {
    await this.page.click('#search');
    await this.page.keyboard.type(searchTerm);
    await this.page.keyboard.press('Enter');

    await this.page.waitForSelector('.catalogsearch-result-index #maincontent');
  });




  // THEN - steps are used to describe an expected outcome, or result.
  // The step definition of a Then step should use an assertion to compare the actual outcome (what the system actually does) to the expected outcome (what the step says the system is supposed to do).

  Then(/^I should see \"([a-zA-Z\s]*)\" as the page title$/, async (regex) => {
    const titleText = await this.page.$eval('h1', e => e.innerText);
    assert.equal(titleText, regex, `Title text is incorrect ${titleText}`);
  });


  Then(/^I should see "([a-zA-Z\s]*)" as the page title$/, async (regex) => {
    const titleText = await this.page.$eval('h1', e => e.innerText);
    assert.equal(titleText, regex, `Title text is incorrect ${titleText}`);
  });

  Then(/^I should see a search result with the title \"([a-zA-Z\s]*)\"$/, async (targetTitle) => {
    const itemTitlefound = await this.page.$$eval('.products .product-item-link', (e) => {
      let titles = [];
      e.forEach((item) => {
        titles.push(item.innerText);
      });
      return titles;
    });

    assert.equal(itemTitlefound.includes(targetTitle), true, `Couldn\'t find the item.`);
  });

});

