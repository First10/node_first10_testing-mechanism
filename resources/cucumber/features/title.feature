Feature: This feature simply looks for the page title and checks its the correct text
  As a user
  I want to see the page title
  So that I know I am on the correct website

  Scenario: Checking title
    Given I am on the homepage
    Then I should see "Home Page" as the page title
