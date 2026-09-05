# prxfolio — Pranam Shetty's portfolio

Personal portfolio (Next.js + Tailwind), fork-friendly. Live contributions graph via GitHub API.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional overrides (CV URL, GitHub username, site URL)
npm run dev
```

## Customize (forks)

Rich content lives in `en/*.yaml` — edit those, then run:

```bash
npm run content:sync
```

This regenerates `src/data.ts` (profile, experience, projects). Skills are curated in `src/data.ts`.
Public overrides live in `.env.example` → `.env.local`:

| Var | Purpose | Default |
| --- | ------- | ------- |
| `NEXT_PUBLIC_CV_URL` | Resume/CV button link | Google Drive direct download |
| `NEXT_PUBLIC_GITHUB_USERNAME` | Contribution graph | `prxshetty` |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL | `https://prxshetty.github.io/prxfolio` |

Why not a full `.env` for everything? `.env*` is gitignored (secrets-oriented) and flat key-values handle lists poorly. YAML stays committed, reviewable, and forkable — env only overrides deployment bits.

## Deploy

- **Vercel (recommended):** import repo `prxshetty/prxfolio` → deploy, no config needed.
- **GitHub Pages:** uncomment `output: "export"` + `basePath: "/prxfolio"` in `next.config.ts`, then `npm run build`.

## Content sources

- `en/author.yaml` — name, location, socials, honors, certifications
- `en/experience.yaml` — work history
- `en/projects.yaml` — projects
- `en/blogs.yaml` — Medium posts (not yet rendered in UI)
- CV: https://drive.google.com/file/d/1r6v-fgqYMO6rhngdeFsQP3Gbrn0JECEL/view?usp=sharing
