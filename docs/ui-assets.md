# UI assets and licenses

Updated: 2026-09-22.

The dark editorial presentation introduces no stock imagery, copied layouts, or decorative image assets. It uses the existing Lucide React icon dependency and two web-font families with system-font fallbacks.

| Asset | Use | Source | License |
| --- | --- | --- | --- |
| Inter | Interface and document body text | [Google Fonts: Inter](https://fonts.google.com/specimen/Inter) | SIL Open Font License 1.1 |
| DM Serif Display | Brand and editorial headings | [Google Fonts: DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) | SIL Open Font License 1.1 |
| Lucide React | Interface icons | [Lucide](https://lucide.dev/) | ISC |

The stylesheet requests the fonts from Google Fonts and keeps local system fallbacks so the workspace remains readable when the font request is unavailable. Generated product previews remain style-isolated and do not inherit these workspace fonts or colors.

## Liquid-metal direction

The metallic marks are original layered radial/conic CSS gradients applied to existing Lucide SVG icons. They add no image file, animation package, shader, or external runtime. Slow border-shape deformation and a moving specular highlight create the liquid motion; `prefers-reduced-motion` collapses both through the global reduced-motion rule. The production palette is graphite, silver, pearl, and blue-gray, with no green accent.

Four Dribbble pages were reviewed on 2026-09-22 for high-level direction only: [Liquid Metal Personal Branding](https://dribbble.com/shots/25664607-Liquid-Metal-Personal-Branding), [Liquid Metal Animation](https://dribbble.com/shots/26943526-Liquid-Metal-Animation), [Liquid Metal UI buttons](https://dribbble.com/shots/27185489-Liquid-Metal-UI-buttons), and [Konpo Liquid Metal Effect on Our Logo](https://dribbble.com/shots/25673199-Konpo-Liquid-Metal-Effect-on-Our-Logo). The static pages supported silver-on-dark contrast, blue-gray secondary tones, organic silhouettes, controlled highlights, and selective movement. Their artwork and layouts were not copied; animation playback could not be reliably evaluated from the static pages, so the repository implementation uses original keyframes.
