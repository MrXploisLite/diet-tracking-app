# Requirements Document - Phase 2: Enhanced Features

## Introduction

This document outlines the requirements for Phase 2 of the Nutrition Tracker app, focusing on enhanced user experience through meal photos, favorites system, weight visualization, weekly reports, and improved navigation. These features build upon the gamification and tracking features implemented in Phase 1.

## Glossary

- **System**: The Nutrition Tracker mobile application
- **User**: A person using the app to track their nutrition and health
- **Meal Entry**: A logged food item with nutritional information
- **Favorite Meal**: A saved meal template that can be quickly re-logged
- **Photo Attachment**: An image associated with a meal entry
- **Weight Graph**: A visual chart displaying weight changes over time
- **Weekly Report**: A summary of nutrition and activity data for a 7-day period
- **Calendar View**: A date-based interface for viewing historical meal data
- **Search Function**: A feature to find specific meals by name or date
- **Filter**: A mechanism to display meals based on specific criteria

## Requirements

### Requirement 1: Meal Photo Capture

**User Story:** As a user, I want to attach photos to my meals, so that I can visually document what I eat and remember my meals better.

#### Acceptance Criteria

1. WHEN the User creates a new meal entry, THE System SHALL provide an option to attach a photo
2. WHEN the User selects the photo option, THE System SHALL present choices to capture from camera or select from gallery
3. WHEN the User captures or selects a photo, THE System SHALL display a preview of the image
4. WHEN the User confirms the photo, THE System SHALL store the image URI with the meal entry
5. WHEN the User views a meal with a photo, THE System SHALL display the attached image in the meal card
6. WHEN the User edits a meal with a photo, THE System SHALL allow updating or removing the photo
7. WHERE the device lacks camera permission, THE System SHALL request permission before accessing the camera
8. IF photo storage fails, THEN THE System SHALL save the meal without the photo and notify the user

### Requirement 2: Favorite Meals System

**User Story:** As a user, I want to save my frequently eaten meals as favorites, so that I can quickly log them without re-entering all the details.

#### Acceptance Criteria

1. WHEN the User views a meal entry, THE System SHALL provide an option to mark it as favorite
2. WHEN the User marks a meal as favorite, THE System SHALL save the meal template with all nutritional data
3. WHEN the User accesses the favorites section, THE System SHALL display all saved favorite meals
4. WHEN the User selects a favorite meal, THE System SHALL create a new meal entry with the saved data and current timestamp
5. WHEN the User logs a favorite meal, THE System SHALL allow editing the details before saving
6. WHEN the User removes a meal from favorites, THE System SHALL update the favorite status without deleting the original meal entry
7. THE System SHALL display a visual indicator on meal cards that are marked as favorites
8. WHEN the User has no favorite meals, THE System SHALL display an empty state with instructions

### Requirement 3: Weight Tracking Visualization

**User Story:** As a user, I want to see my weight changes over time in a graph, so that I can monitor my progress toward my weight goals.

#### Acceptance Criteria

1. WHEN the User navigates to the Progress screen, THE System SHALL display a weight tracking section
2. WHEN the User has logged weight entries, THE System SHALL render a line graph showing weight over time
3. THE System SHALL display weight values on the Y-axis and dates on the X-axis
4. WHEN the User taps on a data point, THE System SHALL display the exact weight and date
5. WHEN the User has fewer than 2 weight entries, THE System SHALL display a message encouraging weight logging
6. THE System SHALL provide a button to add a new weight entry from the graph view
7. WHEN the User adds a weight entry, THE System SHALL update the graph immediately
8. THE System SHALL display weight trend indicators (increasing, decreasing, stable)
9. WHERE the User has more than 30 weight entries, THE System SHALL allow scrolling or zooming the graph

### Requirement 4: Weekly Summary Reports

**User Story:** As a user, I want to see a weekly summary of my nutrition and activity, so that I can understand my patterns and make informed decisions.

