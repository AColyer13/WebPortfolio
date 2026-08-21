/** Build `<picture>` sources from a public image path that has -640/-1280 variants. */
export function stripImageExtension(path: string): string {
  return path.replace(/\.(png|jpe?g|webp|avif)$/i, '')
}

export function projectPictureBase(imageUrl: string): string {
  return stripImageExtension(imageUrl)
}

/** Hero desk photo — sized AVIF/WebP/JPEG with JPEG master fallback. */
export const HERO_IMAGE = {
  fallback: 'images/IMG_4874.JPEG',
  widths: [
    { w: 960, avif: 'images/IMG_4874-960.avif', webp: 'images/IMG_4874-960.webp', jpeg: 'images/IMG_4874-960.jpeg' },
    { w: 1920, avif: 'images/IMG_4874-1920.avif', webp: 'images/IMG_4874-1920.webp', jpeg: 'images/IMG_4874-1920.jpeg' },
  ],
} as const
