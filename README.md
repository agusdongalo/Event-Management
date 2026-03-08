# The Private Event Platform for Elite Hosts
Built for high-end event hosts who demand precision, privacy, and seamless guest flow with attendee, organizer, and admin experiences.

**Features**
- Role-based routing for attendee, organizer, and admin
- Auth (email/password signup/login/logout) with session cookies
- Event browsing and event detail pages
- Registrations with attendee and admin/organizer views
- Profile editing (name/email/password) with avatar upload to S3
- Admin dashboards for analytics, events, users, registrations, messages, settings
- Organizer dashboards for events, attendees, bookings, messages, profile
- Attendee account overview with upcoming and recent events

**Tech Stack**
- Next.js (App Router)
- React
- Tailwind CSS
- Prisma
- MySQL
- AWS S3 (or S3-compatible storage)

**Roles**
- admin: full admin dashboard
- organizer: manage events, attendees, bookings, messages, profile
- user (attendee): browse events, register, profile, attendee account

**Portals**
- Attendee: `/attendee`
- Organizer: `/organizer`
- Admin: `/admin`
- Public events: `/events` and `/events/[id]`
- Auth: `/login`, `/signup`
- Profile: `/profile`
- Apply access: `/apply-access`

**Setup**
Install dependencies:
```bash
npm install
```

Configure `.env`:
```bash
DATABASE_URL="mysql://root@localhost:3306/events_demo"
SESSION_SECRET="change-this-to-a-long-random-string"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM=""
S3_BUCKET=""
S3_REGION=""
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
S3_ENDPOINT=""
S3_PUBLIC_URL_BASE=""
S3_FORCE_PATH_STYLE="false"
```

Email (Gmail SMTP):
- Enable 2-Step Verification on your Google account.
- Create an **App Password** for Mail.
- Set:
  - `SMTP_USER` = your Gmail address
  - `SMTP_PASS` = the app password
  - `SMTP_FROM` = a "From" address (often the same as `SMTP_USER`)

Prisma:
```bash
# Generate the Prisma client
npx prisma generate
```

```bash
# Apply checked-in migrations
npx prisma migrate deploy
```

```bash
# Create a new migration during development
npx prisma migrate dev --name your_change_name
```

```bash
# Reset local database and re-apply migrations (drops data)
npx prisma migrate reset
```

If `prisma generate` fails with EPERM on Windows:
```bash
Remove-Item -Recurse -Force node_modules\.prisma
npx prisma generate
```

Run the app:
```bash
npm run dev
```

## Deploy To Render
This repo now includes a [`render.yaml`](./render.yaml) Blueprint for a free Render web service.

Before syncing the Blueprint:
1. Push this repo to GitHub, GitLab, or Bitbucket.
2. In Render, create a new Blueprint and point it to your repo.
3. Create or obtain an external MySQL database from a provider outside Render.
4. During the first sync, fill the prompted secret values.
5. Set `DATABASE_URL` manually for the web service to your external MySQL connection string:

```bash
mysql://USERNAME:PASSWORD@HOST:3306/DATABASE_NAME
```

Notes:
- `DATABASE_URL` must point to an external MySQL database because Render's free web services do not include free MySQL hosting with persistent disks.
- The web service uses `npx prisma migrate deploy` as its pre-deploy step and includes an initial checked-in migration.
- The health check endpoint is `/api/health`.
- Render free web services spin down after 15 minutes of inactivity.
- Free Render web services cannot send outbound traffic to SMTP ports `25`, `465`, or `587`, so Gmail SMTP will not work on the free plan.

If your current local MySQL database was created with `prisma db push`, Prisma may treat it as ahead of the new migration history. In that case, use a fresh database locally or reset it before switching your local workflow fully to migrations.

If you don't need email or S3 uploads immediately, you can leave those secrets blank and add them later in the Render dashboard before using those features.

**Key Paths**
- Landing page: `app/page.tsx`
- Attendee account: `app/attendee/page.tsx`
- Profile: `app/profile/page.tsx`
- Admin dashboard: `app/admin/page.tsx`
- Organizer dashboard: `app/organizer/page.tsx`
- Event detail: `app/events/[id]/page.tsx`
