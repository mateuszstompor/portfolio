# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static single-page portfolio website at https://arctic.codes. Vanilla HTML/CSS/JS with no frameworks. Deployed to OVH FTP server via GitHub Actions on push to main.

## Commands

```bash
# Run locally
python3 -m http.server 8000

# Format check (enforced by CI on PRs and pushes to main)
npx prettier --check "**/*.{html,js,css,md}"

# Format fix
npx prettier --write "**/*.{html,js,css,md}"

# Generate sitemap
npm install && node generate-sitemap.js
```

## Architecture

**Single-page app** — `index.html` (all markup), `assets/css/styles.css` (all styles), `assets/js/script.js` (all behavior).

**JS modules** (all in script.js, vanilla IIFE pattern):
- Parallax scrolling system — disabled below 768px, uses `requestAnimationFrame` and passive listeners
- Project gallery lightbox — modal with keyboard nav (arrows, Esc), ARIA/focus management
- Typewriter animation — rotating taglines with cursor states

**CSS design system** — dark theme using CSS custom properties (`--bg`, `--accent`, `--accent-2`, `--accent-3`, `--text`, `--muted`). Glassmorphism effects via backdrop filters. Breakpoints at 640px, 768px, 980px.

**Contact form** — Formspree integration (contact@arctic.codes endpoint).

## CI/CD

- **formatting.yml** — Prettier check on PRs and main pushes (does not auto-fix)
- **main.yml** — FTP deploy to OVH on main push using `SamKirkland/FTP-Deploy-Action@v4.3.5`

## Media

Large media files (PNG, JPG, MP4, MOV, PDF) are tracked via Git LFS (see `.gitattributes`).
