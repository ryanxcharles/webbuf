# Experiment 8: Verified usage examples, overview refresh, and close

## Description

Complete the docs and close the issue. Add a **verified usage example** to each
package page, sourced from the maintainer's own README (never invented), refresh
the docs overview for the corrected 29-package catalog, run a full final
verification, and re-close the issue with a fresh Conclusion.

Source of usage examples: each package README's **first TypeScript/JavaScript
fenced code block** — the maintainer's authoritative example, which lives under
headings like `## Usage` or `## Preferred API`. Packages without any such block
simply show no usage section (the full API reference still renders); nothing is
fabricated.

## Changes

- `ts/website/scripts/extract-api.ts` — also read each package `README.md` and
  capture the first `typescript`/`ts`/`js`/`javascript` fenced block as
  `usage` (string | null) plus `usageLang`.
- `ts/website/src/data/api.ts` — add `usage` / `usageLang` to `PackageApi`.
- `ts/website/src/pages/docs/[slug].astro` — render a **Usage** section
  (`tokyo-night` code block) between Install and the API reference when a usage
  example exists.
- `ts/website/src/pages/docs/index.astro` — refresh the overview copy for the 29
  packages / eight categories.
- Close the issue: add a `## Conclusion`, set frontmatter `status = "closed"`
  + `closed`, regenerate the index.

## Verification

1. `extract:api` captures a usage example for the packages that have one
   (expected ≈ all that ship a TS/JS README block); coverage is logged; the
   catalog is deterministic.
2. `lint` → 0 errors; `check` → 0 errors; `prettier --check` clean.
3. `build` → 31 pages; the completeness re-check (rendered export blocks ==
   catalog counts) still passes for all 29.
4. A sampled package with a README example (e.g. `/docs/blake3`,
   `/docs/secp256k1`) renders a Usage code block matching the README; a package
   without one (e.g. `/docs/mldsa`) renders no Usage block but the full API.
5. `astro preview` (production build) serves `/`, `/docs`, and a package page
   → 200.
6. `pnpm install` at the `ts/` root is clean.

Pass criteria: all steps succeed; then the issue is closed (Conclusion +
frontmatter + index) as a separate close commit.

## Result

**Pass.**

- `extract:api` captured a usage example for **29/29** packages — the
  first-TS/JS-fence heuristic also picks up the `## Preferred API` examples
  (mlkem/mldsa/slhdsa and the hybrid `aesgcm-*` packages), so coverage is total.
  Output remains **idempotent** (identical SHA on re-run).
- Generated `api.generated.json` is now excluded from Prettier
  (`**/*.generated.json` in the shared ignore) so the generator owns its format;
  `prettier --check` is clean across the website.
- `lint` → 0 errors; `check` → 0/0/0; `build` → **31 pages**.
- **Completeness re-check**: 29/29 package pages still render exactly their
  catalog export count (0 mismatches).
- Usage sections render on sampled pages (`blake3`, `secp256k1`, `mldsa`,
  `slhdsa`).
- `astro preview` (production build) serves `/`, `/docs`,
  `/docs/aesgcm-x25519dh-mlkem`, `/docs/numbers` → 200.
- `pnpm install` at the `ts/` root → "Already up to date" (no churn).

## Conclusion

Every package page now carries the maintainer's authoritative usage example
(verified from the README, never invented) above its complete API reference, and
the docs overview reflects the real 29-package catalog. With requirement 4 fully
satisfied — every published package, every export documented in detail, plus a
real usage example — the issue is ready to close. The close (issue Conclusion +
frontmatter + index) follows as a separate close commit per the workflow.
