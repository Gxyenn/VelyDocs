# Cloudflare Pages Deploy (Next.js App Router + API)

`src/app/api/*` **sudah benar** untuk Next.js App Router.
Di Cloudflare Pages, route API tersebut akan di-compile jadi **Pages Functions** saat build memakai `@cloudflare/next-on-pages`.

## Build settings (WAJIB di Dashboard Pages)
- Framework preset: `None`
- Build command: `npm run pages:build`
- Build output directory: `.vercel/output/static`

## Wajib untuk runtime Node API
`nodejs_compat` harus aktif supaya import seperti `node:buffer`/`node:async_hooks` tidak error runtime.
Konfigurasinya sudah ditambahkan di `wrangler.toml`.

## Kenapa deploy masih gagal di Free Plan
Log kamu sekarang sudah berhasil build + upload assets, tapi gagal di langkah publish Function:
- `Your Worker exceeded the size limit of 3 MiB`

Artinya ini limit paket Cloudflare Free, bukan masalah nama folder `api`.

## Opsi solusi
1. Upgrade ke plan berbayar Cloudflare Workers (limit Worker naik sampai 10 MiB).
2. Kurangi ukuran bundle server:
   - pindahkan scraper/API berat ke service terpisah (Railway/Render/VPS),
   - di Pages biarkan frontend saja memanggil API eksternal.
3. Migrasi ke adapter OpenNext Cloudflare (pengganti `next-on-pages`) dan evaluasi ukuran output; tapi untuk project ini biasanya tetap butuh ukuran worker lebih besar dari 3 MiB.

## Catatan penting
- Jangan rename `src/app/api` jadi `functions`.
- Folder `functions` itu untuk proyek Pages Functions manual (tanpa Next.js App Router).
- Di proyek ini, API route Next (`app/api/.../route.ts`) otomatis dipetakan oleh adapter.
