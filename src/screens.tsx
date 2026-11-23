import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { Image, Pressable, Text, useWindowDimensions, View } from 'react-native';

import { categories, dimensions } from './model';
import type { Category, Inspiration, Outfit, Piece, Profile } from './model';
import { Reveal } from './motion';
import { colors, styles } from './theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

export function Primary({
  title,
  icon = 'arrow-forward',
  onPress,
  disabled = false,
}: {
  title: string;
  icon?: IconName;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.primary, disabled && styles.primaryOff, pressed && styles.press]}
    >
      <Text style={styles.primaryText}>{title}</Text>
      <Ionicons aria-hidden color={colors.white} name={icon} size={17} />
    </Pressable>
  );
}

function Chip({
  label,
  icon,
  active,
  disabled,
  onPress,
}: {
  label: string;
  icon?: IconName;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      aria-pressed={disabled ? undefined : active}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.press]}
    >
      {icon && <Ionicons aria-hidden name={icon} size={16} color={active ? colors.wine : colors.muted} />}
      <Text style={[styles.chipText, active && styles.chipActiveText]}>{label}</Text>
    </Pressable>
  );
}

function Intro({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.intro}>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Text style={styles.deck}>{description}</Text>
    </View>
  );
}

function LookCard({
  look,
  selected,
  height,
  onPress,
}: {
  look: Inspiration;
  selected: boolean;
  height: number;
  onPress: () => void;
}) {
  const source = look.source?.hostname.replace(/^www\./, '');
  const photo = (
    <>
      <Image source={look.image} style={styles.fullImage} />
      <LinearGradient colors={['transparent', '#1E1513D9']} style={styles.gradient} />
      <View style={styles.lookCaption}>
        <Text style={styles.imageTitle}>{look.name}</Text>
        {source && (
          <Text style={styles.imageSource} numberOfLines={1}>
            {source}
          </Text>
        )}
      </View>
    </>
  );
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={look.name}
      accessibilityHint={source ? `Imported from ${source}` : undefined}
      aria-checked={selected}
      onPress={onPress}
      style={({ pressed }) => [styles.lookTile, { height }, pressed && styles.press]}
    >
      {source ? <Reveal style={styles.fullImage}>{photo}</Reveal> : photo}
      <View style={[styles.selection, selected && styles.selectionOn]}>
        {selected && <Ionicons aria-hidden name="checkmark" size={16} color={colors.white} />}
      </View>
    </Pressable>
  );
}

export function Library({
  looks,
  selectedIds,
  canAddLook,
  toggle,
  add,
  showCues,
}: {
  looks: Inspiration[];
  selectedIds: string[];
  canAddLook: boolean;
  toggle: (id: string) => void;
  add: () => void;
  showCues: () => void;
}) {
  const { height } = useWindowDimensions();
  const tileHeight = height < 600 ? 106 : height < 650 ? 122 : 139;
  return (
    <>
      <Intro
        title="Style library"
        description="Collect inspiration and pick the looks you want to recreate."
      />
      <View style={[styles.between, styles.libraryBar]}>
        <Text style={styles.section} aria-live="polite">
          {selectedIds.length} {selectedIds.length === 1 ? 'look' : 'looks'} selected
        </Text>
        <Pressable accessibilityRole="button" style={styles.iconLink} onPress={showCues}>
          <Ionicons aria-hidden name="information-circle-outline" size={16} color={colors.wine} />
          <Text style={styles.link}>Style cues</Text>
        </Pressable>
      </View>
      <View style={styles.libraryCards}>
        {looks.map(look => (
          <LookCard
            key={look.id}
            look={look}
            height={tileHeight}
            selected={selectedIds.includes(look.id)}
            onPress={() => toggle(look.id)}
          />
        ))}
        {canAddLook && (
          <Pressable
            accessibilityRole="button"
            accessibilityHint="Opens the outfit link form"
            onPress={add}
            style={({ pressed }) => [
              styles.lookTile,
              styles.addTile,
              { height: tileHeight },
              pressed && styles.press,
            ]}
          >
            <View style={styles.addIcon}>
              <Ionicons aria-hidden name="add" size={23} color={colors.wine} />
            </View>
            <Text style={styles.link}>Add a look</Text>
          </Pressable>
        )}
      </View>
    </>
  );
}

