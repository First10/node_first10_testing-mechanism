Feature: Find an item
  As an anonymous user
  I should be able to search for and item
  So that I know I the web shop stocks it

  Scenario: Find item
    Given I am on the homepage
    When I search for: "Beaumont"
    Then I should see a search result with the title "Beaumont Summit Kit"
