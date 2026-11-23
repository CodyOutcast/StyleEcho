import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { Image, Pressable, Text, useWindowDimensions, View } from 'react-native';

import { categories, dimensions, samplePiece } from './model';
import type { Category, Inspiration, Outfit, Piece, Profile } from './model';
import { Reveal } from './motion';
import { colors, s } from './theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function Primary({ title, icon = 'arrow-forward', onPress, disabled = false }: {
  title: string;
  icon?: IconName;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={({ pressed }) => [s.primary, disabled && s.primaryOff, pressed && s.press]}>
      <Text style={s.primaryText}>{title}</Text>
      <Ionicons aria-hidden color={colors.white} name={icon} size={17} />
    </Pressable>
  );
}

function Chip({ label, icon, active, disabled, onPress }: {
  label: string;
  icon?: IconName;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" aria-pressed={disabled ? undefined : active} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [s.chip, active && s.chipActive, pressed && s.press]}>
      {icon && <Ionicons aria-hidden name={icon} size={16} color={active ? colors.wine : colors.muted} />}
      <Text style={[s.chipText, active && s.chipActiveText]}>{label}</Text>
    </Pressable>
  );
}

function Intro({ title, description }: { title: string; description: string }) {
  return (
    <View style={s.intro}>
      <Text accessibilityRole="header" style={s.title}>{title}</Text>
      <Text style={s.deck}>{description}</Text>
    </View>
  );
}

function LookCard({ look, selected, height, onPress }: {
  look: Inspiration;
  selected: boolean;
  height: number;
  onPress: () => void;
}) {
  const source = look.source?.hostname.replace(/^www\./, '');
  const photo = (
    <>
      <Image source={look.image} style={s.fullImage} />
      <LinearGradient colors={['transparent', '#1E1513D9']} style={s.gradient} />
      <View style={s.lookCaption}>
        <Text style={s.imageTitle}>{look.name}</Text>
        {source && <Text style={s.imageSource} numberOfLines={1}>{source}</Text>}
      </View>
    </>
  );
  return (
    <Pressable accessibilityRole="checkbox" accessibilityLabel={look.name}
      accessibilityHint={source ? `Imported from ${source}` : undefined}
      aria-checked={selected} onPress={onPress} style={({ pressed }) => [s.lookTile, { height }, pressed && s.press]}>
      {source ? <Reveal style={s.fullImage}>{photo}</Reveal> : photo}
      <View style={[s.selection, selected && s.selectionOn]}>
        {selected && <Ionicons aria-hidden name="checkmark" size={16} color={colors.white} />}
      </View>
    </Pressable>
  );
}

export function Library({ looks, selectedIds, toggle, add, showCues }: {
  looks: Inspiration[];
  selectedIds: string[];
  toggle: (id: string) => void;
  add: () => void;
  showCues: () => void;
}) {
  const [first, second, third, fourth] = looks;
  const { height } = useWindowDimensions();
  const tileHeight = height < 600 ? 106 : height < 650 ? 122 : 139;
  function tile(look: Inspiration) {
    return <LookCard look={look} height={tileHeight} selected={selectedIds.includes(look.id)} onPress={() => toggle(look.id)} />;
  }

  return (
    <>
      <Intro title="Style library" description="Collect inspiration and pick the looks you want to recreate." />
      <View style={[s.between, s.libraryBar]}>
        <Text style={s.section} aria-live="polite">{selectedIds.length} {selectedIds.length === 1 ? 'look' : 'looks'} selected</Text>
        <Pressable accessibilityRole="button" style={s.iconLink} onPress={showCues}>
          <Ionicons aria-hidden name="information-circle-outline" size={16} color={colors.wine} />
          <Text style={s.link}>Style cues</Text>
        </Pressable>
      </View>
      <View style={s.libraryCards}>
        <View style={s.grid}>{tile(first)}{tile(second)}</View>
        <View style={s.grid}>
          {tile(third)}
          {fourth ? tile(fourth) : (
            <Pressable accessibilityRole="button" accessibilityHint="Opens the outfit link form" onPress={add}
              style={({ pressed }) => [s.lookTile, s.addTile, { height: tileHeight }, pressed && s.press]}>
              <View style={s.addIcon}><Ionicons aria-hidden name="add" size={23} color={colors.wine} /></View>
              <Text style={s.link}>Add a look</Text>
            </Pressable>
          )}
        </View>
      </View>
    </>
  );
}

export function StyleProfile({ selected, profile, edit }: {
  selected: Inspiration[];
  profile: Profile | null;
  edit: () => void;
}) {
  const compact = useWindowDimensions().height < 650;
  return (
    <>
      <Intro title="Style profile" description="Four style cues from the looks you picked." />
      {profile ? (
        <>
          <Reveal style={[s.between, s.profileCard, compact && s.profileCardCompact]}>
            <View style={s.grow}>
              <Text style={[s.micro, s.profileTag]}>YOUR STYLE</Text>
              <Text style={s.profileTitle}>{profile.title}</Text>
              <Text style={s.profileCaption}>Based on {selected.length} {selected.length === 1 ? 'saved look' : 'saved looks'}</Text>
            </View>
            <View style={s.profilePhotos}>
              {selected.slice(0, 2).map((look, index) => (
                <Image key={look.id} source={look.image}
                  style={[s.profilePhoto, index ? s.secondPhoto : s.firstPhoto, compact && s.profilePhotoCompact]} />
              ))}
            </View>
          </Reveal>
          <View style={s.between}>
            <Text accessibilityRole="header" style={s.section}>Your style cues</Text>
            <Pressable accessibilityRole="button" style={s.iconLink} onPress={edit}>
              <Text style={s.link}>Edit looks</Text>
            </Pressable>
          </View>
          <Reveal style={s.cueList} delay={110}>
            {profile.cues.map((cue, index) => (
              <View key={cue.key} style={[s.cue, compact && s.cueCompact, index > 0 && s.divided]}>
                <View style={s.cueIcon}><Ionicons aria-hidden name={cue.icon} size={18} color={colors.wine} /></View>
                <View style={s.grow}>
                  <Text style={s.caption}>{cue.label}</Text>
                  <Text style={s.cueValue}>{cue.value}</Text>
                </View>
                <Text style={s.evidence}>{cue.fromFeedback ? 'Your feedback' : `${cue.evidence} of ${selected.length} looks`}</Text>
              </View>
            ))}
          </Reveal>
        </>
      ) : (
        <View style={s.empty}>
          <Text style={s.section}>Start with a look you love</Text>
          <Text style={s.caption}>Select a look in the style library to build your profile.</Text>
          <Primary title="Choose looks" onPress={edit} />
        </View>
      )}
    </>
  );
}

