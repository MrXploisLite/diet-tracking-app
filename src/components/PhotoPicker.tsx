import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';
import { ThemedText, Heading3, BodyText } from './Typography';
import { Button } from './Button';

interface PhotoPickerProps {
  visible: boolean;
  onPhotoSelected: (uri: string) => void;
  onCancel: () => void;
  existingPhoto?: string;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  visible,
  onPhotoSelected,
  onCancel,
  existingPhoto,
}) => {
  const { theme } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = async (type: 'camera' | 'library') => {
    try {
      if (type === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Camera permission is required to take photos. Please enable it in your device settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => ImagePicker.requestCameraPermissionsAsync() },
            ]
          );
          return false;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Photo library permission is required to select photos. Please enable it in your device settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync() },
            ]
          );
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermission('camera');
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotoSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickFromGallery = async () => {
    const hasPermission = await requestPermission('library');
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotoSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            <Heading3 style={styles.title} color={theme.colors.text}>
              {existingPhoto ? 'Update Photo' : 'Add Photo'}
            </Heading3>

            <BodyText
              color={theme.colors.textSecondary}
              style={styles.description}
            >
              Choose how you'd like to add a photo to your meal
            </BodyText>

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.option, { backgroundColor: theme.colors.background }]}
                onPress={handleTakePhoto}
                disabled={isLoading}
              >
                <ThemedText variant="h2" style={styles.optionIcon}>
                  📷
                </ThemedText>
                <ThemedText variant="bodyBold" color={theme.colors.text}>
                  Take Photo
                </ThemedText>
                <BodyText
                  color={theme.colors.textSecondary}
                  style={styles.optionDescription}
                >
                  Use your camera
                </BodyText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.option, { backgroundColor: theme.colors.background }]}
                onPress={handlePickFromGallery}
                disabled={isLoading}
              >
                <ThemedText variant="h2" style={styles.optionIcon}>
                  🖼️
                </ThemedText>
                <ThemedText variant="bodyBold" color={theme.colors.text}>
                  Choose from Gallery
                </ThemedText>
                <BodyText
                  color={theme.colors.textSecondary}
                  style={styles.optionDescription}
                >
                  Select existing photo
                </BodyText>
              </TouchableOpacity>
            </View>

            <Button
              title="Cancel"
              onPress={onCancel}
              variant="outline"
              disabled={isLoading}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  option: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
