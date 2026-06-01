import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../../theme/colors';
import { AVATAR_SIZES } from '../../constants';

interface AvatarProps {
  uri: string;
  size?: keyof typeof AVATAR_SIZES;
  hasStory?: boolean;
  isViewed?: boolean;
  onPress?: () => void;
}

export function Avatar({
  uri,
  size = 'md',
  hasStory = false,
  isViewed = false,
  onPress,
}: AvatarProps) {
  const px = AVATAR_SIZES[size];
  const ringSize = px + 6;
  const borderWidth = size === 'xs' || size === 'sm' ? 1.5 : 2;

  const inner = (
    <View style={[styles.wrapper, { width: ringSize, height: ringSize }]}>
      {hasStory ? (
        isViewed ? (
          <View
            style={[
              styles.ring,
              {
                width: ringSize,
                height: ringSize,
                borderRadius: ringSize / 2,
                borderWidth,
                borderColor: '#BDBDBD',
              },
            ]}
          >
            <Image
              source={{ uri }}
              style={[styles.image, { width: px, height: px, borderRadius: px / 2 }]}
            />
          </View>
        ) : (
          <LinearGradient
            colors={gradients.story as [string, string, ...string[]]}
            start={{ x: 0.2, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.ring,
              {
                width: ringSize,
                height: ringSize,
                borderRadius: ringSize / 2,
                padding: borderWidth,
              },
            ]}
          >
            <View
              style={[
                styles.innerBorder,
                { borderRadius: (ringSize - borderWidth * 2) / 2 },
              ]}
            >
              <Image
                source={{ uri }}
                style={[styles.image, { width: px, height: px, borderRadius: px / 2 }]}
              />
            </View>
          </LinearGradient>
        )
      ) : (
        <Image
          source={{ uri }}
          style={[styles.image, { width: px, height: px, borderRadius: px / 2 }]}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {inner}
      </TouchableOpacity>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerBorder: {
    backgroundColor: 'white',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  image: {
    resizeMode: 'cover',
  },
});
