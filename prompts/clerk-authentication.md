# Clerk Authentication Implementation Prompt

## Goal

Implement Clerk authentication for the Next.js 16 App Router project so users can sign in, sign up, sign out, access a protected account page, and view protected news detail pages.

## Skills Read

- `.agents/skills/clerk/SKILL.md`
- `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`
- `AGENTS.md`

## Existing Code Inspected

- `package.json`
- `.env.local`
- `app/layout.tsx`
- `app/page.tsx`
- `app/news/trump-sends-iran-revised-peace-proposal/page.tsx`
- `app/globals.css`

## Decisions And Assumptions

- Use the current Clerk Next.js SDK because no Clerk dependency is installed yet.
- Add `@clerk/nextjs` as the only new runtime dependency.
- Use Next.js 16 `proxy.ts` instead of deprecated `middleware.ts`.
- Keep the homepage public and protect `/account` plus news detail routes under `/news`.
- Use Clerk-hosted components through App Router catch-all routes for sign-in and sign-up.
- Preserve the existing visual style and make the smallest useful UI changes.

## Files Likely To Change

- `package.json`
- `package-lock.json`
- `app/layout.tsx`
- `app/page.tsx`
- `app/news/trump-sends-iran-revised-peace-proposal/page.tsx`
- `proxy.ts`
- `app/sign-in/[[...sign-in]]/page.tsx`
- `app/sign-up/[[...sign-up]]/page.tsx`
- `app/account/page.tsx`
- `.env.example`

## Implementation Requirements

- Install `@clerk/nextjs`.
- Wrap the root layout with `ClerkProvider`.
- Add Clerk auth routes at `/sign-in` and `/sign-up`.
- Add `proxy.ts` using Clerk route protection for `/account` and `/news/:path*`.
- Add an account page that shows authenticated user profile information.
- Replace static `Login` buttons with Clerk-aware controls using `SignedIn`, `SignedOut`, `SignInButton`, and `UserButton`.
- Add sign-in and sign-up URL environment entries to `.env.example`.
- Add `typecheck` script if missing so the required project check exists.

## Security Requirements

- Keep `CLERK_SECRET_KEY` server-only.
- Expose only `NEXT_PUBLIC_CLERK_*` values to browser code.
- Do not add real secrets to `.env.example`.
- Keep the homepage and auth pages public.

## Acceptance Criteria

- Public homepage renders for signed-out users.
- Signed-out users can open `/sign-in` and `/sign-up`.
- Signed-out users visiting `/account` are redirected to sign in.
- Signed-out users visiting `/news/trump-sends-iran-revised-peace-proposal` are redirected to sign in.
- Signed-in users see the account page and user menu.
- Signed-in users can view news detail pages.
- TypeScript and lint checks pass.
- Production build passes because auth affects app layout and routing.

## Checks To Run

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Manual Test Steps

1. Run `npm run dev`.
2. Visit `http://localhost:3000` and confirm public news content renders.
3. Visit `http://localhost:3000/news/trump-sends-iran-revised-peace-proposal` while signed out and confirm Clerk redirects to sign-in.
4. Click `Login` and complete Clerk sign-in.
5. Visit `http://localhost:3000/account` while signed in and confirm user details render.
6. Visit `http://localhost:3000/news/trump-sends-iran-revised-peace-proposal` while signed in and confirm the article renders.
7. Sign out from the user menu.
8. Visit `http://localhost:3000/account` while signed out and confirm Clerk redirects to sign-in.
