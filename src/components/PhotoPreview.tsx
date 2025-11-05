import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useApp } from '../context/AppContext';
import { ThemedText } from './Typography';

interface PhotoPreviewProps {
  uri: string;
  onRemove: () => void;
  onEdit: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  uri,
  onRemove,
  onEdit,
  size = 'medium',
}) => {
  const { theme } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [error, setError] = useState(false);

  const sizeMap = {
    small: 80,
    medium: 120,
    large: 200,
  };

  const imageSize = sizeMap[size];

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <>
      <View style={[styles.container, { width: imageSize, height: imageSize }]}>
        {isLoading && (
          <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
          </View>
        )}

        {error ? (
          <View
            style={[
              styles.error,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <ThemedText variant="h2">📷</ThemedText>
            <ThemedText variant="caption" color={theme.colors.textSecondary}>
              Failed to load
            </ThemedText>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setShowFullScreen(true)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri }}
              style={[styles.image, { width: imageSize, height: imageSize }]}
              onLoad={handleImageLoad}
              onError={handleImageError}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {!isLoading && !error && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
              onPress={onEdit}
            >
              <ThemedText variant="caption" color="#FFFFFF">
                ✏️
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
              onPress={onRemove}
            >
              <ThemedText variant="caption" color="#FFFFFF">
                🗑️
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Full Screen Modal */}
      <Modal
        visible={showFullScreen}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFullScreen(false)}
      >
        <TouchableOpacity
          style={styles.fullScreenOverlay}
          activeOpacity={1}
          onPress={() => setShowFullScreen(false)}
        >
          <Image
            source={{ uri }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => setShowFullScreen(false)}
          >
            <ThemedText variant="h3" color={theme.colors.text}>
              ✕
            </ThemedText>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 12,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  error: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  actions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
