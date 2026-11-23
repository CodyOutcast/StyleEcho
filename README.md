# STYLEECHO

STYLEECHO is a mobile application prototype for turning saved outfit references into a style profile and finding outfits from a wardrobe. It is built with Expo, React Native, and TypeScript.

## Features

- **Style library** stores outfit references and lets users select the looks that inform their profile.
- **Style profile** summarizes the most common color, silhouette, layering, and formality cues across the selected looks.
- **Closet** organizes garments by category and shows which pieces are available for matching.
- **Outfit matching** ranks complete outfits by the number of profile cues they share. Each recommendation explains its match, and casual feedback can surface an alternative outfit.

## Local setup

Use Node.js 24 and Expo Go for SDK 58. Install the dependencies and start Expo from the project root.

```sh
npm ci
npm start
```

Connect the phone and computer to the same Wi-Fi network. Scan the QR code in the terminal with the iPhone Camera or with the scanner in Expo Go on Android. For a tunnel connection, stop the server and run `npm start -- --tunnel`. If Expo Go prompts for sign-in on iOS, use the same Expo account in the app and in the CLI (`npx expo login`).

| Command | Purpose |
| --- | --- |
| `npm run web` | Start a browser preview. |
| `npm run typecheck` | Check the TypeScript source. |

## Implementation

`App.tsx` manages navigation and session state. `src/model.ts` contains the rules for building a style profile and matching outfits. `src/sample-data.ts` defines the inspiration, wardrobe, and outfit templates. The screens, dialogs, animations, and theme are in `src/`.

The prototype runs locally. Outfit links are saved as source references, while previews and style tags come from the bundled sample data. Wardrobe additions use a bundled sample garment. Selections and preferences are stored in memory for the current session.

## Image credits

- **Style library** · Pexels photos [City tailoring](https://www.pexels.com/photo/8368062/), [Slow mornings](https://www.pexels.com/photo/8989593/), [Off-duty denim](https://www.pexels.com/photo/7000807/), and [After hours](https://www.pexels.com/photo/18568121/).
- **Closet and outfit mockups** · Product photos from [Everlane](https://www.everlane.com/cdn/shop/files/bc665599_385b.jpg), [CO](https://co-collections.com/cdn/shop/files/2218NCR-IVORY_f4d4131f-4a40-48b2-9f68-b93b6883aef9-2.jpg), [COS](https://media.cos.com/assets/001/58/7b/587b295553c2296a829e621c1a289a301891a6e5_xxl-1.jpg), [Boden](https://us.boden.com/cdn/shop/files/26wspr_a1805_blc_d01_v1_6f1e14fc-32ad-45c5-a9b4-4ff740f84ba3.jpg), [Amazon cardigan](https://m.media-amazon.com/images/I/713Yy2UeVZL.jpg), [Budziko](https://www.budziko.com/cdn/shop/files/chocolate-pants-label-removed-20260718.png), [Amazon sneakers](https://m.media-amazon.com/images/I/61AoAsiMp1L.jpg), and [Everlane denim](https://www.everlane.com/cdn/shop/files/5339c0d8_2c78.jpg).
