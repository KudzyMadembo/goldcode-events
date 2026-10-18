import manifest from "./gallery-manifest.json";

export type HighlightSize = "tall" | "wide" | "large";

export type Highlight = {
  file: string;
  size: HighlightSize;
  caption: string;
  alt: string;
};

export const galleryEvent = {
  name: "Curated Nights",
  presenter: "GoldCode presents",
  city: "Auckland",
  driveUrl: "https://drive.google.com/drive/folders/1TogVoC1BN6wvBX4FRqjmAH4Fyl1MuFsV?usp=drive_link",
  heroImage: "cn-9219.jpg",
};

/**
 * Hand-picked frames for the editorial grid. Sizes are tuned to a six-column
 * grid: tall = 2x2, wide = 2x1, large = 4x2. The order matters; each group of
 * entries fills a complete two-row band so the grid never leaves gaps.
 */
export const highlights: Highlight[] = [
  { file: "cn-9202.jpg", size: "tall", caption: "The invitation", alt: "Curated Nights poster framed by gold and black balloons" },
  { file: "cn-9180.jpg", size: "large", caption: "Hands up", alt: "Two guests dancing with their hands raised under festoon lights" },
  { file: "cn-9238.jpg", size: "tall", caption: "The floor", alt: "Guests dancing together in a circle on the dance floor" },
  { file: "cn-9256.jpg", size: "wide", caption: "That chorus", alt: "Friends singing and dancing together beneath the lights" },
  { file: "cn-9086.jpg", size: "tall", caption: "Aperitivo", alt: "Two spritz cocktails on a tiled table at dusk" },
  { file: "cn-9133.jpg", size: "wide", caption: "Three's company", alt: "Three friends leaning in together for a photograph" },
  { file: "cn-9214.jpg", size: "tall", caption: "At the decks", alt: "A DJ mixing at the booth with the room behind him" },
  { file: "cn-9260.jpg", size: "wide", caption: "Cheers", alt: "Two friends raising champagne flutes at the table" },
  { file: "cn-9231.jpg", size: "tall", caption: "That laugh", alt: "A guest laughing with a hand on his chest" },
  { file: "cn-9140.jpg", size: "wide", caption: "Golden hour, after dark", alt: "A couple sharing a moment under orange umbrellas" },
  { file: "cn-9074.jpg", size: "tall", caption: "Selector", alt: "A DJ adjusting the mixer, lit from the side" },
  { file: "cn-9120.jpg", size: "tall", caption: "In the mix", alt: "Black-and-white photograph of a DJ wearing headphones at the decks" },
  { file: "cn-9108.jpg", size: "tall", caption: "Early arrivals", alt: "Two guests standing at the bar beside the Curated Nights sign" },
];

const highlightFiles = new Set(highlights.map((item) => item.file));

/** Every frame, highlights first, then the remainder in camera order. */
export const allPhotos: string[] = [
  ...highlights.map((item) => item.file),
  ...manifest.filter((file) => !highlightFiles.has(file)),
];

export const galleryPath = (file: string) => `/images/gallery/${file}`;
