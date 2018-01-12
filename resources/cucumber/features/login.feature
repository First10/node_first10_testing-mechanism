Feature: Login to the website
  As an anonymous user
  I want to login
  So that I know I have an account

  Scenario: Login
    Given I am on the homepage
    When I login using the email address: "roni_cost@example.com" and password "roni_cost3@example.com"
    Then I should see "My Dashboard" as the page title