export function StyleProfile({
  selected,
  profile,
  edit,
}: {
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
          <Reveal style={[styles.between, styles.profileCard, compact && styles.profileCardCompact]}>
            <View style={styles.grow}>
              <Text style={[styles.micro, styles.profileTag]}>YOUR STYLE</Text>
              <Text style={styles.profileTitle}>{profile.title}</Text>
              <Text style={styles.profileCaption}>
                Based on {selected.length} {selected.length === 1 ? 'saved look' : 'saved looks'}
              </Text>
            </View>
            <View style={styles.profilePhotos}>
              {selected.slice(0, 2).map((look, index) => (
                <Image
                  key={look.id}
                  source={look.image}
                  style={[
                    styles.profilePhoto,
                    index ? styles.secondPhoto : styles.firstPhoto,
                    compact && styles.profilePhotoCompact,
                  ]}
                />
              ))}
            </View>
          </Reveal>
          <View style={styles.between}>
            <Text accessibilityRole="header" style={styles.section}>
              Your style cues
            </Text>
            <Pressable accessibilityRole="button" style={styles.iconLink} onPress={edit}>
              <Text style={styles.link}>Edit looks</Text>
            </Pressable>
          </View>
          <Reveal style={styles.cueList} delay={110}>
            {profile.cues.map((cue, index) => (
              <View
                key={cue.key}
                style={[styles.cue, compact && styles.cueCompact, index > 0 && styles.divided]}
              >
                <View style={styles.cueIcon}>
                  <Ionicons aria-hidden name={cue.icon} size={18} color={colors.wine} />
                </View>
                <View style={styles.grow}>
                  <Text style={styles.caption}>{cue.label}</Text>
                  <Text style={styles.cueValue}>{cue.value}</Text>
                </View>
                <Text style={styles.evidence}>
                  {cue.fromFeedback ? 'Your feedback' : `${cue.supportingLooks} of ${selected.length} looks`}
                </Text>
              </View>
            ))}
          </Reveal>
        </>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.section}>Start with a look you love</Text>
          <Text style={styles.caption}>Select a look in the style library to build your profile.</Text>
          <Primary title="Choose looks" onPress={edit} />
        </View>
      )}
    </>
  );
}

function OutfitPhoto({ outfit, compact }: { outfit: Outfit; compact: boolean }) {
  if (outfit.image) {
    return (
      <View style={[styles.outfitImage, compact && styles.outfitImageCompact]}>
        <Image
          accessibilityLabel={`${outfit.name} flat lay`}
          source={outfit.image}
          style={styles.fullImage}
          resizeMode={compact ? 'contain' : 'cover'}
        />
      </View>
    );
  }

  return (
    <View style={styles.outfitGrid} accessibilityLabel={`Pieces in ${outfit.name}`}>
      {[outfit.pieces.slice(0, 2), outfit.pieces.slice(2)]
        .filter(row => row.length)
        .map(row => (
          <View key={row[0].id} style={styles.grid}>
            {row.map(piece => (
              <Image key={piece.id} source={piece.image} style={styles.outfitGridImage} />
            ))}
            {row.length === 1 && <View style={styles.grow} />}
          </View>
        ))}
    </View>
  );
}

