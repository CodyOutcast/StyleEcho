import type { ImageSourcePropType } from 'react-native';

export const dimensions = [
  { key: 'color', label: 'Color', icon: 'color-palette-outline', question: 'What colors repeat across the look?' },
  { key: 'silhouette', label: 'Silhouette', icon: 'body-outline', question: 'How do the pieces shape the outfit?' },
  { key: 'layering', label: 'Layering', icon: 'layers-outline', question: 'How are pieces worn over one another?' },
  { key: 'formality', label: 'Formality', icon: 'sparkles-outline', question: 'How dressed up does the outfit feel?' },
] as const;

type Dimension = (typeof dimensions)[number]['key'];
type Traits = Record<Dimension, string>;
export type Category = 'Tops' | 'Layers' | 'Bottoms' | 'Shoes';
export const categories: Category[] = ['Tops', 'Layers', 'Bottoms', 'Shoes'];

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

const styles = [
  {
    name: 'Soft tailoring',
    traits: { color: 'Warm neutrals', silhouette: 'Relaxed structure', layering: 'Light layering', formality: 'Smart casual' },
  },
  {
    name: 'Weekend layers',
    traits: { color: 'Warm neutrals', silhouette: 'Relaxed structure', layering: 'Light layering', formality: 'Casual' },
  },
  {
    name: 'Off-duty denim',
    traits: { color: 'Blue & white', silhouette: 'Loose fit', layering: 'Light layering', formality: 'Casual' },
  },
  {
    name: 'Sharp tailoring',
    traits: { color: 'Monochrome', silhouette: 'Straight lines', layering: 'Tailored layering', formality: 'Polished' },
  },
] satisfies { name: string; traits: Traits }[];

export const initialLooks: Inspiration[] = [
  { id: 'city', name: 'City tailoring', traits: styles[0].traits, image: require('../assets/look-city.jpg') },
  { id: 'slow', name: 'Slow mornings', traits: styles[1].traits, image: require('../assets/look-slow.jpg') },
  { id: 'denim', name: 'Off-duty denim', traits: styles[2].traits, image: require('../assets/look-denim.jpg') },
];

export const sampleLook: Inspiration = {
  id: 'after-dark',
  name: 'After hours',
  traits: styles[3].traits,
  image: require('../assets/look-night.jpg'),
};

export const initialPieces: Piece[] = [
  { id: 'tee', name: 'Ivory tee', category: 'Tops', tone: 'Ivory', image: require('../assets/piece-tee.jpg') },
  { id: 'slacks', name: 'Wide-leg trousers', category: 'Bottoms', tone: 'Black', image: require('../assets/piece-slacks.jpg') },
  { id: 'loafers', name: 'Penny loafers', category: 'Shoes', tone: 'Black', image: require('../assets/piece-loafers.jpg') },
  { id: 'cardigan', name: 'Knit cardigan', category: 'Layers', tone: 'Cream', image: require('../assets/piece-cardigan.jpg') },
  { id: 'chocolate', name: 'Chocolate trousers', category: 'Bottoms', tone: 'Chocolate', image: require('../assets/piece-chocolate.jpg') },
  { id: 'sneakers', name: 'Canvas sneakers', category: 'Shoes', tone: 'Cream', image: require('../assets/piece-sneakers.jpg') },
  { id: 'jacket', name: 'Indigo denim jacket', category: 'Layers', tone: 'Indigo', image: require('../assets/piece-jacket.jpg') },
];

export const samplePiece: Piece = {
  id: 'blazer',
  name: 'Taupe blazer',
  category: 'Layers',
  tone: 'Taupe',
  image: require('../assets/piece-blazer.jpg'),
};

const recipes = [
  {
    id: 'city-edit',
    name: 'The City Edit',
    traits: styles[0].traits,
    pieces: ['blazer', 'tee', 'slacks', 'loafers'],
    image: require('../assets/outfit-city.jpg'),
    reasons: ['Taupe and ivory keep the palette warm.', 'Roomy trousers balance a structured blazer.', 'An open blazer adds one easy layer.', 'A simple tee softens tailored pieces.'],
  },
  {
    id: 'weekend-edit',
    name: 'The Weekend Edit',
    traits: styles[1].traits,
    pieces: ['cardigan', 'tee', 'chocolate', 'sneakers'],
    image: require('../assets/outfit-weekend.jpg'),
    reasons: ['Cream and chocolate ground the palette.', 'Wide-leg trousers give the outfit an easy shape.', 'A knit cardigan works as the outer layer.', 'Canvas sneakers make it feel casual.'],
  },
  {
    id: 'denim-edit',
    name: 'The Denim Edit',
    traits: styles[2].traits,
    pieces: ['jacket', 'tee', 'slacks', 'sneakers'],
    reasons: ['Indigo and ivory set the palette.', 'Wide-leg trousers keep the fit loose.', 'An open denim jacket adds one light layer.', 'Denim and sneakers keep it casual.'],
  },
  {
    id: 'evening-edit',
    name: 'The Evening Edit',
    traits: { color: 'Monochrome', silhouette: 'Relaxed structure', layering: 'Single layer', formality: 'Polished' },
    pieces: ['tee', 'slacks', 'loafers'],
    reasons: ['An ivory tee sits against a black base.', 'Pleated trousers hold a relaxed shape.', 'A single top keeps the outfit light.', 'Black loafers dress up the trousers.'],
  },
];

export function buildProfile(looks: Inspiration[], prefersCasual: boolean) {
  if (!looks.length) return null;

  const cues = dimensions.map(dimension => {
    const counts = new Map<string, number>();
    for (const look of looks) {
      const value = look.traits[dimension.key];
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    const entries = [...counts.entries()].sort((left, right) => right[1] - left[1]);
    const fromFeedback = dimension.key === 'formality' && prefersCasual;
    return {
      ...dimension,
      value: fromFeedback ? 'Casual' : entries[0][0],
      evidence: entries[0][1],
      fromFeedback,
    };
  });
  const title = [...styles].sort((left, right) => {
    const score = (style: (typeof styles)[number]) =>
      cues.reduce((total, cue) => total + (style.traits[cue.key] === cue.value ? 1 : 0), 0);
    return score(right) - score(left);
  })[0].name;
  return { title, cues };
}

export type Profile = NonNullable<ReturnType<typeof buildProfile>>;

export function matchOutfit(profile: Profile, closet: Piece[], excludeId?: string) {
  const preference = profile.cues.find(cue => cue.fromFeedback);
  return recipes.flatMap(recipe => {
    if (recipe.id === excludeId || (preference && recipe.traits[preference.key] !== preference.value)) return [];
    const pieces = recipe.pieces.flatMap(id => {
      const original = closet.find(piece => piece.id === id);
      return original ? [original] : [];
    });
    if (pieces.length !== recipe.pieces.length) return [];
    return [{
      ...recipe,
      pieces,
      matches: profile.cues.filter(cue => recipe.traits[cue.key] === cue.value),
    }];
  })
    .sort((left, right) => right.matches.length - left.matches.length)
    .at(0);
}

export type Outfit = NonNullable<ReturnType<typeof matchOutfit>>;

export const defaultDemo = {
  selectedIds: ['city', 'slow'],
  lookLink: null as URL | null,
  pieceAdded: false,
  prefersCasual: false,
};
