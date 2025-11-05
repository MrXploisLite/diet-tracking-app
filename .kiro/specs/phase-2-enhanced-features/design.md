# Design Document - Phase 2: Enhanced Features

## Overview

This design document outlines the technical architecture and implementation approach for Phase 2 features of the Nutrition Tracker app. The design focuses on maintaining performance, ensuring data persistence, and providing an intuitive user experience while adding photo capture, favorites, visualization, and navigation enhancements.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  ┌──────────┬──────────┬──────────┬──────────┬───────────┐ │
│  │  Meals   │ Progress │  Camera  │ Calendar │  Search   │ │
│  │  Screen  │  Screen  │  Modal   │   View   │  Filter   │ │
│  └──────────┴──────────┴──────────┴──────────┴───────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
│  ┌──────────┬──────────┬──────────┬──────────┬───────────┐ │
│  │  Image   │ Favorite │  Weight  │  Weekly  │  Search   │ │
│  │  Handler │  Manager │  Calc    │  Stats   │  Engine   │ │
│  └──────────┴──────────┴──────────┴──────────┴───────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────┬──────────┬──────────┬──────────┬───────────┐ │
│  │ AppState │  Meals   │  Photos  │  Weight  │Templates  │ │
│  │ Context  │  Storage │  Storage │  Storage │  Storage  │ │
│  └──────────┴──────────┴──────────┴──────────┴───────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Persistence Layer                          │
│              AsyncStorage + FileSystem                       │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Meal Photo Capture

#### Components

**PhotoPicker Component**
```typescript
interface PhotoPickerProps {
  onPhotoSelected: (uri: string) => void;
  onCancel: () => void;
  existingPhoto?: string;
}
```

**PhotoPreview Component**
```typescript
interface PhotoPreviewProps {
  uri: string;
  onRemove: () => void;
  onEdit: () => void;
  size?: 'small' | 'medium' | 'large';
}
```

#### Implementation Details

- **Library**: `expo-image-picker`
- **Permissions**: Request camera and media library permissions on first use
- **Storage**: Store image URIs in meal objects, actual images in device file system
- **Compression**: Compress images to max 1024x1024 to save storage
- **Format**: JPEG with quality 0.8 for optimal size/quality balance

**Permission Flow**:
1. Check if permission already granted
2. If not, request permission with explanation
3. If denied, show settings prompt
4. If granted, proceed with camera/gallery

**Image Handling**:
```typescript
const pickImage = async (source: 'camera' | 'gallery') => {
  const permissionResult = await requestPermission(source);
  if (!permissionResult.granted) return;
  
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
    maxWidth: 1024,
    maxHeight: 1024,
  });
  
  if (!result.canceled) {
    return result.assets[0].uri;
  }
};
```

### 2. Favorites System

#### Data Structure

```typescript
// Meal interface already has isFavorite field
interface Meal {
  // ... existing fields
  isFavorite?: boolean;
}

// Utility functions
const toggleFavorite = (mealId: string, meals: Meal[]): Meal[] => {
  return meals.map(meal => 
    meal.id === mealId 
      ? { ...meal, isFavorite: !meal.isFavorite }
      : meal
  );
};

const getFavoriteMeals = (meals: Meal[]): Meal[] => {
  return meals.filter(meal => meal.isFavorite);
};

const createMealFromFavorite = (favoriteMeal: Meal): Meal => {
  const now = Date.now();
  const today = new Date().toISOString().split('T')[0];
  
  return {
    ...favoriteMeal,
    id: `${now}-${Math.random().toString(36).substr(2, 9)}`,
    date: today,
    timestamp: now,
  };
};
```

#### Components

**FavoriteButton Component**
```typescript
interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: number;
}
```

**FavoritesList Component**
```typescript
interface FavoritesListProps {
  favorites: Meal[];
  onSelectFavorite: (meal: Meal) => void;
  onRemoveFavorite: (mealId: string) => void;
}
```

### 3. Weight Tracking Visualization

#### Chart Implementation

**Library**: `victory-native` (already in dependencies)

**WeightChart Component**
```typescript
interface WeightChartProps {
  weightEntries: WeightEntry[];
  onAddWeight: () => void;
  theme: Theme;
}
```

**Chart Configuration**:
```typescript
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryScatter } from 'victory-native';

const WeightChart = ({ weightEntries, theme }) => {
  // Sort by date
  const sortedData = [...weightEntries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Format data for Victory
  const chartData = sortedData.map(entry => ({
    x: new Date(entry.date),
    y: entry.weight,
  }));
  
  // Calculate trend
  const trend = calculateTrend(sortedData);
  
  return (
    <VictoryChart theme={VictoryTheme.material}>
      <VictoryAxis 
        dependentAxis
        label="Weight (kg)"
      />
      <VictoryAxis 
        label="Date"
        tickFormat={(date) => formatShortDate(date)}
      />
      <VictoryLine
        data={chartData}
        style={{
          data: { stroke: theme.colors.primary, strokeWidth: 2 }
        }}
      />
      <VictoryScatter
        data={chartData}
        size={4}
        style={{
          data: { fill: theme.colors.primary }
        }}
      />
    </VictoryChart>
  );
};
```

