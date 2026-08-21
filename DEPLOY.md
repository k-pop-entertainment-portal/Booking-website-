# Deploy to GitHub Pages (2 minutes)

The entire production site is **`dist/index.html`** — a single fully
self-contained file (all code, styles and logic are inlined; every image is
absolute https). No asset folders are required.

## Step-by-step

1. Open your repository on GitHub
2. If an **old `index.html`** exists there, delete it (or the new upload will
   replace it anyway — deleting first avoids confusion)
3. Click **Add file → Upload files**
4. Drag in the built **`dist/index.html`**
5. Scroll down and press **Commit changes**
6. Go to **Settings → Pages** ("Code and automation")
7. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/(root)`
   - Press **Save**
8. Wait 2–5 minutes, then open your Pages URL:
   `https://<username>.github.io/<repo-name>/`
9. **Hard refresh:** Ctrl + F5 (Windows) or Cmd + Shift + R (Mac) — GitHub
   Pages caches aggressively.

## Do NOT do these (most common failures)

- **Don't upload `src/`, `package.json`, `node_modules`** expecting the site
  to build itself. GitHub Pages only *serves* static files — it never runs
  `npm run build`. Only the file inside `dist/` works.
- **Don't paste `index.html` into the GitHub text editor** — it's ~500 KB of
  minified code and will freeze the browser tab. Drag & drop upload instead.
- **Don't rename or move it into a subfolder** — it must sit at the repo root
  as `index.html`.

## Quick diagnosis

| Symptom                      | Cause / fix                                            |
| ---------------------------- | ------------------------------------------------------ |
| 404 on the Pages URL        | Pages not enabled (step 6) or index.html not at root   |
| Old version keeps showing   | GitHub Pages cache — hard refresh / incognito window   |
| Blank white page            | You uploaded source instead of `dist/index.html`       |
| 404 on `/repo/` but works on `/repo/index.html` | Normal while cache propagates; wait and hard-refresh   |
