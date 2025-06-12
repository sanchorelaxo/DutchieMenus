Feature: In-store menu display for product categories

  As a customer at the dispensary kiosk
  I want to view clear, up-to-date product menus on dedicated displays
  So that I can easily browse available products by category at the point of sale

  Background:
    Given I am physically present at the dispensary
    And I am looking at the "<displayPosition>" display

  Scenario Outline: Viewing a category menu on a dedicated display
    When the "<displayPosition>" display is active
    Then I should see a header titled "<header>"
    And I should see a loading indicator while products are being fetched
    And I should see a top image banner
    And I should see product tables for:
      | section    |
      | Hybrid     |
      | Indica     |
      | Sativa     |
      | Pre-Ground |
    And each product table should show columns:
      | Brand      |
      | Name       |
      | CBD Potency|
      | THC Potency|
      | Weight     |
      | Price      |
    And I should see a bottom image banner

    Examples:
      | displayPosition | header        | category     |
      | TopLeft         | Concentrates  | Concentrates |
      | TopRight        | Pre-Rolls     | Pre-Rolls    |
      | VertLeft        | Edibles       | Edibles      |
      | VertLeftest     | Topicals      | Topicals     |
      | VertRight       | Flower        | Flower       |