**Trend Calculation**:
```typescript
const calculateTrend = (entries: WeightEntry[]): 'increasing' | 'decreasing' | 'stable' => {
  if (entries.length < 2) return 'stable';
  
  const recent = entries.slice(-7); // Last 7 entries
  const first = recent[0].weight;
  const last = recent[recent.length - 1].weight;
  const diff = last - first;
  
  if (Math.abs(diff) < 0.5) return 'stable';
  return diff > 0 ? 'increasing' : 'decreasing';
};
```

### 4. Weekly Summary Reports

#### Data Aggregation

```typescript
interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalCalories: number;
  avgDailyCalories: number;
  totalMeals: number;
  daysLogged: number;
  avgProtein: number;
  avgCarbs: number;
  avgFats: number;
  totalWater: number;
  comparisonToPrevious: {
    calories: number; // percentage change
    meals: number;
    water: number;
  };
}

const calculateWeeklySummary = (
  meals: Meal[],
  waterIntakes: WaterIntake[],
  weekStart: Date
): WeeklySummary => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const weekEndStr = weekEnd.toISOString().split('T')[0];
  
  // Filter data for this week
  const weekMeals = meals.filter(m => 
    m.date >= weekStartStr && m.date <= weekEndStr
  );
  
  const weekWater = waterIntakes.filter(w =>
    w.date >= weekStartStr && w.date <= weekEndStr
  );
  
  // Calculate metrics
  const totalCalories = weekMeals.reduce((sum, m) => sum + m.calories, 0);
  const uniqueDays = new Set(weekMeals.map(m => m.date)).size;
  const avgDailyCalories = uniqueDays > 0 ? totalCalories / uniqueDays : 0;
  
  const totalProtein = weekMeals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = weekMeals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFats = weekMeals.reduce((sum, m) => sum + m.fats, 0);
  
  const avgProtein = uniqueDays > 0 ? totalProtein / uniqueDays : 0;
  const avgCarbs = uniqueDays > 0 ? totalCarbs / uniqueDays : 0;
  const avgFats = uniqueDays > 0 ? totalFats / uniqueDays : 0;
  
  const totalWater = weekWater.reduce((sum, w) => sum + w.amount, 0);
  
  // Calculate previous week for comparison
  const prevWeekStart = new Date(weekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  const prevSummary = calculateWeeklySummary(meals, waterIntakes, prevWeekStart);
  
  return {
    weekStart: weekStartStr,
    weekEnd: weekEndStr,
    totalCalories,
    avgDailyCalories,
    totalMeals: weekMeals.length,
    daysLogged: uniqueDays,
    avgProtein,
    avgCarbs,
    avgFats,
    totalWater,
    comparisonToPrevious: {
      calories: calculatePercentageChange(avgDailyCalories, prevSummary.avgDailyCalories),
      meals: calculatePercentageChange(weekMeals.length, prevSummary.totalMeals),
      water: calculatePercentageChange(totalWater, prevSummary.totalWater),
    },
  };
};
```

**WeeklySummaryCard Component**:
```typescript
interface WeeklySummaryCardProps {
  summary: WeeklySummary;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  isCurrentWeek: boolean;
}
```

### 5. Calendar View Navigation

#### Calendar Component

**Library**: Custom implementation using React Native components

```typescript
interface CalendarViewProps {
  meals: Meal[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onMonthChange: (year: number, month: number) => void;
}

interface CalendarDay {
  date: string;
  mealCount: number;
  totalCalories: number;
  hasStreak: boolean;
  isToday: boolean;
  isSelected: boolean;
}
```

**Calendar Grid**:
```typescript
const generateCalendarDays = (
  year: number,
  month: number,
  meals: Meal[],
  selectedDate: string
): CalendarDay[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  
  const days: CalendarDay[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Add empty days for alignment
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayMeals = meals.filter(m => m.date === date);
    
    days.push({
      date,
      mealCount: dayMeals.length,
      totalCalories: dayMeals.reduce((sum, m) => sum + m.calories, 0),
      hasStreak: false, // Calculate from streak data
      isToday: date === today,
      isSelected: date === selectedDate,
    });
  }
  
  return days;
};
```

### 6. Search and Filter

#### Search Engine

```typescript
interface SearchFilters {
  searchText: string;
  mealTypes: MealType[];
  dateRange: {
    start: string;
    end: string;
  } | null;
  minCalories?: number;
  maxCalories?: number;
}

const searchAndFilterMeals = (
  meals: Meal[],
  filters: SearchFilters
): Meal[] => {
  let filtered = [...meals];
  
  // Text search
  if (filters.searchText) {
    const searchLower = filters.searchText.toLowerCase();
    filtered = filtered.filter(meal =>
      meal.name.toLowerCase().includes(searchLower)
    );
  }
  
  // Meal type filter
  if (filters.mealTypes.length > 0) {
    filtered = filtered.filter(meal =>
      filters.mealTypes.includes(meal.mealType)
    );
  }
  
  // Date range filter
  if (filters.dateRange) {
    filtered = filtered.filter(meal =>
      meal.date >= filters.dateRange.start &&
      meal.date <= filters.dateRange.end
    );
  }
  
  // Calorie range filter
  if (filters.minCalories !== undefined) {
    filtered = filtered.filter(meal => meal.calories >= filters.minCalories);
  }
  if (filters.maxCalories !== undefined) {
    filtered = filtered.filter(meal => meal.calories <= filters.maxCalories);
  }
  
  return filtered;
};
```

