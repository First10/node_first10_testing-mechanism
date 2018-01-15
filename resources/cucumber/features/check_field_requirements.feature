Feature: Check a form field requirements
  As a site user
  I want see feedback on form fields
  So that I know I'm going to submit a valid form

  Scenario: Ensure we can't submit the form without all the required fields being completed
    Given I am at the url "www.personalisable-engravings.com/personalisable-hipflask"
    When I fill out all the fields in form "#form"
    And remove the value from "1" "required" field
    Then the "submit" "button" shouldn't be "visible"

  Scenario: Ensure we can see custom typefaces
    Given I am at the url "www.personalisable-engravings.com/personalisable-hipflask"
    When I click "Customise font" button
    Then I should see a list of "custom fonts"

  Scenario: Ensure we can select custom typefaces
    Given I am at the url "www.personalisable-engravings.com/personalisable-hipflask"
    When I try to customise the font
    Then I should see a "visual" change to "selector"

  Scenario: Check there's a visual indication for character limited text inputs
    Given I am at the url "www.personalisable-engravings.com/personalisable-hipflask"
    When I add characters to character limited field: <fields>
    Then I should see a "visual" change to "selector"
    Examples:
      | fields    |
      |    field1 |
      |    field2 |
      |    field3 |
      |    field4 |

  Scenario: Check users can't enter too many character on limited fields
    Given I am at the url "www.personalisable-engravings.com/personalisable-hipflask"
    When I add <max> (+1) characters to character limited field: <fields>
    Then I should only see <max> characters in <fields> value
    Examples:
      | fields   | max       |
      |   field1 |         5 |
      |   field2 |      1234 |
      |   field3 |        15 |