#### Acceptance Criteria

1. WHEN the User navigates to the Progress screen, THE System SHALL display a weekly summary section
2. THE System SHALL calculate and display total calories consumed for the current week
3. THE System SHALL calculate and display average daily calories for the current week
4. THE System SHALL display total meals logged for the current week
5. THE System SHALL show average macronutrient breakdown (protein, carbs, fats) for the week
6. THE System SHALL display total water intake for the current week
7. THE System SHALL show the number of days the user logged meals during the week
8. WHEN the User selects a different week, THE System SHALL update the summary with that week's data
9. THE System SHALL provide navigation to view previous weeks
10. THE System SHALL display visual indicators comparing current week to previous week (up/down arrows)

### Requirement 5: Calendar View Navigation

**User Story:** As a user, I want to view my meals in a calendar format, so that I can easily navigate to specific dates and see my eating patterns.

#### Acceptance Criteria

1. WHEN the User navigates to the Meals screen, THE System SHALL provide a calendar view option
2. WHEN the User selects calendar view, THE System SHALL display a monthly calendar
3. THE System SHALL highlight dates that have meal entries
4. WHEN the User taps on a date, THE System SHALL display all meals logged on that date
5. THE System SHALL indicate the current date with a distinct visual marker
6. THE System SHALL allow navigation between months using previous/next buttons
7. WHEN a date has no meals, THE System SHALL display an empty state for that date
8. THE System SHALL show visual indicators for dates with high calorie intake (above goal)
9. THE System SHALL show visual indicators for dates with active streaks
10. WHEN the User switches back to list view, THE System SHALL maintain the selected date

### Requirement 6: Meal Search and Filter

**User Story:** As a user, I want to search and filter my meals, so that I can quickly find specific entries or analyze certain types of meals.

#### Acceptance Criteria

1. WHEN the User navigates to the Meals screen, THE System SHALL provide a search input field
2. WHEN the User enters text in the search field, THE System SHALL filter meals by name in real-time
3. THE System SHALL display matching meals as the user types
4. WHEN no meals match the search query, THE System SHALL display a "no results" message
5. THE System SHALL provide filter options for meal type (breakfast, lunch, dinner, snack)
6. WHEN the User selects a meal type filter, THE System SHALL display only meals of that type
7. THE System SHALL allow combining search text with meal type filters
8. THE System SHALL provide a date range filter option
9. WHEN the User applies a date range filter, THE System SHALL display meals within that range
10. THE System SHALL provide a "clear filters" button to reset all filters
11. THE System SHALL display the count of filtered results
12. WHEN the User clears the search, THE System SHALL restore the full meal list

### Requirement 7: Meal Templates

**User Story:** As a user, I want to create meal templates with common combinations, so that I can quickly log multiple items together.

#### Acceptance Criteria

1. THE System SHALL provide an option to create a new meal template
2. WHEN the User creates a template, THE System SHALL allow naming the template
3. WHEN the User creates a template, THE System SHALL allow adding multiple meal items
4. THE System SHALL calculate total nutritional values for all items in the template
5. WHEN the User saves a template, THE System SHALL store it for future use
6. WHEN the User accesses templates, THE System SHALL display all saved templates
7. WHEN the User selects a template, THE System SHALL create individual meal entries for each item
8. THE System SHALL allow editing existing templates
9. THE System SHALL allow deleting templates
10. WHEN the User has no templates, THE System SHALL display an empty state with creation instructions

## Constraints

- All features MUST work offline with local storage
- Photo storage MUST not exceed reasonable device storage limits
- Graph rendering MUST be performant with up to 365 data points
- Search and filter operations MUST complete within 500ms
- All features MUST be accessible and follow React Native best practices
- The System MUST maintain backward compatibility with Phase 1 data
- Camera and photo library access MUST request appropriate permissions
- All new features MUST support both light and dark themes
