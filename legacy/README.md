# Neex Creative - Portfolio Website

Source code for the Neex Creative portfolio, a multidisciplinary design studio based in Dublin, Ireland.

## Live

- Production: https://www.neexcreative.com
- Vercel: https://neexcreativeio.vercel.app

## Project Structure

```text
/
|-- index.html          - Homepage
|-- about.html          - About Marlon
|-- book.html           - Book a Call (Calendly)
|-- favicon.ico
|-- robots.txt
|-- sitemap.xml
|
`-- Assets/
    |-- css/
    |   `-- style.css   - Global design system
    |-- js/
    |   `-- main.js     - Scroll reveal, nav active state, year
    |-- img/
    |   |-- logo.png
    |   |-- hero-bg.png
    |   |-- marlon.png
    |   `-- projects/   - Project thumbnails
    |-- icons/          - Favicons and webmanifest
    `-- docs/
        `-- Resume-MarlonFranca2026.pdf
```

## Run Locally

1. Install Live Server in VS Code.
2. Right-click `index.html`.
3. Choose `Open with Live Server`.

## Deploy

```bash
git add .
git commit -m "describe your change here"
git push origin main
```

Vercel deploys automatically on every push to `main`.
GitHub Pages updates within 1-2 minutes.

## Stack

HTML, CSS, Vanilla JS, hosted on Vercel and GitHub Pages.

## React Component Integration Test

The `dotted-surface.tsx` component cannot be added directly to this repository in its current form.

This codebase currently does not include:

- React or Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui structure
- `package.json` or npm dependency management

The component you shared depends on all of those pieces, plus:

- `three`
- `next-themes`
- the `cn` helper from `@/lib/utils`
- a client-rendered React app

## Expected Paths In a Compatible App

Default paths in a standard Next.js + shadcn setup are:

- Components: `/components/ui`
- Shared utility: `/lib/utils.ts`
- Global styles: `/app/globals.css`

If your project does not already use `/components/ui`, it is still worth creating it because:

- shadcn/ui examples and generators assume that location
- reusable UI primitives stay separate from page-level components
- imports stay predictable across the app
- future component drops become much faster to integrate

## Recommended Setup

If you want to use this component, the clean path is to create or migrate to a Next.js app first:

```bash
npx create-next-app@latest neex-react --typescript --tailwind --app
cd neex-react
npx shadcn@latest init
npm install three next-themes lucide-react
```

Then place the files here:

- `/components/ui/dotted-surface.tsx`
- `/app/demo/page.tsx` or another route/page that renders the demo

## Notes Before Pasting the Component

1. Add `ThemeProvider` from `next-themes` at the app root because `DottedSurface` uses `useTheme()`.
2. Confirm your alias configuration supports `@/components` and `@/lib`.
3. Keep this as a client component because it uses refs, effects, WebGL, and browser APIs.
4. Decide whether it should be a full-page background or scoped to a single section.

## Questions To Answer Before Integration

- What props or wrapper content should be passed into `DottedSurface`?
- Does the page need dark/light theme switching, or should the dot color be fixed?
- Is the expected behavior full-screen on mobile as well as desktop?
- Should the animation sit behind the homepage hero, a services section, or a dedicated demo page?
- Are there any performance limits for lower-end devices that should reduce particle density?

## Asset Notes

The shared component does not require images, logos, or SVG assets.

- No Unsplash placeholders are needed for this specific component.
- No Lucide icons are required unless you want to build a richer demo section around it.

## Next Step

If you want, the next step can be one of these:

1. I can scaffold a React/Next version of this site in a new folder and wire this component in properly.
2. I can adapt the visual effect into plain HTML canvas or Three.js so it works inside the current static site.
