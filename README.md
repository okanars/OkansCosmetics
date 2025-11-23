# Okan's Cosmetics — Static Website

Overview
--------
Okan's Cosmetics is a static, frontend-only website that presents cosmetic products and company information. The project is built with plain HTML, CSS and JavaScript and includes:
- Multi-language support via JS translation files and data-i18n attributes
- A product catalog (data-driven)
- Product page generation tooling (optional script)
- A lightweight chatbot UI
- Responsive layout and common accessibility attributes

This README documents the repository structure, how the parts work, how to run and develop locally, and recommended next steps.

Key features
------------
- Static HTML/CSS/JS site (no backend required)
- Language switching using translation files (e.g. `js/lang/en.js`, `js/lang/de.js`)
- Product data stored in a JS module (e.g. `js/products.js`) used to render product lists/details
- Product page generator script (e.g. `js/generate-product-pages.js`) to produce per-product HTML from a template
- Chatbot UI implemented in JS/CSS (`js/chatbot.js`, `css/chatbot.css`)
- Simple footer, navigation and product templates with data attributes for i18n

Repository layout (typical)
---------------------------
- `index.html` — Main landing page (contains header, product links, footer with data-i18n attributes)
- `urunler/` — Product pages (individual product HTML files, or generated)
  - `product-template.html` — Template used by generator (if present)
- `css/`
  - `style.css` — Main site styles
  - `chatbot.css` — Chatbot-specific styles
- `js/`
  - `script.js` — Main front-end logic (DOM wiring, event listeners)
  - `products.js` — Product dataset (array of product objects)
  - `lang/` — Translation modules (e.g. `en.js`, `de.js`)
  - `lang.js` — i18n loader and `updateTexts` function to apply translations
  - `chatbot.js` — Chatbot implementation
  - `product-detail.js` — Logic to populate product detail pages from product data (optional)
  - `generate-product-pages.js` — Node script to generate static product pages (optional)
- `images/`, `videos/` — Media assets
- `README.md` — This file
- `.gitignore` — Ignored files (node_modules, .DS_Store, build artifacts)

How the site works (high level)
------------------------------
- index and other HTML files include `data-i18n` attributes for text nodes that need translation.
- On page load, a language module (e.g. `js/lang/en.js`) is loaded and `updateTexts()` replaces DOM text for elements with `data-i18n`.
- Product list pages read `js/products.js` (an array of product objects) and render cards/links to product detail pages.
- If present, `generate-product-pages.js` reads the product array and a template file to write static HTML pages into `urunler/`.
- The chatbot is a frontend-only component that displays messages, collects user input, and optionally integrates simple scripted responses.
- CSS files provide responsive layout and component styling.

Local development & running
---------------------------
Requirements:
- macOS (you're on Mac)
- Node.js (optional, for the generator and `http-server`)
- Python (optional, for `python -m http.server`) or npm `http-server`

Run a local static server from project root:
- Using Python:
  ```
  python3 -m http.server 8000
  ```
  Then open http://localhost:8000/

- Using npm (if Node.js installed):
  ```
  npx http-server -p 8000
  ```

Typical dev workflow:
1. Edit files in VS Code.
2. Check JS console for runtime errors (Developer Tools -> Console).
3. Use the network tab to ensure assets load (CSS, JS, images).
4. If product pages are generated:
   ```
   node js/generate-product-pages.js
   ```
   Inspect `urunler/` for generated HTML files.

Git / repository operations
---------------------------
- Initialize git (if needed):
  ```
  git init
  git add -A
  git commit -m "Initial commit"
  git branch -M main
  ```

- Add a remote and push:
  ```
  git remote add origin https://github.com/okanars/OkansCosmetics-New.git
  git push -u origin main
  ```

- If push rejects because the remote is ahead:
  - Preferred: merge or rebase
    ```
    git fetch origin
    git pull --rebase origin main
    git push origin main
    ```
  - Force push only if you intend to overwrite remote history:
    ```
    git push --force-with-lease origin main
    ```

Troubleshooting
---------------
- Missing translations: ensure `js/lang/<code>.js` exists and keys match `data-i18n` attributes.
- Images 404: check relative paths under `/images/` or usage of absolute paths.
- Non-fast-forward push error: fetch & rebase/merge before pushing (see above).
- Generator script errors: run `node js/generate-product-pages.js` and read stack trace; ensure template path and product data exist.

Quality & improvement suggestions
---------------------------------
- Add package.json and npm scripts:
  - "start" to run a static server
  - "generate" to run the product generator
- Add linting (ESLint) and Formatting (Prettier) for consistent JS/CSS
- Add automated tests for critical JS modules (e.g. product data parsing)
- Consider moving product data to JSON (easier to consume by generator and potential API)
- Add continuous deployment (Netlify, Vercel, GitHub Pages) with a simple CI workflow
- Add LICENSE and CONTRIBUTING.md if the repo will be public/collaborated on

Security & privacy notes
------------------------
- Do not store secrets (API keys, credentials) in this repository.
- If integrating analytics or third-party chat engines, ensure privacy policy and cookie consent are handled.

Contact & further steps
-----------------------
- For merging local changes into a different remote repository, create a backup branch before operations:
  ```
  git branch backup/local-before-remote-merge
  git push origin backup/local-before-remote-merge
  ```
- If you want, I can:
  - create this README file in the project,
  - commit it, and provide the exact push commands for the new remote you choose,
  - or generate recommended package.json, GitHub Actions workflow, or a LICENSE file.
