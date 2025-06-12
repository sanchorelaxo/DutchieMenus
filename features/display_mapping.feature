Feature: Physical display mapping and orientation

  As a store operator
  I want each display to show the correct menu for its physical location
  So that customers can easily find the category they want

  Scenario Outline: Each display is mapped to a unique menu/category
    Given the "<displayPosition>" display is positioned in the store
    When the display is powered on
    Then it should show the "<category>" menu

    Examples:
      | displayPosition | category     |
      | TopLeft         | Concentrates |
      | TopRight        | Pre-Rolls    |
      | VertLeft        | Edibles      |
      | VertLeftest     | Topicals     |
      | VertRight       | Flower       |
