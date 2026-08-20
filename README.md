# Mivatur

Next.js 16 ve OpenNext tabanlı Cloudflare Workers uygulaması.

## Cloudflare kaynakları

- D1: `mivatur-db`
- R2 medya: `mivatur-media`

## Yerel kurulum

```bash
npm install
npm run cf:typegen
npm run cf:migrate:local
npm run cf:seed:local
npm run cf:create-admin
npm run dev
```

## Kontrollü remote işlemler

```bash
npm run cf:migrate:remote
npm run cf:seed:remote
npm run cf:create-admin # script içinde remote seçeneğini onaylayın
```

Önizleme ve deploy:

```bash
npm run preview
npm run deploy
```

`.dev.vars` Git tarafından izlenmez. Gerçek parola veya secret değerlerini repoya eklemeyin.