**SearchBar Component**:
```typescript
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}
```

**FilterPanel Component**:
```typescript
interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}
```

### 7. Meal Templates

#### Data Structure

```typescript
interface MealTemplate {
  id: string;
  name: string;
  description?: string;
  items: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  createdAt: number;
  lastUsed?: number;
}

// Add to AppState
interface AppState {
  // ... existing fields
  mealTemplates: MealTemplate[];
}
```

#### Template Management

```typescript
const createTemplate = (
  name: string,
  meals: Meal[],
  description?: string
): MealTemplate => {
  return {
    id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    items: meals,
    totalCalories: meals.reduce((sum, m) => sum + m.calories, 0),
    totalProtein: meals.reduce((sum, m) => sum + m.protein, 0),
    totalCarbs: meals.reduce((sum, m) => sum + m.carbs, 0),
    totalFats: meals.reduce((sum, m) => sum + m.fats, 0),
    createdAt: Date.now(),
  };
};

const applyTemplate = (
  template: MealTemplate,
  date?: string
): Meal[] => {
  const now = Date.now();
  const today = date || new Date().toISOString().split('T')[0];
  
  return template.items.map((meal, index) => ({
    ...meal,
    id: `${now + index}-${Math.random().toString(36).substr(2, 9)}`,
    date: today,
    timestamp: now + index,
  }));
};
```

## Data Models

### Updated Meal Interface
```typescript
interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: MealType;
  date: string;
  timestamp: number;
  photoUri?: string;        // NEW
  isFavorite?: boolean;     // NEW
}
```

### Updated AppState
```typescript
interface AppState {
  profile: UserProfile;
  meals: Meal[];
  waterIntakes: WaterIntake[];
  weightEntries: WeightEntry[];
  achievements: Achievement[];
  mealTemplates: MealTemplate[];  // NEW
  theme: ThemeMode;
}
```

## Error Handling

### Photo Capture Errors
- Permission denied → Show settings prompt
- Camera unavailable → Fallback to gallery only
- Storage full → Show error, suggest cleanup
- Image too large → Auto-compress

### Data Errors
- Failed to save → Retry with exponential backoff
- Corrupted data → Fallback to defaults
- Missing data → Show empty states

### Network Errors
- N/A (fully offline app)

## Testing Strategy

### Unit Tests
- Search and filter logic
- Weekly summary calculations
- Trend calculations
- Template creation/application
- Date utilities

### Component Tests
- PhotoPicker permission flow
- Calendar day selection
- Search bar filtering
- Chart rendering with data

### Integration Tests
- End-to-end photo capture and save
- Favorite meal workflow
- Template creation and usage
- Weekly report generation

### Performance Tests
- Search with 1000+ meals
- Calendar rendering with full year
- Chart with 365 data points
- Image loading and caching

## Performance Considerations

### Image Optimization
- Compress images to max 1024x1024
- Use JPEG format with 0.8 quality
- Lazy load images in lists
- Cache image URIs

### Search Optimization
- Debounce search input (300ms)
- Index meals by name for faster search
- Limit results to 100 items
- Virtual list for large result sets

### Chart Optimization
- Limit data points to 90 days by default
- Aggregate data for longer periods
- Use memoization for calculations
- Lazy load chart library

### Calendar Optimization
- Only render visible month
- Memoize day calculations
- Use FlatList for scrolling
- Cache meal counts per day

## Security Considerations

- Photo permissions properly requested
- No sensitive data in photos
- Local storage only (no cloud sync)
- Validate all user inputs
- Sanitize search queries

## Accessibility

- All interactive elements have labels
- Color contrast meets WCAG AA
- Touch targets minimum 44x44
- Screen reader support
- Keyboard navigation (web)

## Dependencies

### New Dependencies
```json
{
  "expo-image-picker": "~15.0.7",
  "expo-file-system": "~18.0.4"
}
```

### Existing Dependencies (Already Installed)
- `victory-native`: For charts
- `@react-navigation/*`: For navigation
- `@react-native-async-storage/async-storage`: For storage

## Migration Strategy

### Data Migration
- No breaking changes to existing data
- New fields are optional
- Backward compatible with Phase 1

### Rollout Plan
1. Deploy photo capture first
2. Add favorites system
3. Implement weight graph
4. Add weekly reports
5. Implement calendar view
6. Add search/filter
7. Add templates last

## Future Enhancements

- Cloud photo backup
- Share meals with friends
- Export reports as PDF
- Meal photo recognition (AI)
- Barcode scanner for packaged foods
- Integration with fitness trackers
- Recipe database
- Meal planning calendar
