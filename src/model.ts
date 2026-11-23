import type { ImageSourcePropType } from 'react-native';

export const dimensions = [
  {
    key: 'color',
    label: 'Color',
    icon: 'color-palette-outline',
    question: 'What colors repeat across the look?',
  },
  {
    key: 'silhouette',
    label: 'Silhouette',
    icon: 'body-outline',
    question: 'How do the pieces shape the outfit?',
  },
  {
    key: 'layering',
    label: 'Layering',
    icon: 'layers-outline',
    question: 'How are pieces worn over one another?',
  },
  {
    key: 'formality',
    label: 'Formality',
    icon: 'sparkles-outline',
    question: 'How dressed up does the outfit feel?',
  },
] as const;

type Dimension = (typeof dimensions)[number]['key'];
type Formality = 'Casual' | 'Smart casual' | 'Polished';
type Traits = Record<Dimension, string> & { formality: Formality };

export const categories = ['Tops', 'Layers', 'Bottoms', 'Shoes'] as const;
export type Category = (typeof categories)[number];

export type Inspiration = {
  id: string;
  name: string;
  traits: Traits;
  image: ImageSourcePropType;
  source?: URL;
};

export type Piece = {
  id: string;
  name: string;
  category: Category;
  tone: string;
  image: ImageSourcePropType;
};

export type StyleTemplate = {
  name: string;
  traits: Traits;
};

export type OutfitTemplate = {
  id: string;
  name: string;
  traits: Traits;
  pieceIds: readonly string[];
  image?: ImageSourcePropType;
  reasons: Record<Dimension, string>;
};

type ProfileCue = (typeof dimensions)[number] & {
  value: string;
  supportingLooks: number;
  fromFeedback: boolean;
};

export type Profile = {
  title: string;
  cues: ProfileCue[];
};

export type Outfit = OutfitTemplate & {
  pieces: Piece[];
  matches: ProfileCue[];
};

export function buildProfile(
  looks: readonly Inspiration[],
  styleTemplates: readonly StyleTemplate[],
  formalityPreference?: Formality,
): Profile | null {
  if (looks.length === 0) return null;

  const cues = dimensions.map((dimension): ProfileCue => {
    const counts = new Map<string, number>();
    for (const look of looks) {
      const value = look.traits[dimension.key];
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }

    // Keep library order when two traits appear equally often.
    const [mostCommon] = Array.from(counts).sort((left, right) => right[1] - left[1]);
    const preferredValue = dimension.key === 'formality' ? formalityPreference : undefined;
    const value = preferredValue ?? mostCommon[0];

    return {
      ...dimension,
      value,
      supportingLooks: counts.get(value) ?? 0,
      fromFeedback: preferredValue !== undefined,
    };
  });

  const score = (template: StyleTemplate) =>
    cues.filter(cue => template.traits[cue.key] === cue.value).length;
  const [closestStyle] = [...styleTemplates].sort((left, right) => score(right) - score(left));

  return { title: closestStyle?.name ?? 'Personal style', cues };
}

export function matchOutfit(
  profile: Profile,
  closet: readonly Piece[],
  outfitTemplates: readonly OutfitTemplate[],
  excludeId?: string,
): Outfit | undefined {
  const preference = profile.cues.find(cue => cue.fromFeedback);
  const ownedPieces = new Map(closet.map(piece => [piece.id, piece]));

  const matches = outfitTemplates.flatMap((template): Outfit[] => {
    if (template.id === excludeId || (preference && template.traits[preference.key] !== preference.value)) {
      return [];
    }

    const pieces = template.pieceIds.flatMap(id => ownedPieces.get(id) ?? []);
    if (pieces.length !== template.pieceIds.length) return [];

    return [
      {
        ...template,
        pieces,
        matches: profile.cues.filter(cue => template.traits[cue.key] === cue.value),
      },
    ];
  });

  return matches.sort((left, right) => right.matches.length - left.matches.length).at(0);
}
