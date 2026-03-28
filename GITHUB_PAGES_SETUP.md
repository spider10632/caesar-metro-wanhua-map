# GitHub Pages / Google Maps Setup

## 1. Google Cloud

1. Open your Google Cloud project.
2. Confirm billing is enabled.
3. Enable `Maps Embed API`.
4. Open the API key settings for your Maps key.

Recommended restrictions:

- Application restriction: `HTTP referrers (web sites)`
- Allowed referrers:
  - `https://<your-github-user>.github.io/*`
  - `https://<your-github-user>.github.io/<your-repo>/*`
  - Add your custom domain too if you use one, for example `https://map.example.com/*`
- API restriction: `Restrict key`
  - Allow only `Maps Embed API`

## 2. GitHub repository

1. Open your repository on GitHub.
2. Go to `Settings` -> `Secrets and variables` -> `Actions`.
3. Add a repository secret named `GOOGLE_MAPS_API_KEY`.
4. Paste your Google Maps API key there.

## 3. GitHub Pages

1. Go to `Settings` -> `Pages`.
2. For `Source`, choose `GitHub Actions`.
3. Push to `main`.
4. GitHub Actions will build and publish the site.

## Notes

- The repository keeps `google-maps-config.js` empty on purpose.
- The real key is injected only during the GitHub Pages deployment workflow.
- The key will still be visible in the final browser-delivered page source, so restrictions are required.
- Because this key was already pasted into chat/project history, rotating it after restrictions are in place is strongly recommended.
