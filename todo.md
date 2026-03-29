# Homebuyer Extravaganza - Project TODO

## Database & Backend
- [x] Add `registrations` table to drizzle/schema.ts
- [x] Generate and apply migration SQL
- [x] Add registration query helpers to server/db.ts
- [x] Add tRPC procedures: register (public), listRegistrations (admin), exportCSV (admin)

## Frontend - Landing Page
- [x] Design elegant color palette and global styles in index.css
- [x] Build hero section with event title, date, time, and CTA button
- [x] Build event highlights section (free event, $58K DPA, lunch, entertainment, kids corner)
- [x] Build "What You'll Learn" section
- [x] Build event details / location section with map link
- [x] Build registration form section with validation
- [x] Build confirmation/success screen after registration
- [x] Build footer with organizer info

## Frontend - Admin Dashboard
- [x] Admin route with login protection
- [x] Sortable registrations table (name, email, phone, adults, children, date)
- [x] CSV export button
- [x] Registration count summary cards

## Quality & Polish
- [x] Responsive design (mobile + desktop)
- [x] Form validation with error messages
- [x] Loading states and toast notifications
- [x] Write vitest tests for registration procedures

## Render Deployment
- [x] Install pg / drizzle-orm postgres adapter, remove mysql2
- [x] Update drizzle/schema.ts to use PostgreSQL types
- [x] Update drizzle.config.ts to use postgres dialect
- [x] Update server/db.ts to use postgres driver
- [x] Update server/_core env references for DATABASE_URL
- [x] Generate new migration SQL for postgres
- [x] Add render.yaml Blueprint config
- [x] Push all changes to GitHub RD1150/homebuyerfair

## Admin Password Auth (Render-compatible)
- [ ] Add admin.login and admin.logout tRPC procedures with password check
- [ ] Store admin session in a signed JWT cookie (no Manus OAuth dependency)
- [ ] Update Admin.tsx to show password login form instead of Manus OAuth
- [ ] Add ADMIN_PASSWORD env var to render.yaml
- [ ] Push to GitHub
