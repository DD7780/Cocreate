# UI assets and licenses

Updated: 2026-09-23.

The dark editorial presentation introduces no stock imagery, copied layouts, or decorative image assets. It uses the existing Lucide React icon dependency and two web-font families with system-font fallbacks.

| Asset | Use | Source | License |
| --- | --- | --- | --- |
| Inter | Interface and document body text | [Google Fonts: Inter](https://fonts.google.com/specimen/Inter) | SIL Open Font License 1.1 |
| DM Serif Display | Brand and editorial headings | [Google Fonts: DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) | SIL Open Font License 1.1 |
| Lucide React | Interface icons | [Lucide](https://lucide.dev/) | ISC |

The stylesheet requests the fonts from Google Fonts and keeps local system fallbacks so the workspace remains readable when the font request is unavailable. Generated product previews remain style-isolated and do not inherit these workspace fonts or colors.
