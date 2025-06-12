Feature: Consistent and clear content on each display

  As a customer at the kiosk
  I want each display to clearly show its assigned category and product information
  So that I am not confused by overlapping or missing information

  Scenario Outline: Each display shows only its assigned category
    Given I am viewing the "<displayPosition>" display
    Then only products from the "<category>" category should be shown
    And the header should match the category
    And the layout should be consistent with other displays

    Examples:
      | displayPosition | category     |
      | TopLeft         | Concentrates |
      | TopRight        | Pre-Rolls    |
      | VertLeft        | Edibles      |
      | VertLeftest     | Topicals     |
      | VertRight       | Flower       |
