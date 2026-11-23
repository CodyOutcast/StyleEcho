import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Image, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { dimensions } from './model';
import type { Outfit, Piece } from './model';
import { Primary } from './screens';
import type { IconName } from './screens';
import { colors, s } from './theme';

export function Sheet({ title, bottom, close, children }: {
  title: string;
  bottom: number;
  close: () => void;
  children: ReactNode;
}) {
  return (
    <Modal visible transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.backdrop}>
        <Pressable aria-hidden style={StyleSheet.absoluteFill} onPress={close} />
        <View accessibilityViewIsModal style={[s.sheet, { paddingBottom: Math.max(bottom, 8) }]}>
          <View style={s.between}>
            <Text accessibilityRole="header" style={s.sheetTitle}>{title}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Close dialog" style={s.iconButton} onPress={close}>
              <Ionicons aria-hidden name="close" size={21} color={colors.wine} />
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" style={s.sheetScroll} contentContainerStyle={s.sheetBody}>
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function LookLinkForm({ submit }: { submit: (source: URL) => void }) {
  const [link, setLink] = useState('https://www.pexels.com/photo/18568121/');
  const [invalid, setInvalid] = useState(false);

  function importLink() {
    let source: URL | undefined;
    try {
      source = new URL(link.trim());
    } catch {
      // A malformed link stays in the form so it can be corrected.
    }
    if (!source || !['http:', 'https:'].includes(source.protocol) || !source.hostname || /\s/.test(link.trim())) {
      setInvalid(true);
      return;
    }
    Keyboard.dismiss();
    submit(source);
  }

  return (
    <>
      <Text style={s.body}>Paste a link to an outfit photo or post.</Text>
      <View style={s.linkField}>
        <Text style={s.cueValue}>Outfit link</Text>
        <View style={s.linkInputFrame}>
          <Ionicons aria-hidden name="link-outline" size={20} color={colors.wine} />
          <TextInput accessibilityLabel="Outfit link" inputMode="url" returnKeyType="go"
            style={s.linkInput} autoCapitalize="none" autoCorrect={false} value={link}
            placeholder="https://" placeholderTextColor={colors.muted}
            onChangeText={value => { setLink(value); setInvalid(false); }} onSubmitEditing={importLink} />
        </View>
        {invalid
          ? <Text style={s.linkError} accessibilityRole="alert">Enter a link that starts with https:// or http://.</Text>
          : <Text style={s.caption}>A sample link is ready for this demo.</Text>}
      </View>
      <Primary title="Analyze look" icon="sparkles-outline" onPress={importLink} />
    </>
  );
}

export function SheetOption({ icon, title, onPress }: {
  icon: IconName;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}
      style={({ pressed }) => [s.sheetOption, pressed && s.press]}>
      <View style={s.cueIcon}><Ionicons aria-hidden name={icon} size={19} color={colors.wine} /></View>
      <Text style={[s.cueValue, s.grow]}>{title}</Text>
      <Ionicons aria-hidden name="chevron-forward" size={16} color={colors.wine} />
    </Pressable>
  );
}

export function StyleCues() {
  return dimensions.map(cue => (
    <View key={cue.key} style={s.sheetOption}>
      <View style={s.cueIcon}><Ionicons aria-hidden name={cue.icon} size={18} color={colors.wine} /></View>
      <View style={s.grow}>
        <Text style={s.cueValue}>{cue.label}</Text>
        <Text style={s.caption}>{cue.question}</Text>
      </View>
    </View>
  ));
}

export function MatchReasons({ outfit }: { outfit: Outfit }) {
  return (
    <>
      <Text style={s.caption}>{outfit.name} · {outfit.matches.length} of {dimensions.length} cues match</Text>
      {dimensions.map((cue, index) => {
        const matches = outfit.matches.some(match => match.key === cue.key);
        return (
          <View key={cue.key} style={s.sheetOption}>
            <View style={s.cueIcon}>
              <Ionicons accessibilityLabel={matches ? 'Matches your profile' : 'Alternative cue'}
                name={matches ? 'checkmark' : 'ellipse-outline'} size={18} color={colors.wine} />
            </View>
            <View style={s.grow}>
              <Text style={s.cueValue}>{cue.label} · {outfit.traits[cue.key]}</Text>
              <Text style={s.caption}>{outfit.reasons[index]}</Text>
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
      <Image source={piece.image} style={s.pieceDetailImage} resizeMode="contain" />
      <Text style={s.body}>{piece.category} · {piece.tone} · In your closet</Text>
    </>
  );
}
