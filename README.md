# Steam Market

A React/Vite dashboard for exploring Steam game pricing benchmarks and market trends.

## Development

Install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Do not open `index.html` directly from the file system,
because the benchmark needs the web server to load `public/games.csv`.

Create a production build with `npm run build`, or serve it locally with `npm run preview`.

The dashboard includes Overview, Price benchmark, Market: price, Market: genre, Yearly trends,
and Methodology. The interactive benchmark loads `public/games.csv`.