export function Outfits({
  outfit,
  prefersCasual,
  edit,
  openPiece,
  showReasons,
}: {
  outfit?: Outfit;
  prefersCasual: boolean;
  edit: () => void;
  openPiece: (piece: Piece) => void;
  showReasons: () => void;
}) {
  const compact = useWindowDimensions().height < 650;
  return (
    <>
      <Intro
        title="Outfit match"
        description={
          prefersCasual
            ? 'Casual preference applied to your profile.'
            : 'Recreate your style with clothes you own.'
        }
      />
      {outfit ? (
        <Reveal key={outfit.id} style={styles.outfitCard}>
          <View style={styles.outfitHeader}>
            <Text accessibilityRole="header" aria-live="polite" style={styles.outfitName}>
              {outfit.name}
            </Text>
            <View style={styles.between}>
              <Text style={[styles.chipActiveText, styles.matchChip]}>
                {outfit.matches.length} of {dimensions.length} cues match
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={showReasons}
                style={({ pressed }) => [styles.iconLink, pressed && styles.press]}
              >
                <Text style={styles.link}>Why it matches</Text>
                <Ionicons aria-hidden name="chevron-forward" size={16} color={colors.wine} />
              </Pressable>
            </View>
          </View>
          <OutfitPhoto outfit={outfit} compact={compact} />
          <View style={styles.outfitCloset}>
            <View style={styles.between}>
              <Text style={styles.section}>From your closet</Text>
              <Text style={styles.caption}>{outfit.pieces.length} owned pieces</Text>
            </View>
            <View style={styles.wardrobeRow}>
              {outfit.pieces.map(piece => (
                <Pressable
                  key={piece.id}
                  accessibilityRole="button"
                  style={styles.miniPiece}
                  onPress={() => openPiece(piece)}
                >
                  <Image
                    source={piece.image}
                    style={[styles.miniPhoto, compact && styles.miniPhotoCompact]}
                  />
                  <Text style={styles.miniName} numberOfLines={2}>
                    {piece.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Reveal>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.section}>Let’s find your style first</Text>
          <Text style={styles.caption}>Select inspiration to match it with clothes you own.</Text>
          <Primary title="Go to style library" onPress={edit} />
        </View>
      )}
    </>
  );
}

export function Closet({
  pieces,
  filter,
  setFilter,
  addedPieceId,
  add,
  showPiece,
}: {
  pieces: Piece[];
  filter: 'All' | Category;
  setFilter: (value: 'All' | Category) => void;
  addedPieceId?: string;
  add: () => void;
  showPiece: (piece: Piece) => void;
}) {
  const added = addedPieceId !== undefined;
  const visible = filter === 'All' ? pieces : pieces.filter(piece => piece.category === filter);
  return (
    <>
      <Intro title="My closet" description="Clothes you own and can style together." />
      <View style={[styles.between, styles.libraryBar]}>
        <Text style={styles.section} aria-live="polite">
          {pieces.length} owned pieces
        </Text>
        <Chip
          label={added ? 'Piece added' : 'Add sample piece'}
          icon={added ? 'checkmark' : 'add'}
          active={added || undefined}
          disabled={added}
          onPress={add}
        />
      </View>
      <View style={styles.filters}>
        {(['All', ...categories] as const).map(category => (
          <Chip
            key={category}
            label={category}
            active={filter === category}
            onPress={() => setFilter(category)}
          />
        ))}
      </View>
      <View style={styles.closetGrid}>
        {visible.map(piece => {
          const card = (
            <>
              <Image source={piece.image} style={styles.closetPhoto} />
              <View style={styles.closetCopy}>
                <Text style={styles.cueValue}>{piece.name}</Text>
                <Text style={styles.caption}>
                  {piece.category} · {piece.tone}
                </Text>
              </View>
            </>
          );
          return (
            <Pressable
              key={piece.id}
              accessibilityRole="button"
              onPress={() => showPiece(piece)}
              style={({ pressed }) => [styles.closetCard, pressed && styles.press]}
            >
              {piece.id === addedPieceId ? <Reveal>{card}</Reveal> : card}
            </Pressable>
          );
        })}
      </View>
    </>
  );
}
