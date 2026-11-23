import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { dimensions } from './model';
import type { Outfit, Piece } from './model';
import { sampleLookUrl } from './sample-data';
import { Primary } from './screens';
import { colors, styles } from './theme';

export function Sheet({
  title,
  bottom,
  close,
  children,
}: {
  title: string;
  bottom: number;
  close: () => void;
  children: ReactNode;
}) {
  return (
    <Modal visible transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.backdrop}>
        <Pressable aria-hidden style={StyleSheet.absoluteFill} onPress={close} />
        <View accessibilityViewIsModal style={[styles.sheet, { paddingBottom: Math.max(bottom, 8) }]}>
          <View style={styles.between}>
            <Text accessibilityRole="header" style={styles.sheetTitle}>
              {title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
              style={styles.iconButton}
              onPress={close}
            >
              <Ionicons aria-hidden name="close" size={21} color={colors.wine} />
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetBody}
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function LookLinkForm({ submit }: { submit: (source: URL) => void }) {
  const [link, setLink] = useState(sampleLookUrl);
  const [invalid, setInvalid] = useState(false);

  function importLink() {
    const address = link.trim();
    let source: URL | undefined;
    try {
      source = new URL(address);
    } catch {
      // A malformed link stays in the form so it can be corrected.
    }
    if (!source || !['http:', 'https:'].includes(source.protocol) || !source.hostname || /\s/.test(address)) {
      setInvalid(true);
      return;
    }
    Keyboard.dismiss();
    submit(source);
  }

  return (
    <>
      <Text style={styles.body}>Paste a link to an outfit photo or post.</Text>
      <View style={styles.linkField}>
        <Text style={styles.cueValue}>Outfit link</Text>
        <View style={styles.linkInputFrame}>
          <Ionicons aria-hidden name="link-outline" size={20} color={colors.wine} />
          <TextInput
            accessibilityLabel="Outfit link"
            inputMode="url"
            returnKeyType="go"
            style={styles.linkInput}
            autoCapitalize="none"
            autoCorrect={false}
            value={link}
            placeholder="https://"
            placeholderTextColor={colors.muted}
            onChangeText={value => {
              setLink(value);
              setInvalid(false);
            }}
            onSubmitEditing={importLink}
          />
        </View>
        {invalid ? (
          <Text style={styles.linkError} accessibilityRole="alert">
            Enter a link that starts with https:// or http://.
          </Text>
        ) : (
          <Text style={styles.caption}>Link previews use bundled sample images.</Text>
        )}
      </View>
      <Primary title="Save outfit link" icon="bookmark-outline" onPress={importLink} />
    </>
  );
}

export function StyleCues() {
  return dimensions.map(cue => (
    <View key={cue.key} style={styles.sheetOption}>
      <View style={styles.cueIcon}>
        <Ionicons aria-hidden name={cue.icon} size={18} color={colors.wine} />
      </View>
      <View style={styles.grow}>
        <Text style={styles.cueValue}>{cue.label}</Text>
        <Text style={styles.caption}>{cue.question}</Text>
      </View>
    </View>
  ));
}

export function MatchReasons({ outfit }: { outfit: Outfit }) {
  return (
    <>
      <Text style={styles.caption}>
        {outfit.name} · {outfit.matches.length} of {dimensions.length} cues match
      </Text>
      {dimensions.map(cue => {
        const matches = outfit.matches.some(match => match.key === cue.key);
        return (
          <View key={cue.key} style={styles.sheetOption}>
            <View style={styles.cueIcon}>
              <Ionicons
                accessibilityLabel={matches ? 'Matches your profile' : 'Alternative cue'}
                name={matches ? 'checkmark' : 'ellipse-outline'}
                size={18}
                color={colors.wine}
              />
            </View>
            <View style={styles.grow}>
              <Text style={styles.cueValue}>
                {cue.label} · {outfit.traits[cue.key]}
              </Text>
              <Text style={styles.caption}>{outfit.reasons[cue.key]}</Text>
            </View>
          </View>
        );
      })}
    </>
  );
}

export function PieceDetails({ piece }: { piece: Piece }) {
  return (
    <>
      <Image source={piece.image} style={styles.pieceDetailImage} resizeMode="contain" />
      <Text style={styles.body}>
        {piece.category} · {piece.tone} · In your closet
      </Text>
    </>
  );
}
