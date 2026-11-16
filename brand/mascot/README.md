# BilUp snow leopard — official brand mascot

`source/snow-leopard-master.png` is the canonical reference (1254², opaque). It is **not shipped** and must not be edited.
Every future expression/pose must be derived from it and keep: white fur with dark spots, large turquoise eyes, the Kyrgyz
kalpak, friendly smile, turquoise "BilUp" hoodie, backpack and book. Do not substitute another animal or imitate other brands' mascots.

The mascot complements the BilUp wordmark (text logo); it never replaces it. Shared by BilUp Til, and later BilUp Test / STEM.

## Shipped derivatives (`public/brand/mascot/` — everything in `public/` is precached, keep files small)
| File | Use |
| --- | --- |
| `snow-leopard-320.webp` / `-640.webp` | full character (1x / 2x) — hero, profile, tutor welcome |
| `avatar-96.webp` / `-192.webp` | head + kalpak crop — header, chat, result card (full figure is illegible below ~64px) |
| `icon-192.png`, `icon-512.png` | PWA "any" icons |
| `icon-maskable-512.png` | PWA maskable icon (character inside the 80% safe zone) |
| `apple-touch-icon.png` | iOS home screen |

The browser-tab favicon stays the vector `favicon.svg` (B mark): the character is unreadable at 16–32px.

## Adding a pose
1. Produce the pose from the master; export `<pose>-640.webp`, `<pose>-320.webp`, `<pose>-avatar-192.webp`, `<pose>-avatar-96.webp`.
2. Extend `MascotPose` and `MASCOT` in `src/brand/mascot.ts` (with ru/ky/de alt text).
3. Use `<Mascot pose="…" variant="illustration|avatar" size={…} />` (`src/components/Mascot.tsx`).
