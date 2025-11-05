import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { CartesianChart, Line, Bar } from 'victory-native';
import { useApp } from '../context/AppContext';
import { SegmentedControl, EmptyState } from '../components';
import { useProgressData, TimeRange } from '../hooks';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 32;

export const ProgressScreen: React.FC = () => {
  const { theme, meals } = useApp();
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const progressData = useProgressData(meals, timeRange);

  const chartData = useMemo(() => {
    switch (timeRange) {
      case 'daily': {
        const data = progressData.daily.slice(-30);
        return data.map((d, index) => ({
          x: index,
          y: d.calories,
          label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          date: d.date,
        }));
      }
      case 'weekly': {
        return progressData.weekly.map((w, index) => ({
          x: index,
          y: w.calories,
          label: `W${index + 1}`,
          date: w.weekStart,
        }));
      }
      case 'monthly': {
        return progressData.monthly.map((m, index) => ({
          x: index,
          y: m.calories,
          label: new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
          date: m.month,
        }));
      }
    }
  }, [timeRange, progressData]);

  const hasData = chartData.some(d => d.y > 0);

  const handleSegmentChange = (index: number) => {
    const ranges: TimeRange[] = ['daily', 'weekly', 'monthly'];
    setTimeRange(ranges[index]);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    
    if (timeRange === 'monthly') {
      return new Date(dateStr + '-01').toLocaleDateString('en-US', { 
        month: 'short',
        year: 'numeric',
      });
    }
    
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }, theme.typography.h1]}>
          Progress Analytics
        </Text>

        <View style={styles.segmentedControlContainer}>
          <SegmentedControl
            segments={['Daily', 'Weekly', 'Monthly']}
            selectedIndex={['daily', 'weekly', 'monthly'].indexOf(timeRange)}
            onIndexChange={handleSegmentChange}
          />
        </View>

        {!hasData ? (
          <View style={styles.emptyStateContainer}>
            <EmptyState
              title="No Data Yet"
              message="Start tracking your meals to see progress analytics"
              icon="📊"
            />
          </View>
        ) : (
          <>
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }, theme.typography.h3]}>
                Calorie Trend
              </Text>
              
              <View style={styles.chartContainer}>
                {timeRange === 'daily' ? (
                  <CartesianChart
                    data={chartData}
                    xKey="x"
                    yKeys={['y']}
                    padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
                    domain={{ y: [0, Math.max(...chartData.map(d => d.y)) * 1.1] }}
                    domainPadding={{ left: 20, right: 20, top: 20, bottom: 20 }}
                  >
                    {({ points }) => (
                      <Line
                        points={points.y}
                        color={theme.colors.primary}
                        strokeWidth={2}
                        curveType="natural"
                      />
                    )}
                  </CartesianChart>
                ) : (
                  <CartesianChart
                    data={chartData}
                    xKey="x"
                    yKeys={['y']}
                    padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
                    domain={{ y: [0, Math.max(...chartData.map(d => d.y)) * 1.1] }}
                    domainPadding={{ left: 30, right: 30, top: 20, bottom: 20 }}
                  >
                    {({ points, chartBounds }) => (
                      <Bar
                        points={points.y}
                        chartBounds={chartBounds}
                        color={theme.colors.primary}
                        roundedCorners={{ topLeft: 4, topRight: 4 }}
                      />
                    )}
                  </CartesianChart>
                )}
              </View>
              
              <View style={styles.xAxisLabels}>
                {chartData.length > 0 && (
                  <>
                    <Text style={[styles.axisLabel, { color: theme.colors.textSecondary }]}>
                      {chartData[0].label}
                    </Text>
                    <Text style={[styles.axisLabel, { color: theme.colors.textSecondary }]}>
                      {chartData[chartData.length - 1].label}
                    </Text>
                  </>
                )}
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }, theme.typography.h3]}>
                Summary Statistics
              </Text>
              
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                    Total Calories
                  </Text>
                  <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                    {formatNumber(progressData.summary.total)}
                  </Text>
                </View>

                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                    {timeRange === 'daily' ? 'Daily Average' : timeRange === 'weekly' ? 'Weekly Average' : 'Monthly Average'}
                  </Text>
                  <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                    {formatNumber(progressData.summary.average)}
                  </Text>
                </View>

                {progressData.summary.best && (
                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                      Best Day
                    </Text>
                    <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                      {formatNumber(progressData.summary.best.value)}
                    </Text>
                    <Text style={[styles.summaryDate, { color: theme.colors.textSecondary }]}>
                      {formatDateLabel(progressData.summary.best.date)}
                    </Text>
                  </View>
                )}

                {progressData.summary.worst && (
                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                      Lowest Day
                    </Text>
                    <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>
                      {formatNumber(progressData.summary.worst.value)}
                    </Text>
                    <Text style={[styles.summaryDate, { color: theme.colors.textSecondary }]}>
                      {formatDateLabel(progressData.summary.worst.date)}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }, theme.typography.h3]}>
                Detailed Breakdown
              </Text>
              
              {timeRange === 'daily' && (
                <View style={styles.detailList}>
                  {progressData.daily.slice(-7).reverse().map((day) => (
                    <View key={day.date} style={styles.detailRow}>
                      <View style={styles.detailLeft}>
                        <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric',
                          })}
                        </Text>
                        <Text style={[styles.detailSubLabel, { color: theme.colors.textSecondary }]}>
                          {day.mealCount} {day.mealCount === 1 ? 'meal' : 'meals'}
                        </Text>
                      </View>
                      <Text style={[styles.detailValue, { color: theme.colors.primary }]}>
                        {formatNumber(day.calories)} cal
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {timeRange === 'weekly' && (
                <View style={styles.detailList}>
                  {progressData.weekly.slice(-4).reverse().map((week, index) => (
                    <View key={week.weekStart} style={styles.detailRow}>
                      <View style={styles.detailLeft}>
                        <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
                          Week {progressData.weekly.length - index}
                        </Text>
                        <Text style={[styles.detailSubLabel, { color: theme.colors.textSecondary }]}>
                          {formatDateLabel(week.weekStart)} - {formatDateLabel(week.weekEnd)}
                        </Text>
                      </View>
                      <View style={styles.detailRight}>
                        <Text style={[styles.detailValue, { color: theme.colors.primary }]}>
                          {formatNumber(week.calories)} cal
                        </Text>
                        <Text style={[styles.detailSubValue, { color: theme.colors.textSecondary }]}>
                          {formatNumber(week.averageDaily)}/day
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {timeRange === 'monthly' && (
                <View style={styles.detailList}>
                  {progressData.monthly.slice(-6).reverse().map((month) => (
                    <View key={month.month} style={styles.detailRow}>
                      <View style={styles.detailLeft}>
                        <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
                          {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                            month: 'long',
                            year: 'numeric',
                          })}
                        </Text>
                        <Text style={[styles.detailSubLabel, { color: theme.colors.textSecondary }]}>
                          {month.mealCount} {month.mealCount === 1 ? 'meal' : 'meals'}
                        </Text>
                      </View>
                      <View style={styles.detailRight}>
                        <Text style={[styles.detailValue, { color: theme.colors.primary }]}>
                          {formatNumber(month.calories)} cal
                        </Text>
                        <Text style={[styles.detailSubValue, { color: theme.colors.textSecondary }]}>
                          {formatNumber(month.averageDaily)}/day
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    marginBottom: 16,
  },
  segmentedControlContainer: {
    marginBottom: 24,
  },
  emptyStateContainer: {
    marginTop: 60,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
  },
  chartContainer: {
    height: 250,
    marginVertical: 8,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  axisLabel: {
    fontSize: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  summaryItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  summaryDate: {
    fontSize: 12,
  },
  detailList: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  detailLeft: {
    flex: 1,
  },
  detailRight: {
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  detailSubLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailSubValue: {
    fontSize: 12,
    marginTop: 2,
  },
});
