# Design System Theme Implementation

## Goal

Implement the biasly design-system theme foundation from `C:\Users\Nayan\Downloads\001-design-system-theme.md`: design tokens plus Poppins only.

Do not add components, pages, showcases, or new dependencies.

## Skills read

- None of the repo-approved task skills apply directly. This is a styling foundation task only.
- Read local Next.js 16 docs from `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md`.
- Read local Next.js 16 docs from `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`.
- Read local Next.js 16 docs from `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md`.

## Existing code inspected

- `AGENTS.md`
- `package.json`
- `app/globals.css`
- `app/layout.tsx`
- `C:\Users\Nayan\Downloads\001-design-system-theme.md`

## Decisions and assumptions

- Tailwind v4 is already configured with CSS-first setup through `@import "tailwindcss";`.
- Theme tokens will be defined in `app/globals.css` using Tailwind v4 `@theme inline`.
- Poppins replaces the starter Geist and Geist Mono fonts.
- The app uses a single light theme, so the starter dark-mode media query is removed.
- Metadata is updated to the biasly product copy from the reference.
- Grid rules are captured as reusable theme variables and comments; no layout components are created.

## Files likely to change

- `app/globals.css`
- `app/layout.tsx`

## Implementation requirements

1. In `app/layout.tsx`, import `Poppins` from `next/font/google`.
2. Configure Poppins with `subsets: ["latin"]`, weights `["400", "500", "600", "700"]`, and `variable: "--font-poppins"`.
3. Remove `Geist`, `Geist_Mono`, and their variables.
4. Apply `poppins.variable` on the root `<html>` with the existing `h-full antialiased` classes.
5. Update metadata to `title: "biasly"` and `description: "Balanced news coverage, powered by AI."`.
6. In `app/globals.css`, keep `@import "tailwindcss";`.
7. Set base `--background: #FFFFFF` and `--foreground: #0D0D0F`.
8. Define every design token from the reference using exact values:
   - Colors: text primary, text secondary, surface, bias left, bias center, bias right, primary background, secondary background, border, divider.
   - Typography: H1, H2, H3, H4, body large, body medium, body small, caption with paired line-height tokens.
   - Spacing: `--spacing: 4px`.
   - Radius: small 4px, medium 8px, large 12px, full 9999px.
   - Shadows: small, medium, large.
   - Grid: 1280px container, 12 columns, 24px gutter, 24px outer margin.
9. Map `--font-sans: var(--font-poppins)`.
10. Remove `--font-mono` because the reference does not specify a mono font.
11. Remove the `prefers-color-scheme: dark` block.
12. Keep `body` using `--background`, `--foreground`, and Tailwind's sans family.

## Security requirements

- No server code, secrets, API calls, or data access are introduced.

## Acceptance criteria

- `app/globals.css` contains all exact design tokens from the reference.
- Poppins is loaded through `next/font/google` and is the default sans font.
- No Geist or Geist Mono references remain.
- No dark-mode starter theme remains.
- No components, routes, or dependencies are added.
- Diff is limited to `app/globals.css`, `app/layout.tsx`, and this prompt file.

## Checks to run

- `npm run lint`
- `npm run build`

## Manual test steps

1. Run `npm run dev`.
2. Open the local Next.js URL.
3. Confirm the page renders normally with Poppins as the default font.
4. Confirm theme utilities such as `text-text-primary`, `bg-bg-primary`, `rounded-md`, `shadow-md`, and `text-h1` are available for future UI work.
