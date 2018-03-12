Feature: Summary
  Benefit
  Role
  Feature

  Scenario: Find item
    Given I am on the homepage
    When I search for: "Beaumont"
    Then I should see a search result with the title "Beaumont Summit Kit"

    # http://eggsonbread.com/2010/09/06/my-cucumber-best-practices-and-tips/