function OutfitPhoto({ outfit, compact }: { outfit: Outfit; compact: boolean }) {
  if (outfit.image) {
    return (
      <View style={[s.outfitImage, compact && s.outfitImageCompact]}>
        <Image accessibilityLabel={`${outfit.name} flat lay`} source={outfit.image}
          style={s.fullImage} resizeMode={compact ? 'contain' : 'cover'} />
      </View>
    );
  }

  return (
    <View style={s.outfitGrid} accessibilityLabel={`Pieces in ${outfit.name}`}>
      {[outfit.pieces.slice(0, 2), outfit.pieces.slice(2)].filter(row => row.length).map(row => (
        <View key={row[0].id} style={s.grid}>
          {row.map(piece => <Image key={piece.id} source={piece.image} style={s.outfitGridImage} />)}
          {row.length === 1 && <View style={s.grow} />}
        </View>
      ))}
    </View>
  );
}

export function Outfits({ outfit, prefersCasual, edit, openPiece, showReasons }: {
  outfit?: Outfit;
  prefersCasual: boolean;
  edit: () => void;
  openPiece: (piece: Piece) => void;
  showReasons: () => void;
}) {
  const compact = useWindowDimensions().height < 650;
  return (
    <>
      <Intro title="Outfit match" description={prefersCasual
        ? 'Casual preference applied to your profile.'
        : 'Recreate your style with clothes you own.'} />
      {outfit ? (
        <Reveal key={outfit.id} style={s.outfitCard}>
          <View style={s.outfitHeader}>
            <Text accessibilityRole="header" aria-live="polite" style={s.outfitName}>{outfit.name}</Text>
            <View style={s.between}>
              <Text style={[s.chipActiveText, s.matchChip]}>{outfit.matches.length} of {dimensions.length} cues match</Text>
              <Pressable accessibilityRole="button" onPress={showReasons}
                style={({ pressed }) => [s.iconLink, pressed && s.press]}>
                <Text style={s.link}>Why it matches</Text>
                <Ionicons aria-hidden name="chevron-forward" size={16} color={colors.wine} />
              </Pressable>
            </View>
          </View>
          <OutfitPhoto outfit={outfit} compact={compact} />
          <View style={s.outfitCloset}>
            <View style={s.between}>
              <Text style={s.section}>From your closet</Text>
              <Text style={s.caption}>{outfit.pieces.length} owned pieces</Text>
            </View>
            <View style={s.wardrobeRow}>
              {outfit.pieces.map(piece => (
                <Pressable key={piece.id} accessibilityRole="button" style={s.miniPiece} onPress={() => openPiece(piece)}>
                  <Image source={piece.image} style={[s.miniPhoto, compact && s.miniPhotoCompact]} />
                  <Text style={s.miniName} numberOfLines={2}>{piece.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Reveal>
      ) : (
        <View style={s.empty}>
          <Text style={s.section}>Let’s find your style first</Text>
          <Text style={s.caption}>Select inspiration to match it with clothes you own.</Text>
          <Primary title="Go to style library" onPress={edit} />
        </View>
      )}
    </>
  );
}

export function Closet({ pieces, filter, setFilter, added, add, showPiece }: {
  pieces: Piece[];
  filter: 'All' | Category;
  setFilter: (value: 'All' | Category) => void;
  added: boolean;
  add: () => void;
  showPiece: (piece: Piece) => void;
}) {
  const visible = filter === 'All' ? pieces : pieces.filter(piece => piece.category === filter);
  return (
    <>
      <Intro title="My closet" description="Clothes you own and can style together." />
      <View style={[s.between, s.libraryBar]}>
        <Text style={s.section} aria-live="polite">{pieces.length} owned pieces</Text>
        <Chip label={added ? 'Piece added' : 'Add a piece'} icon={added ? 'checkmark' : 'add'}
          active={added || undefined} disabled={added} onPress={add} />
      </View>
      <View style={s.filters}>
        {(['All', ...categories] as const).map(category => (
          <Chip key={category} label={category} active={filter === category} onPress={() => setFilter(category)} />
        ))}
      </View>
      <View style={s.closetGrid}>
        {visible.map(piece => {
          const card = (
            <>
              <Image source={piece.image} style={s.closetPhoto} />
              <View style={s.closetCopy}>
                <Text style={s.cueValue}>{piece.name}</Text>
                <Text style={s.caption}>{piece.category} · {piece.tone}</Text>
              </View>
            </>
          );
          return (
            <Pressable key={piece.id} accessibilityRole="button" onPress={() => showPiece(piece)}
              style={({ pressed }) => [s.closetCard, pressed && s.press]}>
              {piece.id === samplePiece.id ? <Reveal>{card}</Reveal> : card}
            </Pressable>
          );
        })}
      </View>
    </>
  );
}
