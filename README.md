# Varsha V — Portfolio

Single-page marketing & content portfolio. Plain HTML/CSS/JS, no build step.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Main portfolio page |
| `styles.css` | Portfolio styles |
| `script.js` | Nav, scroll progress, reveal animations, theme toggle, contact form |
| `resume.html` | Résumé page, matched to the site palette; "Print / Save as PDF" for a clean one-pager |
| `resume.css` | Résumé styles + print stylesheet |
| `assets/` | Downloadable résumé PDF and other assets |

## Run locally

Just open `index.html` in a browser, or serve the folder:

```
npx serve .
# or
python -m http.server 8000
```

## Deploy

### Netlify (drag & drop — no account setup beyond signup)

1. Go to <https://app.netlify.com/drop>
2. Drag the **`varsha-portfolio`** folder onto the page
3. Netlify gives you a live URL immediately; rename the site in **Site settings → Change site name**

### GitHub Pages

1. Create a repo and push this folder's contents to it
2. Repo **Settings → Pages → Build and deployment**
3. Source: **Deploy from a branch**, Branch: **main** / **/ (root)**, Save
4. Site publishes at `https://<username>.github.io/<repo>/` in a minute or two

The `.nojekyll` file is included so GitHub Pages serves every file as-is.

## Notes

- The contact form posts to [Web3Forms](https://web3forms.com) (no backend). The public `access_key` lives in `index.html`; submissions are emailed to the address registered with that key. If JS is off, the form still submits via a plain POST to Web3Forms.
- Content (reveal animations) stays visible even if JavaScript is disabled.
