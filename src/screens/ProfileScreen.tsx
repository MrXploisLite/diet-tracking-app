import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useApp } from '../context/AppContext';
import { Gender, ActivityLevel } from '../types';
import { calculateBMR, calculateDailyCalories, activityLevelLabels } from '../utils';

export const ProfileScreen: React.FC = () => {
  const { theme, profile, setProfile, toggleTheme, resetProfile } = useApp();

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age?.toString() || '');
  const [weight, setWeight] = useState(profile.weight?.toString() || '');
  const [height, setHeight] = useState(profile.height?.toString() || '');
  const [gender, setGender] = useState<Gender | ''>(profile.gender || '');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>(profile.activityLevel || '');
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setName(profile.name);
    setAge(profile.age?.toString() || '');
    setWeight(profile.weight?.toString() || '');
    setHeight(profile.height?.toString() || '');
    setGender(profile.gender || '');
    setActivityLevel(profile.activityLevel || '');
  }, [profile]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    const ageNum = parseFloat(age);
    if (!age || isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      newErrors.age = 'Please enter a valid age (0-150)';
    }

    const weightNum = parseFloat(weight);
    if (!weight || isNaN(weightNum) || weightNum <= 0 || weightNum > 500) {
      newErrors.weight = 'Please enter a valid weight (kg)';
    }

    const heightNum = parseFloat(height);
    if (!height || isNaN(heightNum) || heightNum <= 0 || heightNum > 300) {
      newErrors.height = 'Please enter a valid height (cm)';
    }

    if (!gender) {
      newErrors.gender = 'Please select a gender';
    }

    if (!activityLevel) {
      newErrors.activityLevel = 'Please select an activity level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    const bmr = calculateBMR(weightNum, heightNum, ageNum, gender as Gender);
    const targetCalories = calculateDailyCalories(bmr, activityLevel as ActivityLevel);

    const updatedProfile = {
      name: name.trim(),
      age: ageNum,
      weight: weightNum,
      height: heightNum,
      gender: gender as Gender,
      activityLevel: activityLevel as ActivityLevel,
      targetCalories,
      targetProtein: profile.targetProtein,
      targetCarbs: profile.targetCarbs,
      targetFats: profile.targetFats,
    };

    try {
      await setProfile(updatedProfile);
      setIsEditing(false);
      setErrors({});
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Profile',
      'Do you want to clear your meal history as well?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Keep Meals',
          onPress: async () => {
            await resetProfile(false);
            setIsEditing(false);
            setErrors({});
            Alert.alert('Success', 'Profile reset successfully!');
          },
        },
        {
          text: 'Clear All',
          onPress: async () => {
            await resetProfile(true);
            setIsEditing(false);
            setErrors({});
            Alert.alert('Success', 'Profile and meals cleared!');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getComputedBMR = (): number | null => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (
      !isNaN(ageNum) &&
      !isNaN(weightNum) &&
      !isNaN(heightNum) &&
      ageNum > 0 &&
      weightNum > 0 &&
      heightNum > 0 &&
      gender
    ) {
      return calculateBMR(weightNum, heightNum, ageNum, gender as Gender);
    }
    return null;
  };

  const getComputedDailyGoal = (): number | null => {
    const bmr = getComputedBMR();
    if (bmr && activityLevel) {
      return calculateDailyCalories(bmr, activityLevel as ActivityLevel);
    }
    return null;
  };

  const bmr = getComputedBMR();
  const dailyGoal = getComputedDailyGoal();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }, theme.typography.h1]}>
            Profile
          </Text>
          {!isEditing ? (
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={[styles.editButtonText, { color: '#FFFFFF' }]}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => {
                setIsEditing(false);
                setErrors({});
                setName(profile.name);
                setAge(profile.age?.toString() || '');
                setWeight(profile.weight?.toString() || '');
                setHeight(profile.height?.toString() || '');
                setGender(profile.gender || '');
                setActivityLevel(profile.activityLevel || '');
              }}
            >
              <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }, theme.typography.h3]}>
            Personal Information
          </Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Name</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.background, 
                  color: theme.colors.text,
                  borderColor: errors.name ? theme.colors.error : theme.colors.border,
                },
                !isEditing && styles.inputDisabled,
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={theme.colors.textSecondary}
              editable={isEditing}
            />
            {errors.name && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.name}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Age</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.background, 
                  color: theme.colors.text,
                  borderColor: errors.age ? theme.colors.error : theme.colors.border,
                },
                !isEditing && styles.inputDisabled,
              ]}
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
              editable={isEditing}
            />
            {errors.age && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.age}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Weight (kg)</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.background, 
                  color: theme.colors.text,
                  borderColor: errors.weight ? theme.colors.error : theme.colors.border,
                },
                !isEditing && styles.inputDisabled,
              ]}
              value={weight}
              onChangeText={setWeight}
              placeholder="Enter your weight"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="decimal-pad"
              editable={isEditing}
            />
            {errors.weight && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.weight}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Height (cm)</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.background, 
                  color: theme.colors.text,
                  borderColor: errors.height ? theme.colors.error : theme.colors.border,
                },
                !isEditing && styles.inputDisabled,
              ]}
              value={height}
              onChangeText={setHeight}
              placeholder="Enter your height"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="decimal-pad"
              editable={isEditing}
            />
            {errors.height && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.height}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Gender</Text>
            <View 
              style={[
                styles.pickerContainer, 
                { 
                  backgroundColor: theme.colors.background,
                  borderColor: errors.gender ? theme.colors.error : theme.colors.border,
                },
                !isEditing && styles.inputDisabled,
              ]}
            >
              <Picker
                selectedValue={gender}
                onValueChange={(value) => setGender(value)}
                style={[styles.picker, { color: theme.colors.text }]}
                enabled={isEditing}
              >
                <Picker.Item label="Select gender..." value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
            </View>
            {errors.gender && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.gender}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Activity Level</Text>
            <View 
              style={[
                styles.pickerContainer, 
                { 
                  backgroundColor: theme.colors.background,
                  borderColor: errors.activityLevel ? theme.colors.error : theme.colors.border,
                },
                !isEditing && styles.inputDisabled,
              ]}
            >
              <Picker
                selectedValue={activityLevel}
                onValueChange={(value) => setActivityLevel(value)}
                style={[styles.picker, { color: theme.colors.text }]}
                enabled={isEditing}
              >
                <Picker.Item label="Select activity level..." value="" />
                <Picker.Item label={activityLevelLabels.sedentary} value="sedentary" />
                <Picker.Item label={activityLevelLabels.lightly_active} value="lightly_active" />
                <Picker.Item label={activityLevelLabels.moderately_active} value="moderately_active" />
                <Picker.Item label={activityLevelLabels.very_active} value="very_active" />
                <Picker.Item label={activityLevelLabels.extra_active} value="extra_active" />
              </Picker>
            </View>
            {errors.activityLevel && <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.activityLevel}</Text>}
          </View>
        </View>

        {bmr !== null && (
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }, theme.typography.h3]}>
              Calculated Metrics
            </Text>

            <View style={styles.metricRow}>
              <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                Basal Metabolic Rate (BMR)
              </Text>
              <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
                {Math.round(bmr)} cal/day
              </Text>
            </View>

            {dailyGoal !== null && (
              <View style={[styles.metricRow, styles.metricDivider, { borderTopColor: theme.colors.border }]}>
                <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
                  Daily Calorie Goal
                </Text>
                <Text style={[styles.metricValue, { color: theme.colors.success }]}>
                  {dailyGoal} cal/day
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }, theme.typography.h3]}>
            Settings
          </Text>

          <View style={styles.settingRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Theme</Text>
            <View style={styles.themeToggle}>
              <Text style={[styles.themeLabel, { color: theme.colors.text }]}>
                {theme.mode === 'light' ? '☀️ Light' : '🌙 Dark'}
              </Text>
              <Switch
                value={theme.mode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {isEditing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: theme.colors.error }]}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset Profile</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    flex: 1,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  metricDivider: {
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 20,
  },
  metricLabel: {
    fontSize: 16,
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 8,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
