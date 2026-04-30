# Cloudflare Pages Deploy (Next.js App Router + API)

`src/app/api/*` **sudah benar** untuk Next.js App Router.
Di Cloudflare Pages, route API tersebut akan di-compile jadi **Pages Functions** saat build memakai `@cloudflare/next-on-pages`.

## Build settings (WAJIB di Dashboard Pages)
- Framework preset: `None`
- Build command: `npm run pages:build`
- Build output directory: `.vercel/output/static`

## Kenapa jangan pakai `[build]` di `wrangler.toml`
Cloudflare Pages saat ini menolak field `[build]` di `wrangler.toml` untuk Pages project.
Build command harus diisi di Dashboard Pages, bukan di file Wrangler.

## Catatan penting
- Jangan rename `src/app/api` jadi `functions`.
- Folder `functions` itu untuk proyek Pages Functions manual (tanpa Next.js App Router).
- Di proyek ini, API route Next (`app/api/.../route.ts`) otomatis dipetakan oleh adapter.
