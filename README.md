# ఆరెకటికె న్యూస్ క్రియేటర్ (Are Katike News Creator)

ఆరెకటికె చైతన్యం డిజిటల్ దినపత్రిక కోసం వార్త ఫోటో కార్డుల తయారీ యాప్. AI లేదు, సర్వర్ లేదు — అంతా బ్రౌజర్‌లోనే.

## Run locally
```
npm install
npm run dev
```

## Deploy on Vercel
1. Push this folder to a GitHub repo.
2. Vercel → Add New Project → import the repo. Framework is auto-detected as **Vite**
   (Build: `npm run build`, Output: `dist`). No environment variables are needed.

## Customising
- **Header:** built in HTML/CSS (`Header` in `src/components/Poster.tsx`, styles `.pz-h-*` in `src/poster.css`). Only `public/logo.png` and `public/charminar.png` are images; replace them with higher-quality versions (same names) for sharper output.
- **Themes / moods:** `src/themes.ts` (colours, headline style, mood keywords).
- **Card layout:** `src/components/Poster.tsx` and `src/poster.css` (1200px wide card).
