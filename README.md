# STYLEECHO

A mobile prototype that turns saved outfit inspiration into a style profile and matches it to pieces from your closet. The demo starts with two selected looks and seven closet pieces. Link import and closet import use preloaded photos and simulated analysis for the recording.

## Run the app

Use Node.js 24 and Expo Go for SDK 58. From the folder containing `package.json`, run

```sh
npm ci
npm start
```

Scan the terminal QR code with the iPhone Camera or the scanner in Expo Go on Android. Keep the phone and computer on the same Wi-Fi. If that network blocks connections between devices, stop the server and run `npm start -- --tunnel`. If Expo Go on an iPhone prompts for sign-in, use the same Expo account in the app and in the CLI (`npx expo login`).

Run `npm run web` to open a browser preview or `npm run typecheck` to check the TypeScript code. The demo runs locally with the bundled sample images.

## Two-minute recording

| Time | What to tap | What to say |
| --- | --- | --- |
| 0:00–0:28 | Open **Library → Add a look**. Leave the prefilled link as it is and tap **Analyze look**. Let the photo scan play. **After hours** appears and the selection grows to three. | “When I see an outfit I like online, I can save its link. STYLEECHO pulls out the style cues I can use later.” |
| 0:28–0:50 | Tap **Build my style profile**. Let the comparison finish, then point to **Color**, **Silhouette**, **Layering**, and **Formality**. Tap **See my closet**. | “It compares the looks I saved. Two of these three use warm neutrals and relaxed structure.” |
| 0:50–1:15 | Tap **Add a piece**. The sample photo is scanned and the **Taupe blazer** appears at the top. Tap **Generate outfits** and let the match finish. | “Adding the blazer makes it available for my next outfit. The app matches my style cues against what I own.” |
| 1:15–1:40 | Show **The City Edit** and its four owned pieces. Tap **Why it matches**, highlight one cue, and close the sheet. | “The taupe and ivory carry the warm palette from my saved looks into an outfit using the blazer I just added.” |
| 1:40–2:00 | Tap **Make it more casual**. Let the restyling finish and show **The Weekend Edit**. Tap **Profile** and point to **Formality · Casual** and **Your feedback**. | “When I want a more casual look, my outfit changes and the app keeps that preference for the next match.” |

Start each take with **… → Reset demo**. Reloading also starts a fresh session. The link field is editable and accepts a web URL. The demo keeps the link as the saved look’s source and uses a bundled image and style cues to simulate analysis. Each progress sequence takes about two to three seconds.

## Sample photo credits

- **Style library** · Pexels photos [City tailoring](https://www.pexels.com/photo/8368062/), [Slow mornings](https://www.pexels.com/photo/8989593/), [Off-duty denim](https://www.pexels.com/photo/7000807/), and [After hours](https://www.pexels.com/photo/18568121/).
- **Closet and outfit mockups** · Product photos from [Everlane](https://www.everlane.com/cdn/shop/files/bc665599_385b.jpg), [CO](https://co-collections.com/cdn/shop/files/2218NCR-IVORY_f4d4131f-4a40-48b2-9f68-b93b6883aef9-2.jpg), [COS](https://media.cos.com/assets/001/58/7b/587b295553c2296a829e621c1a289a301891a6e5_xxl-1.jpg), [Boden](https://us.boden.com/cdn/shop/files/26wspr_a1805_blc_d01_v1_6f1e14fc-32ad-45c5-a9b4-4ff740f84ba3.jpg), [Amazon cardigan](https://m.media-amazon.com/images/I/713Yy2UeVZL.jpg), [Budziko](https://www.budziko.com/cdn/shop/files/chocolate-pants-label-removed-20260718.png), [Amazon sneakers](https://m.media-amazon.com/images/I/61AoAsiMp1L.jpg), and [Everlane denim](https://www.everlane.com/cdn/shop/files/5339c0d8_2c78.jpg).
