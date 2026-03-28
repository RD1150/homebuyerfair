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
