# Zoya & Arhaan — Digital Wedding Invitation

A luxury, mobile-first wedding invitation website built with **Next.js 16**, **React 19** and **Three.js**.
Guests open a 3D treasure chest, read the invitation, explore a three-day itinerary and RSVP. The couple gets a private dashboard showing every reply.

> **This is a demo build.** The couple (Zoya Rahman & Arhaan Qureshi), the families, the dates, the Delhi venues and the 20 RSVPs in the admin panel are all **fictional**. The couple photos are free stock images from Unsplash. Nothing here belongs to a real wedding, so feel free to explore it and fork it.

| | |
|---|---|
| **Live demo** | [zoya-arhaan.vercel.app](https://zoya-arhaan.vercel.app/) |
| **Admin panel** | `/admin` · password **`secretpassword`** |
| **Backend needed** | None. No database, no API keys, no `.env` file. |

---

## Table of contents

1. [The guest journey](#the-guest-journey)
2. [Motion and gestures: how Android, iOS and desktop differ](#motion-and-gestures-how-android-ios-and-desktop-differ)
3. [The effects, one by one](#the-effects-one-by-one)
4. [RSVP and admin panel](#rsvp-and-admin-panel)
5. [Tech stack and why each library is here](#tech-stack-and-why-each-library-is-here)
6. [Project structure](#project-structure)
7. [Getting started](#getting-started)
8. [Make it your own wedding](#make-it-your-own-wedding)
9. [Performance and accessibility](#performance-and-accessibility)
10. [Assets and credits](#assets-and-credits)

---

## The guest journey

```
 Loader ─► Treasure chest ─► Invitation ─► Itinerary ─► RSVP ─► Confirmation
 (monogram)  (tap or shake)   (story page)  (3 days)     (form)   (+ confetti)
```

1. **Loader.** The couple's monogram spins in a gold ring for about 1.8 seconds while the 3D scene loads in the background.
2. **Treasure chest.** A real-time 3D chest sits on a deep maroon stage. The guest taps it, or on a phone shakes it. The lid swings open on its hinge, a warm light spills out and the monogram rises from inside. Background music starts at the same moment.
3. **Invitation.** A paper-textured story page shows:
   - the couple's names in a signature script, with the Bismillah underneath;
   - bride and groom portraits;
   - the Quran 30:21 verse;
   - the family invitation;
   - a live countdown;
   - the date, a Google Map of the venue and a closing dua.
4. **Itinerary.** Three swipeable cards: Mehndi & Dholki, Qawwali Night and The Nikah. Each card has its timing and a map link.
5. **RSVP.** The guest gives their name, phone and optional email, chooses which days they'll attend, and sets party size and accommodation. Then they **slide to confirm**.
6. **Confirmation.** A thank-you page repeats the guest's choices back to them, with a burst of gold confetti.

A brass **lantern** hangs at the top of the invitation, itinerary and RSVP pages and swings as the guest tilts their phone. **Butterflies** drift across every page.

---

## Motion and gestures: how Android, iOS and desktop differ

Two features use the phone's motion sensors:

| Feature | Sensor event | What the guest does |
|---|---|---|
| **Shake to open** the treasure chest | `devicemotion` (accelerometer) | Shakes the phone |
| **Swinging lantern** on the inner pages | `deviceorientation` (gyroscope tilt) | Tilts the phone left or right |

Browsers treat these sensors very differently, so the app handles each platform separately.

### Android: no permission needed

Chrome on Android sends `devicemotion` and `deviceorientation` events straight away, with no prompt. The app detects this and turns motion on immediately: shake works and the lantern swings. **No permission sheet is ever shown on Android.**

### iOS and iPadOS: permission required

Since iOS 13, Safari blocks motion events until the site calls `DeviceMotionEvent.requestPermission()`. Two strict rules apply:

- the call must happen **directly inside a user tap**, with no `await` before it, or iOS rejects it;
- if the guest says no, iOS won't ask again on that site.

The app handles this as follows:

- **One ask for the whole invitation.** On iOS, motion and orientation are a single underlying permission, and asking twice is the quickest way to get a "no". So the app asks **once**, on the treasure chest screen, and the lantern on later pages reuses that answer. The lantern never prompts by itself.
- **A designed bottom sheet, not a surprise dialog.** Before the native iOS prompt, a "Unlock the Invitation" card slides up and explains why motion is useful. It offers **Enable motion** and **Not now**, and can also be swiped down to dismiss. The native prompt only appears after the guest taps Enable.
- **The choice is remembered.** It's stored in `localStorage` as `unset`, `enabled` or `disabled`, so returning guests aren't asked again.
- **Stale grants are detected.** iOS doesn't always keep a permission across a fresh page load, for example when a guest opens a shared `/rsvp` link directly. If the lantern gets no real tilt data within about 1.4 seconds, the app forgets the stale "enabled" and falls back quietly. It never shows a dead control.

**How the app tells the platforms apart:** the `DeviceOrientationEvent` object exists on Android and desktop too, so checking for it isn't enough. The reliable Apple-only signal is that `DeviceOrientationEvent.requestPermission` exists **as a function**. See [`lib/motion-access.ts`](lib/motion-access.ts).

### Desktop: no motion UI at all

Laptops never see the permission sheet or the shake hint, even when a Chromium build reports motion APIs. Device type is detected in [`lib/device.ts`](lib/device.ts) by combining three signals:

1. the user-agent device type from `ua-parser-js`;
2. real touch capability (coarse pointer, touch points, no hover);
3. the iPad check `navigator.platform === 'MacIntel' && maxTouchPoints > 1`, because modern iPads identify themselves as Macs.

A device only counts as mobile or tablet when the user-agent signal **and** real touch support agree. A desktop with a touchscreen monitor therefore still counts as desktop. On desktop, the lantern follows the **mouse** instead.

### Shake detection

The shake detector ([`useDeviceShake.ts`](components/treasure-chest/useDeviceShake.ts)) is tuned so that walking or a bump doesn't open the chest:

- it samples the accelerometer about every 50 ms, so it measures gestures rather than sensor noise;
- it adds up the change in acceleration across the x, y and z axes, and treats more than 22 m/s² as a "hit";
- it needs **two hits in quick succession**, and the hit count decays between them, so a single jolt never adds up to a shake;
- it waits 1.4 seconds before another shake can count.

### The fallback always works

**Tap and keyboard always open the chest.** Shake is an extra, never a requirement. If there's no sensor, the guest declines, or the guest has *reduced motion* turned on, everything still works. The chest screen shows exactly one hint: "shake" when motion is live, otherwise "tap".

---

## The effects, one by one

### 🗝️ Treasure chest (3D)
*[`components/treasure-chest/`](components/treasure-chest)*

- **The model is generated in code**, using `three` and `@react-three/fiber`. There's no `.glb` file and no texture images to download. Wood grain, plank seams, engraved brass and velvet lining are all drawn on an offscreen canvas at runtime ([`chestTextures.ts`](components/treasure-chest/chestTextures.ts)), so the chest costs **zero image or model bytes** over the network.
- **The lid rotates on a real hinge.** It's a child of a group placed exactly on the rear hinge line, so opening is a single rotation and nothing fades or swaps.
- **The opening is choreographed** in [`chestRuntime.ts`](components/treasure-chest/chestRuntime.ts) on one timeline: latch, lid, glow, monogram rise, settle and hand-off. The animation state lives in a plain object in a ref rather than React state, because writing React state every frame causes jank in three.js scenes.
- **Lighting:** a single 64 px `Lightformer` environment from `@react-three/drei` makes the brass read as metal without downloading an HDR file.
- **Performance:**
  - it renders at 30 fps while idle and 60 fps only during the opening, and stops when the tab is hidden;
  - `PerformanceMonitor` lowers the pixel ratio on weak GPUs;
  - shadows and high-resolution textures are reserved for capable devices (based on CPU cores and pixel ratio).
- **No WebGL? CSS 3D fallback.** The same hinged chest is built from HTML elements with CSS 3D transforms ([`TreasureChestFallback.tsx`](components/treasure-chest/TreasureChestFallback.tsx)). The 3D bundle is dynamically imported, so these devices never download it.
- **Sound effects are synthesised.** The latch click and the wooden creak come from WebAudio oscillators and noise ([`useChestAudio.ts`](components/treasure-chest/useChestAudio.ts)), so no audio files are needed.

### 🏮 Swinging lantern
*[`components/CelestialBackdrop.tsx`](components/CelestialBackdrop.tsx)*

The lantern is a hand-drawn SVG that hangs from a fixed point and swings like a pendulum. Its source is chosen from the motion status:

- **phone with motion on:** `deviceorientation` → `gamma` (left-right tilt). The tilt is clamped to ±20° and scaled down, so a big tilt makes only a gentle arc;
- **desktop:** mouse position, up to about 3° each way;
- **phone without motion:** it hangs still.

Updates are batched into `requestAnimationFrame` and applied through a CSS variable, so React never re-renders on tilt. The RSVP page also has a slow **starfield** of ✦ ✧ particles from `tsParticles`, capped at 30 fps.

### 🦋 Butterflies
*[`components/RealisticButterflies.tsx`](components/RealisticButterflies.tsx) · [`DeferredButterflies.tsx`](components/DeferredButterflies.tsx)*

Five butterflies in different colours fly across the screen on randomised **cubic Bézier** paths, drawn in a transparent Three.js canvas.

- **Wing flapping** runs in a custom **vertex shader**: each wing is a bent plane, and the flap speed varies per butterfly.
- They **bank and turn** to face their direction of travel, with a little sideways drift.
- They only load **after the page has painted** (a 1-second delay, adjustable), so they never slow down the first view.
- They pause when the tab is hidden or the canvas is scrolled off-screen, and use half the mesh detail on mobile.
- One shared texture serves every page.
- They're turned off when the guest prefers reduced motion.

### 🎉 Confetti
*[`components/RsvpCelebration.tsx`](components/RsvpCelebration.tsx)*

On the confirmation page, `canvas-confetti` fires a short sequence in ivory, gold and bronze: one centre burst, two side bursts and a soft final shower, using stars and circles. The library is **loaded only when the page needs it**, and nothing fires for guests who prefer reduced motion.

### 🎵 Background music
*[`lib/audio-player.ts`](lib/audio-player.ts) · [`components/MusicToggle.tsx`](components/MusicToggle.tsx)*

- **One audio element for the whole site.** It lives at module scope, so the music keeps playing across page changes.
- **Preference and playback are tracked separately.** The guest's choice (on or off) is saved, and whether sound is *actually* playing comes from real `<audio>` events. If the browser blocks autoplay, the toggle honestly shows "muted".
- **Autoplay strategy:**
  - it tries to play straight away (this works on Android and most desktops);
  - if that's blocked, it retries on the first real tap anywhere on the page;
  - the treasure-chest tap is where this usually succeeds on iOS.

### 📜 Paper texture and smooth scrolling

- **Paper texture:** the parchment background is a live WebGL shader from `@paper-design/shaders-react`, with fibres, crumples and folds. It loads shortly after first paint and shows a flat colour until then.
- **Smooth scrolling:** desktop gets `lenis` momentum scrolling. Phones keep **native** scrolling, because emulated touch scrolling feels laggy. Both are turned off for reduced motion.

### ✨ Other details

- **Countdown:** ticks every second to the Nikah. It starts after the page is interactive, so the server and browser clocks never disagree, and it re-syncs when the tab comes back into focus.
- **Itinerary carousel:** uses native CSS scroll-snap, so the browser handles the swipe physics. It also has arrow buttons on desktop and keyboard-accessible dots.
- **Slide to confirm:** a draggable thumb built with Framer Motion. It's also a proper keyboard `slider`, and it snaps back if the form has an error.
- **Share button (bottom-left):** it mirrors the music button. On phones it opens the native share sheet (WhatsApp, Instagram and so on); on desktop it copies the link. It always shares the home page, never the guest's confirmation page. Above it sits a small gem icon that links to the developer. Its label ("Want this invite? Contact the developer") peeks out once per visit, then tucks away, and shows again on hover or keyboard focus. It's hidden on the admin pages ([`components/ShareInvite.tsx`](components/ShareInvite.tsx)).

---

## RSVP and admin panel

### Guest RSVP: no backend
*[`app/rsvp/page.tsx`](app/rsvp/page.tsx) · [`lib/rsvp-storage.ts`](lib/rsvp-storage.ts)*

- **Validation:** the form is checked with **Zod**. A name is required, the phone must be 7–15 digits with an optional `+`, at least one day must be chosen, and accommodation must be answered. Errors appear in a bottom sheet.
- **Storage:** the reply is saved **in the guest's own browser** (`localStorage` key `demo-rsvps-v1`), keyed by phone number with spaces and dashes removed.
- **One reply per phone:** a second submission from the same number gets a friendly "Already submitted" message.
- **No personal data in the URL.** After the slide, the guest goes to a plain `/rsvp/confirmation`, which reads the latest saved reply from storage. Names, phones and emails never end up in browser history, server logs, analytics or `Referer` headers, and nobody can fake a confirmation page by editing a link.
- **Stored data is validated when it's read back.** `localStorage` can be edited by anyone, so every saved reply is checked against a Zod schema. Corrupt or tampered entries are ignored, and if nothing valid is left, the confirmation page sends the guest back to the form.

> Want real submissions? Swap the three functions in [`lib/rsvp-storage.ts`](lib/rsvp-storage.ts) (`hasRsvp`, `saveRsvp`, `getLatestRsvp`) for calls to your own API or a database such as Supabase or Firebase. Have the server return an RSVP id and load the confirmation as `/rsvp/confirmation/<id>`. The pages don't need to change.

### Admin dashboard: sample data
*[`app/admin/`](app/admin) · [`lib/dummy-rsvps.ts`](lib/dummy-rsvps.ts) · [`lib/admin-queries.ts`](lib/admin-queries.ts)*

Go to **`/admin`** and log in with **`secretpassword`**. The password is also shown on the login page. You'll see **20 fictional RSVPs**:

- **Headline stats:** total responses, total guests, how many need accommodation, average party size and replies in the last 7 days.
- **Per-event attendance:** responses and head count for each of the three days, which is the number a caterer needs.
- **Search** by name, phone or email.
- **Filters:** accommodation, and days. The day filter has an **any/all** match mode ("attending Mehndi *or* Nikah" versus "attending *both*").
- **Sorting:** newest, oldest, name, or largest party.
- **Detail view** for each guest, with tap-to-call and tap-to-email links.

How it's built:

- **Filters live in the URL**, so a filtered view can be bookmarked or shared.
- The sample timestamps are **relative to today**, so "last 7 days" always shows numbers.
- **Login:** a small API route sets an **HttpOnly session cookie**, and [`proxy.ts`](proxy.ts) (Next 16's renamed middleware) guards `/admin/dashboard`.

> ⚠️ The demo password is public **on purpose**. Before using this for a real event, move it to an environment variable and give the session cookie a proper signature ([`lib/admin-auth.ts`](lib/admin-auth.ts)).

---

## Tech stack and why each library is here

| Library | Used for | Why this one |
|---|---|---|
| [**Next.js 16**](https://nextjs.org) (App Router, Turbopack) | Routing, image optimisation, metadata, OG image | Server components for the admin, static pages for guests, `next/image` for the photos |
| [**React 19**](https://react.dev) | UI | `useSyncExternalStore` drives every browser-capability read without hydration mismatches |
| [**TypeScript**](https://www.typescriptlang.org) | Everything | Strict mode throughout |
| [**Tailwind CSS 4**](https://tailwindcss.com) | Utility styling | Used with hand-written CSS in `app/globals.css` for the bespoke parts |
| [**three**](https://threejs.org) | Treasure chest, butterflies, monogram reveal | Full control over geometry, shaders and materials |
| [**@react-three/fiber**](https://r3f.docs.pmnd.rs) | React renderer for three.js | Declarative scene and `useFrame` animation loop |
| [**@react-three/drei**](https://drei.docs.pmnd.rs) | `Environment`, `Lightformer` | Metallic reflections without downloading an HDR |
| [**framer-motion**](https://motion.dev) | Page reveals, bottom sheets, slide-to-confirm | Springs, `AnimatePresence`, drag gestures |
| [**@tsparticles/react**](https://particles.js.org) + `slim` + `engine` | Starfield on the RSVP page | Lightweight, configurable, frame-rate capped |
| [**@paper-design/shaders-react**](https://shaders.paper.design) | Live paper texture background | Real shader texture instead of a heavy image |
| [**canvas-confetti**](https://github.com/catdad/canvas-confetti) | RSVP celebration | Tiny, and loaded only on the confirmation page |
| [**lenis**](https://lenis.darkroom.engineering) | Desktop smooth scroll | Smooth wheel scrolling that doesn't break native touch scrolling |
| [**ua-parser-js**](https://uaparser.dev) | Mobile / tablet / desktop detection | Maintained user-agent parsing instead of fragile regexes |
| [**zod**](https://zod.dev) | RSVP form validation | Readable schema and friendly error messages |
| [**lucide-react**](https://lucide.dev) | Icons | Consistent, tree-shakeable icons |
| [**clsx**](https://github.com/lukeed/clsx) + [**tailwind-merge**](https://github.com/dcastil/tailwind-merge) | `cn()` helper | Merges conditional Tailwind classes without conflicts |
| [**@vercel/analytics**](https://vercel.com/analytics) | Page-view analytics | Zero-config on Vercel, and does nothing elsewhere |

**Fonts:**

- **Cormorant Garamond** (headings) and **Geist** (body), both via `next/font`;
- **Brittany Signature** for the couple's names, self-hosted in `public/fonts/` and preloaded.

---

## Project structure

```
app/
├── page.tsx                  # Landing: loader → treasure chest → invitation
├── itinerary/                # Three-day swipeable itinerary
├── rsvp/                     # RSVP form (localStorage) + confirmation page
├── admin/                    # Login page + dashboard (sample data)
├── api/admin/                # login / logout → session cookie
├── layout.tsx                # Fonts, metadata, music, smooth scroll, analytics
├── opengraph-image.tsx       # Generated link-preview image (WhatsApp/LinkedIn)
├── icon.tsx, apple-icon.tsx  # Generated app icons
└── manifest.ts, sitemap.ts
components/
├── treasure-chest/           # 3D chest, CSS fallback, shake hook, motion sheet, SFX
├── LuxuryInvitation.tsx      # The invitation story page
├── InteractiveItinerary.tsx  # Itinerary carousel + event data
├── CelestialBackdrop.tsx     # Swinging lantern + starfield
├── RealisticButterflies.tsx  # Shader butterflies (loaded via DeferredButterflies)
├── RsvpCelebration.tsx       # Confetti
├── WeddingCountdown.tsx, PaperBackground.tsx, SmoothScroll.tsx
├── AudioProvider.tsx, MusicToggle.tsx, ShareInvite.tsx
└── lightswind/slide-to-confirm.tsx
lib/
├── motion-access.ts          # The one place motion permission is decided
├── device.ts                 # mobile / tablet / desktop classification
├── audio-player.ts           # Singleton background-music player
├── wedding-days.ts           # The three events: single source of truth
├── rsvp-storage.ts           # Guest RSVPs in localStorage (validated on read)
├── dummy-rsvps.ts            # 20 sample RSVPs for the admin panel
├── admin-queries.ts          # Stats, search, filters, sorting
└── admin-auth.ts             # Demo password + session cookie
proxy.ts                      # Protects /admin/dashboard
public/                       # Music, fonts, monogram, logo, decor, butterfly texture
```

---

## Getting started

**Requirements:** Node.js 20 or newer, and npm.

```bash
git clone <this-repo-url>
cd wedding-treasure-rsvp
npm install
npm run dev
```

Open <http://localhost:3000>. No environment variables are needed.

| Script | What it does |
|---|---|
| `npm run dev` | Development server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

**Testing motion on a real phone:** iOS only allows motion permission over **HTTPS**, so `http://<your-lan-ip>:3000` won't trigger the prompt. Deploy a preview (for example on Vercel) or use an HTTPS tunnel. Android works over plain LAN HTTP.

**Deploying:** push to GitHub and import the repo into [Vercel](https://vercel.com). There's nothing to configure. Then update the site URL in `app/layout.tsx`, `app/sitemap.ts` and `components/StructuredData.tsx` so link previews point to your domain.

---

## Make it your own wedding

| What | Where |
|---|---|
| Couple names, families, date, venue, map | [`components/LuxuryInvitation.tsx`](components/LuxuryInvitation.tsx) |
| Couple photos | `PHOTOS` at the top of `LuxuryInvitation.tsx` (currently Unsplash; can be local files in `public/`) |
| Itinerary events, timings, map links | [`components/InteractiveItinerary.tsx`](components/InteractiveItinerary.tsx) |
| Event names in the RSVP form and admin | [`lib/wedding-days.ts`](lib/wedding-days.ts) |
| Countdown target | `WEDDING_MOMENT` in [`components/WeddingCountdown.tsx`](components/WeddingCountdown.tsx) |
| Monogram (loader + chest) | `public/images/monogram.png` |
| Music | `public/audio/main-audio.mp3` |
| Site title, description, URL | [`app/layout.tsx`](app/layout.tsx), [`app/opengraph-image.tsx`](app/opengraph-image.tsx) |
| Admin password | [`lib/admin-auth.ts`](lib/admin-auth.ts) |

---

## Performance and accessibility

**Performance:**

- **Nothing heavy blocks the first paint.** The 3D chest, butterflies, paper shader, confetti and particles are all dynamically imported, and most are deferred until after first paint.
- **The animation loops pause** when the tab is hidden or the element is off-screen.
- **Phones get lighter versions:** fewer butterfly vertices, a capped frame rate, a lower pixel ratio on weak GPUs, and native scrolling.

**Accessibility:**

- **Reduced motion is respected everywhere.** When the guest has `prefers-reduced-motion` turned on, the chest opens faster, and the butterflies, confetti and smooth scrolling are off.
- **Keyboard:**
  - the chest opens with Enter or Space;
  - the slide-to-confirm is a real `role="slider"` and works with the arrow keys;
  - the itinerary has arrow buttons and dots.
- **Screen readers:** decorative art is `aria-hidden`, the form fields have labels, and error sheets use `role="alertdialog"`.
- **Motion is never required.** Every gesture has a tap or click equivalent.

---

## Assets and credits

- **Couple photos:** free images from [Unsplash](https://unsplash.com) under the [Unsplash License](https://unsplash.com/license). They're loaded from `images.unsplash.com`, which is allowed in `next.config.ts`.
- **Monogram:** generated for this demo.
- **Map:** Google Maps embed, with no API key.
- **Music and the Brittany Signature font:** if you reuse this project, replace them with files you have the rights to use.

---

Made with ♥ by **UNSP**
