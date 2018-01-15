Feature: Customise a personalisable product
  As a site user
  I want to see a fully personalisable product
  So that I can add all the engraving details possible

  Scenario: Check all fields are avalible by default
    Given I am at the url "www.personalisable-engravings.com/personalisable-hipflask"
    When I look at the page "personalisation form area" for "personalisation fields"
    Then I should count "8" field inputs

  Scenario: Check correct fields are required
    Given I am at the url "www.personalisable-engravings.com/personalisable-hipflask"
    When I look at the page "personalisation form area" and fields "field1, field2, field3, field4"
    Then they should all be required
