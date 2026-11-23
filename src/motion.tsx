import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ActivityIndicator, Animated, Easing, Image, Platform, Text, View } from 'react-native';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

import { colors, styles } from './theme';

export const tasks = {
  importLook: {
    title: 'Saving your outfit reference',
    duration: 2700,
    steps: ['Preparing the reference', 'Loading the sample preview', 'Adding the look to your library'],
  },
  buildProfile: {
    title: 'Building your profile',
    duration: 2100,
    steps: ['Comparing your saved looks', 'Finding recurring style cues', 'Building your style profile'],
  },
  addPiece: {
    title: 'Adding to your closet',
    duration: 2100,
    steps: ['Loading the sample photo', 'Preparing garment details', 'Adding the piece to your closet'],
  },
  generateOutfit: {
    title: 'Finding an outfit',
    duration: 2400,
    steps: ['Checking your closet', 'Matching your style cues', 'Putting the outfit together'],
  },
  updateOutfit: {
    title: 'Restyling your outfit',
    duration: 2100,
    steps: ['Applying your preference', 'Reworking the outfit', 'Updating your style profile'],
  },
} as const;

export type Task = keyof typeof tasks;

export function Reveal({
  children,
  style,
  delay = 0,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const reveal = Animated.timing(progress, {
      toValue: 1,
      duration: 280,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });
    reveal.start();
    return () => reveal.stop();
  }, [delay, progress]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

export function TaskProgress({
  task,
  media,
  complete,
}: {
  task: Task;
  media: ImageSourcePropType[];
  complete: () => void;
}) {
  const { title, steps, duration } = tasks[task];
  const progress = useRef(new Animated.Value(0)).current;
  const [step, setStep] = useState(0);

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: false,
      isInteraction: false,
    });
    animation.start();

    const stageTimers = steps
      .slice(1)
      .map((_, index) => setTimeout(() => setStep(index + 1), ((index + 1) * duration) / steps.length));
    const finishTimer = setTimeout(complete, duration + 75);
    return () => {
      animation.stop();
      stageTimers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, [complete, duration, progress, steps]);

  const scan = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-16, 76, -16],
  });

  return (
    <>
      <View style={styles.progressPreview} aria-hidden>
        {media.map((image, index) => (
          <View key={index} style={styles.progressThumb}>
            <Image source={image} style={styles.fullImage} />
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: scan }] }]}>
              <LinearGradient colors={['#BB527400', '#BB527465', '#BB527400']} style={styles.fullImage} />
              <View style={styles.scanRule} />
            </Animated.View>
          </View>
        ))}
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={title}
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={step + 1}
        aria-valuetext={steps[step]}
        style={styles.progressTrack}
      >
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progress.interpolate({ inputRange: [0, 1], outputRange: ['5%', '100%'] }),
            },
          ]}
        />
      </View>
      <View style={styles.progressSteps}>
        {steps.map((label, index) => {
          const marker = index < step ? 'checkmark-circle' : 'ellipse-outline';
          return (
            <View key={label} style={styles.progressStep}>
              <View style={styles.progressMarker} aria-hidden>
                {index === step ? (
                  <ActivityIndicator size="small" color={colors.wine} />
                ) : (
                  <Ionicons name={marker} size={17} color={index < step ? colors.wine : colors.muted} />
                )}
              </View>
              <Text style={[styles.caption, index === step && styles.progressActive]}>{label}</Text>
            </View>
          );
        })}
      </View>
    </>
  );
}
