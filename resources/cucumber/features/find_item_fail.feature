Feature: Find an item that shouldn't be there
  As an anonymous user
  I should be able to search for and item
  So that I know I the web shop doesn't have any pots of gold

  Scenario: Find item
    Given I am on the homepage
    When I search for: "leprechauns pot of gold"
    Then I should see a search result with the title "A massive pot of gold"
