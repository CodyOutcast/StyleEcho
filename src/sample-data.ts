import type { Inspiration, OutfitTemplate, Piece, StyleTemplate } from './model';

const stylePresets = {
  softTailoring: {
    name: 'Soft tailoring',
    traits: {
      color: 'Warm neutrals',
      silhouette: 'Relaxed structure',
      layering: 'Light layering',
      formality: 'Smart casual',
    },
  },
  weekendLayers: {
    name: 'Weekend layers',
    traits: {
      color: 'Warm neutrals',
      silhouette: 'Relaxed structure',
      layering: 'Light layering',
      formality: 'Casual',
    },
  },
  offDutyDenim: {
    name: 'Off-duty denim',
    traits: {
      color: 'Blue & white',
      silhouette: 'Loose fit',
      layering: 'Light layering',
      formality: 'Casual',
    },
  },
  sharpTailoring: {
    name: 'Sharp tailoring',
    traits: {
      color: 'Monochrome',
      silhouette: 'Straight lines',
      layering: 'Tailored layering',
      formality: 'Polished',
    },
  },
} satisfies Record<string, StyleTemplate>;

export const styleTemplates = Object.values(stylePresets);

export const initialLooks: Inspiration[] = [
  {
    id: 'city',
    name: 'City tailoring',
    traits: stylePresets.softTailoring.traits,
    image: require('../assets/look-city.jpg'),
  },
  {
    id: 'slow',
    name: 'Slow mornings',
    traits: stylePresets.weekendLayers.traits,
    image: require('../assets/look-slow.jpg'),
  },
  {
    id: 'denim',
    name: 'Off-duty denim',
    traits: stylePresets.offDutyDenim.traits,
    image: require('../assets/look-denim.jpg'),
  },
];

export const sampleLook: Inspiration = {
  id: 'after-dark',
  name: 'After hours',
  traits: stylePresets.sharpTailoring.traits,
  image: require('../assets/look-night.jpg'),
};

export const initialPieces: Piece[] = [
  {
    id: 'tee',
    name: 'Ivory tee',
    category: 'Tops',
    tone: 'Ivory',
    image: require('../assets/piece-tee.jpg'),
  },
  {
    id: 'slacks',
    name: 'Wide-leg trousers',
    category: 'Bottoms',
    tone: 'Black',
    image: require('../assets/piece-slacks.jpg'),
  },
  {
    id: 'loafers',
    name: 'Penny loafers',
    category: 'Shoes',
    tone: 'Black',
    image: require('../assets/piece-loafers.jpg'),
  },
  {
    id: 'cardigan',
    name: 'Knit cardigan',
    category: 'Layers',
    tone: 'Cream',
    image: require('../assets/piece-cardigan.jpg'),
  },
  {
    id: 'chocolate',
    name: 'Chocolate trousers',
    category: 'Bottoms',
    tone: 'Chocolate',
    image: require('../assets/piece-chocolate.jpg'),
  },
  {
    id: 'sneakers',
    name: 'Canvas sneakers',
    category: 'Shoes',
    tone: 'Cream',
    image: require('../assets/piece-sneakers.jpg'),
  },
  {
    id: 'jacket',
    name: 'Indigo denim jacket',
    category: 'Layers',
    tone: 'Indigo',
    image: require('../assets/piece-jacket.jpg'),
  },
];

export const samplePiece: Piece = {
  id: 'blazer',
  name: 'Taupe blazer',
  category: 'Layers',
  tone: 'Taupe',
  image: require('../assets/piece-blazer.jpg'),
};

export const outfitTemplates: OutfitTemplate[] = [
  {
    id: 'city-edit',
    name: 'The City Edit',
    traits: stylePresets.softTailoring.traits,
    pieceIds: ['blazer', 'tee', 'slacks', 'loafers'],
    image: require('../assets/outfit-city.jpg'),
    reasons: {
      color: 'Taupe and ivory keep the palette warm.',
      silhouette: 'Roomy trousers balance a structured blazer.',
      layering: 'An open blazer adds one easy layer.',
      formality: 'A simple tee softens tailored pieces.',
    },
  },
  {
    id: 'weekend-edit',
    name: 'The Weekend Edit',
    traits: stylePresets.weekendLayers.traits,
    pieceIds: ['cardigan', 'tee', 'chocolate', 'sneakers'],
    image: require('../assets/outfit-weekend.jpg'),
    reasons: {
      color: 'Cream and chocolate ground the palette.',
      silhouette: 'Wide-leg trousers give the outfit an easy shape.',
      layering: 'A knit cardigan works as the outer layer.',
      formality: 'Canvas sneakers make it feel casual.',
    },
  },
  {
    id: 'denim-edit',
    name: 'The Denim Edit',
    traits: stylePresets.offDutyDenim.traits,
    pieceIds: ['jacket', 'tee', 'slacks', 'sneakers'],
    reasons: {
      color: 'Indigo and ivory set the palette.',
      silhouette: 'Wide-leg trousers keep the fit loose.',
      layering: 'An open denim jacket adds one light layer.',
      formality: 'Denim and sneakers keep it casual.',
    },
  },
  {
    id: 'evening-edit',
    name: 'The Evening Edit',
    traits: {
      color: 'Monochrome',
      silhouette: 'Relaxed structure',
      layering: 'Single layer',
      formality: 'Polished',
    },
    pieceIds: ['tee', 'slacks', 'loafers'],
    reasons: {
      color: 'An ivory tee sits against a black base.',
      silhouette: 'Pleated trousers hold a relaxed shape.',
      layering: 'A single top keeps the outfit light.',
      formality: 'Black loafers dress up the trousers.',
    },
  },
];

export const initialSelectedLookIds = ['city', 'slow'];
export const sampleLookUrl = 'https://www.pexels.com/photo/18568121/';
