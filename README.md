# Events Management Demo

Next.js demo for the events management experience (attendee, organizer, admin).

## Getting Started

Install dependencies:

```bash
npm install
```

Set env vars in `.env`:

- `DATABASE_URL`
- `SESSION_SECRET`
- `S3_BUCKET`
- `S3_REGION`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`
- `S3_ENDPOINT` (optional for S3-compatible storage)
- `S3_PUBLIC_URL_BASE` (optional CDN/public base)
- `S3_FORCE_PATH_STYLE` (`true` for path-style endpoints)

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Prisma

This repo may start without a migrations history. If you see drift errors, use one of these paths.

Fast dev sync (no migrations):

```bash
npx prisma db push
npx prisma generate
```

Reset and create migrations (drops data):

```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

If `prisma generate` fails with an EPERM error on Windows, stop the dev server, then:

```bash
Remove-Item -Recurse -Force node_modules\.prisma
npx prisma generate
```

## Profile Avatars

Avatar uploads are stored in S3. If S3 env vars are missing, the profile API will reject avatar uploads.
