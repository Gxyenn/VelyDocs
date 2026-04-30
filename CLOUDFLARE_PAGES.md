# Cloudflare Pages Deploy (Next.js App Router + API)

`src/app/api/*` **sudah benar** untuk Next.js App Router.
Di Cloudflare Pages, route API tersebut akan di-compile jadi **Pages Functions** saat build memakai `@cloudflare/next-on-pages`.

## Build settings (Cloudflare Pages)
- Framework preset: `None` (atau Next.js jika tersedia, tapi tetap pakai command di bawah)
- Build command: `npm run pages:build` (sudah di-set juga di `wrangler.toml`)
- Build output directory: `.vercel/output/static`

## Catatan penting
- Jangan rename `src/app/api` jadi `functions`.
- Folder `functions` itu untuk proyek Pages Functions manual (tanpa Next.js App Router).
- Di proyek ini, API route Next (`app/api/.../route.ts`) otomatis dipetakan oleh adapter.
