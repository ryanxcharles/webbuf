# Experiment 5: Final verification and close

## Description

A clean-room verification pass over the whole website package before closing the
issue: confirm formatting (Prettier), that the image pipeline is reproducible
(idempotent re-run), that lint / type-check / build are all green, and that the
production build serves over `astro preview` — not just `astro dev`. Also
confirm the new package did not disturb the rest of the `ts/` workspace install.

## Changes

No source changes expected beyond any Prettier formatting. This experiment is
verification only.

## Verification

1. `pnpm --filter @webbuf/website exec prettier --check . --ignore-path ../.prettierignore`
   reports all files formatted (run the `format` writer if not, then re-check).
2. `pnpm --filter @webbuf/website build:images` re-run produces no content
   changes (git shows the generated assets unchanged) — the pipeline is
   deterministic.
3. `pnpm --filter @webbuf/website lint` → 0 errors.
4. `pnpm --filter @webbuf/website check` → 0 errors.
5. `pnpm --filter @webbuf/website build` → succeeds (17 pages).
6. `astro preview` serves the production build: `GET /`, `/docs`,
   `/docs/secp256k1` → 200.
7. `pnpm install` at the `ts/` root is clean (no lockfile churn, all 31
   workspace projects resolve).

Pass criteria: all steps succeed.

## Result

**Pass.**

1. Prettier: after adding `**/.astro/` to the shared `ts/.prettierignore` and
   formatting `scripts/process-images.ts`, `prettier --check` reports
   "All matched files use Prettier code style!"
2. Image pipeline is **idempotent** — the SHA of all generated assets is
   identical before and after a re-run (`90d0d3a…`).
3. `lint` → 0 errors.
4. `check` → 0 errors, 0 warnings.
5. `build` → 17 pages.
6. `astro preview` (production build) serves `GET /`, `/docs`,
   `/docs/secp256k1` → 200.
7. `pnpm install` at the `ts/` root → "Already up to date" across all 31
   workspace projects; no lockfile churn.

## Conclusion

The website is complete and verified end-to-end: formatted, lint/type/build
clean, deterministic image pipeline, and serving correctly under both `astro
dev` and `astro preview`, with the rest of the workspace undisturbed. The issue
goal is met; closing.
