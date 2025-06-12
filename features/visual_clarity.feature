Feature: Real-time product information and visual clarity

  As a customer at the point-of-sale kiosk
  I want to see the most up-to-date product information
  And I want the display to be visually clear and easy to read

  Scenario: Loading state is shown while fetching data
    When the display is fetching product data
    Then I should see a "loading..." indicator

  Scenario: Product data is displayed in the correct section
    When products are loaded
    Then each product should appear in the correct table based on its strain type:
      | Strain Type | Table   |
      | Hybrid      | Hybrid  |
      | Indica      | Indica  |
      | Sativa      | Sativa  |
      | Pre-Ground  | Pre-Ground |

  Scenario: Product rows are visually distinct
    When products are displayed in a table
    Then even rows should have a light gray background
    And odd rows should have a white background

  Scenario: Images and legends are present
    Then I should see a top banner image
    And I should see a bottom banner image
    And I should see a legend explaining any icons or terms (if present)
