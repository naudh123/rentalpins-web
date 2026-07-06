# Builder Mini Websites + Project Microsites + Interactive Plot Finder

**RentalPins Revenue Module — Architecture Blueprint**

> Generated: July 2026 · Phase 0 codebase research complete  
> Status: Implementation in progress

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Codebase Research Findings](#codebase-research-findings)
3. [URL Strategy (No Breaking Changes)](#url-strategy-no-breaking-changes)
4. [Product Modules](#product-modules)
5. [Database Design](#database-design)
6. [API Routes](#api-routes)
7. [Frontend Architecture](#frontend-architecture)
8. [SEO & Structured Data](#seo--structured-data)
9. [Authentication & Access Control](#authentication--access-control)
10. [Revenue / Monetization Schema](#revenue--monetization-schema)
11. [Phased Implementation Plan](#phased-implementation-plan)
12. [Sample Data](#sample-data)
13. [Testing Guide](#testing-guide)
14. [Known Limitations & Next Steps](#known-limitations--next-steps)

---

## Executive Summary

RentalPins evolves from a rental/sale marketplace into a PropTech platform where **builders, developers, and colonizers** get SEO-friendly mini websites inside RentalPins. This module adds:

- Builder profile pages
- Project microsites with inventory
- Interactive master plan / plot finder
- Lead capture + CRM
- Admin dashboard for RentalPins staff and builder teams
- Future monetization via builder subscription plans

**Tech stack (existing):** Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS 4 · Firebase/Firestore · Firebase Auth · Google Maps API

**Implementation principle:** All new routes and collections are **additive**. Existing listing flows, SEO pages, and indexed URLs remain unchanged.

---

## Codebase Research Findings

### Frontend Structure

```
RentalPins_Full_web/
├── app/                    # Next.js App Router (no pages/ directory)
│   ├── (seo)/              # Programmatic SEO route group (URL has no segment)
│   ├── api/                # Route handlers
│   ├── buy/projects/       # Buy-side project marketing (static config)
│   ├── projects/           # Rent-side project marketing (inline data)
│   ├── developers/         # PropTech showcase
│   ├── listings/           # Listing detail
│   ├── admin/agent/        # Only existing admin page
│   └── layout.tsx          # Root: Auth, Maps, Analytics providers
├── components/             # Feature-grouped UI (map/, seo/, listings/, etc.)
├── hooks/                  # Map/search orchestration (40+ hooks)
├── lib/                    # Business logic, configs, Firestore services
│   ├── seo/                # metadata.ts, factories, seoData.ts
│   ├── sale/               # buy-projects-config.ts
│   ├── types/              # listing.ts, buyer-requirement.ts
│   └── firebase-*.ts       # Client + Admin SDK
└── middleware.ts           # SEO redirects only (no auth middleware)
```

| Item | Value |
|------|-------|
| Framework | Next.js 16.1.1, React 19.2.3 |
| Styling | Tailwind CSS 4, CSS variables in `globals.css` |
| Path alias | `@/*` → project root |
| Design system | Custom `.rp-btn`, brand navy/orange, sale gold/ivory tokens |
| No shadcn/ui | Custom Tailwind components throughout |

### Backend / Database

| Layer | Technology | Key File |
|-------|------------|----------|
| Client DB | Firebase Firestore SDK | `lib/firebase-client.ts` |
| Server DB | Firebase Admin | `lib/firebase-admin.ts` |
| Auth | Firebase Auth (Google + Phone OTP) | `components/providers/AuthProvider.tsx` |
| Rules/indexes source of truth | `../rentit_clean` | `firestore.indexes.web-additions.json` |
| Payments | Razorpay/PayPal Cloud Functions | Per-listing activation, not subscriptions |

**Existing Firestore collections:** `users`, `listings`, `deactivated_listings`, `archived_listings`, `listing_plans`, `boost_plans`, `payments`, `chat_rooms`, `saved_searches`, `buyer_requirements`, `blog_posts`, `agent_conversations`, etc.

### Routing Pattern

- **App Router only** — static `page.tsx`, dynamic `[param]`, route groups `(seo)` (invisible in URL)
- **Marketing pages:** 3-line factory exports via `lib/seo/marketing-page-factory.tsx`
- **Entity SEO pages:** `slugEntityPageExports()` from `lib/seo/seo-page-factory.ts`
- **Buy projects:** Config-driven at `lib/sale/buy-projects-config.ts` → `/buy/projects/[city]/[slug]`
- **Rent projects:** Inline hardcoded data → `/projects/[city]/[project-slug]`
- **Builders SEO:** `(seo)/builders/[builderSlug]` → `/builders/[builderSlug]` (static seoData)
- **Developers:** `/developers/[developer-slug]` (separate showcase, inline data)

### Authentication System

- Firebase Auth with profile in `users/{uid}`
- Roles: `user` (default), `admin`, `sysadmin`, `superadmin`
- Server check: `verifyAuthToken()` + `getUserRole()` + `isAdminRole()` in `lib/firebase-auth-server.ts`
- **No route-level auth middleware** — pages and API routes enforce auth individually
- New roles for this module: `builder_admin`, `builder_sales` (stored on `builder_users` collection + optional `users.role` extension)

### Listing Model (Reference)

Canonical type: `lib/types/listing.ts` → `ListingDocument`  
Lifecycle: `listings` → `deactivated_listings` → `archived_listings`  
Activation via `listing_plans` + Razorpay/PayPal Cloud Functions.

**This module does NOT modify the listing model.**

### Admin Dashboard (Current)

Only `/admin/agent` exists (AgentMetricsDashboard). Blog CRUD via API.  
**New admin section:** `/admin/builders`, `/admin/projects`, `/admin/project-units`, `/admin/project-leads`, `/admin/master-plan/[projectId]`

### Payment / Subscription (Current)

Per-listing activation + credit-based boosts. No SaaS subscriptions today.  
**New module:** Schema supports `builderPlan`, `planStatus`, dates — payment integration deferred to Phase 6.

### SEO Implementation

- Central builder: `lib/seo/metadata.ts` → `buildPageMetadata()`
- Canonical URLs: `lib/seo.ts` → `canonicalUrl()`
- JSON-LD: `components/JsonLd.tsx`, page-level schemas
- Sitemaps: Split architecture in `app/sitemap*.ts` and `app/*-sitemap.xml/route.ts`
- Staging: full `noindex` via layout metadata
- **Rule:** Never remove or change existing SEO page URLs

### Google Maps / Location

- Single loader: `GoogleMapsLoaderProvider` → `useJsApiLoader` (Places library)
- Map stack: `SearchMap` → `MapCanvas` + 40+ hooks
- Posting: `components/post/LocationPicker.tsx`
- Listing detail: `ListingMapSnippet.tsx`
- Default center: Chandigarh Tricity (30.7333, 76.7794)
- **Project microsites:** Reuse `GoogleMap` + `Marker` pattern from LocationPicker for project location sections

---

## URL Strategy (No Breaking Changes)

### Conflict Analysis

| Desired URL | Existing Route | Resolution |
|-------------|----------------|------------|
| `/builders/[builderSlug]` | `(seo)/builders/[builderSlug]` (static seoData) | **Enhance existing route:** Firestore published builder takes priority; fallback to seoData entity |
| `/projects/[projectSlug]` | Conflicts with `/projects/[city]` (same segment depth) | **Vanity redirect:** `/projects/{slug}` when `{slug}` is not a city → lookup project by slug → 308 redirect to `/projects/{citySlug}/{slug}` |
| `/projects/{city}/{slug}` | Existing rent marketing page | **Enhance:** Firestore project overlay; keep static fallback for indexed pages |
| `/projects/{city}/{slug}/plots` | New | Additive sub-route |
| `/projects/{city}/{slug}/master-plan` | New | Additive sub-route |
| `/developers/*` | Existing showcase | **Untouched** |
| `/buy/projects/*` | Existing buy config | **Untouched** (can cross-link to microsites) |

### Canonical URL Pattern

```
/builders/{builderSlug}                           → Builder profile
/projects/{citySlug}/{projectSlug}                  → Project microsite (canonical)
/projects/{projectSlug}                             → Redirect → canonical (if not a city slug)
/projects/{citySlug}/{projectSlug}/plots             → Inventory table
/projects/{citySlug}/{projectSlug}/master-plan      → Interactive plot finder
```

### New Admin Routes (not indexed)

```
/admin/builders
/admin/builders/new
/admin/builders/[id]
/admin/projects
/admin/projects/new
/admin/projects/[id]
/admin/project-units
/admin/project-leads
/admin/master-plan/[projectId]
```

---

## Product Modules

### 1. Builder Profiles

Public page at `/builders/[builderSlug]` with: name, logo, cover, description, RERA, contact, social links, project lists (ongoing/completed/upcoming), gallery, CTAs (Call, WhatsApp, Enquire, View Projects).

### 2. Project Microsites

Public page at `/projects/[city]/[project-slug]` with: hero, location map, project facts, amenities, gallery, brochure, FAQs, inventory summary, lead form, similar projects.

### 3. Plot Inventory System

Flexible `project_units` collection supporting plots and apartments/villas. Filters: status, size, price, facing. Summary cards: Total, Available, Reserved, Sold, Coming Soon.

### 4. Interactive Master Plan (Phase 1 + 2)

- Admin uploads master plan image(s)
- Markers placed as **percentage coordinates** (`xPercent`, `yPercent`)
- Phase 2: Multiple angles (`default`, `angle1`–`angle4`) with per-angle hotspots
- Public: color-coded markers, click popup with plot details + CTAs

**Status colors:**

| Status | Color |
|--------|-------|
| Available | Green `#16a34a` |
| Reserved | Orange `#ea580c` |
| Sold | Red `#dc2626` |
| Coming Soon | Blue `#2563eb` |
| Hold | Purple `#9333ea` |
| Not Released | Gray `#6b7280` |

### 5. Builder/Admin Dashboard

CRUD for builders, projects, units, master plans, leads. Role-based access (super admin, builder admin, sales staff).

### 6. Public Lead Capture

Forms on builder/project/plot/master-plan pages. Sources: `builder_page`, `project_page`, `plot_popup`, `master_plan`, `brochure_download`, `featured_project`, `city_page`.

### 7. Revenue Model (Schema Only — Phase 6)

Plans: Basic Builder Page, Project Microsite, Premium Plot Finder, Enterprise. Fields on builder document for future Stripe/Razorpay integration.

---

## Database Design

### Collections

| Collection | Document ID | Purpose |
|------------|-------------|---------|
| `builders` | Auto | Builder company profiles |
| `builder_projects` | Auto | Project microsites |
| `project_units` | Auto | Plots/apartments/villas inventory |
| `project_leads` | Auto | Enquiry CRM |
| `project_master_plans` | `{projectId}` | Master plan images + metadata |
| `builder_users` | Auto | Builder team access mapping |

> Collection name `builder_projects` avoids ambiguity with marketing "projects" pages. API and UI refer to them as "projects".

### TypeScript Types

Location: `lib/types/builder-microsite.ts`

See implementation for full interfaces: `Builder`, `BuilderProject`, `ProjectUnit`, `ProjectLead`, `ProjectMasterPlan`, `BuilderUser`, plan enums, status enums, hotspot coordinates.

### Firestore Indexes

Added to `firestore.indexes.web-additions.json`:

- `builder_projects`: `builderId + isPublished + updatedAt`
- `builder_projects`: `slug + isPublished`
- `builder_projects`: `citySlug + isPublished + updatedAt`
- `project_units`: `projectId + status + updatedAt`
- `project_units`: `builderId + status`
- `project_leads`: `builderId + createdAt DESC`
- `project_leads`: `projectId + leadStatus + createdAt DESC`
- `builder_users`: `userId + builderId`

### Security Rules (rentit_clean)

Public read: published builders/projects/units.  
Write: admin roles or assigned builder_users.  
Leads: public create; read/update by admin or assigned builder team.

---

## API Routes

| Route | Methods | Auth | Purpose |
|-------|---------|------|---------|
| `/api/builders` | GET, POST | GET public; POST admin | List/create builders |
| `/api/builders/[id]` | GET, PUT, DELETE | GET public if published; mutating admin | Builder CRUD |
| `/api/builders/slug/[slug]` | GET | Public | Fetch by slug |
| `/api/builder-projects` | GET, POST | GET public; POST admin | List/create projects |
| `/api/builder-projects/[id]` | GET, PUT, DELETE | Mixed | Project CRUD |
| `/api/builder-projects/slug/[slug]` | GET | Public | Fetch by slug |
| `/api/project-units` | GET, POST | GET public; POST admin | Units list/create |
| `/api/project-units/[id]` | PUT, DELETE | Builder team | Unit update |
| `/api/project-units/bulk` | POST | Admin | CSV bulk import |
| `/api/project-leads` | GET, POST | POST public; GET admin | Lead capture/list |
| `/api/project-leads/[id]` | PUT | Builder team | Lead status update |
| `/api/master-plans/[projectId]` | GET, PUT | GET public; PUT admin | Master plan config |
| `/api/builders/seed` | POST | Admin (dev) | Seed sample data |

---

## Frontend Architecture

### New lib modules

```
lib/types/builder-microsite.ts       # All TypeScript interfaces
lib/builders/builders-server.ts      # Server-side Firestore reads (SSR)
lib/builders/builders-client.ts      # Client-side admin CRUD
lib/builders/projects-server.ts
lib/builders/units-server.ts
lib/builders/leads-server.ts
lib/builders/master-plans-server.ts
lib/builders/builder-auth.ts         # Role/access helpers
lib/builders/format.ts               # Price, size formatting
lib/builders/unit-status-colors.ts   # Marker color map
lib/builders/sample-data.ts          # Dev seed definitions
lib/builders/project-paths.ts        # URL helpers
lib/builders/project-schema.ts       # JSON-LD builders
```

### New components

```
components/builders/
├── BuilderProfilePage.tsx
├── ProjectMicrositePage.tsx
├── ProjectInventoryTable.tsx
├── ProjectInventoryFilters.tsx
├── ProjectLeadForm.tsx
├── ProjectStickyCta.tsx
├── MasterPlanViewer.tsx
├── MasterPlanEditor.tsx
├── PlotMarkerPopup.tsx
├── BuilderAdminShell.tsx
├── StatusBadge.tsx
└── InventorySummaryCards.tsx
```

### Public pages

- Enhanced `(seo)/builders/[builderSlug]/page.tsx`
- New `app/builders/page.tsx` (builder directory index)
- Enhanced `app/projects/[city]/page.tsx` (slug vanity redirect)
- Enhanced `app/projects/[city]/[project-slug]/page.tsx`
- New `app/projects/[city]/[project-slug]/plots/page.tsx`
- New `app/projects/[city]/[project-slug]/master-plan/page.tsx`

### Admin pages

Under `app/admin/` with shared `BuilderAdminShell` navigation.

---

## SEO & Structured Data

Each public page uses `buildPageMetadata()` with:

- Dynamic title, description
- Canonical URL via `projectPath()` / `builderPath()` helpers
- OpenGraph image (builder logo / project hero)
- Twitter card

JSON-LD schemas:

- Builder page: `RealEstateAgent` + `LocalBusiness` + `BreadcrumbList`
- Project page: `RealEstateListing` + `Residence` + FAQPage
- Breadcrumbs: Home → Builders → {Builder} → {Project}

Sitemap additions (Phase 6): register published builder/project paths in `app/sitemap.ts`.

---

## Authentication & Access Control

| Role | Capabilities |
|------|-------------|
| `admin` / `sysadmin` / `superadmin` | Full CRUD all builders, projects, units, leads, master plans |
| `builder_admin` (via builder_users) | Manage assigned builder + its projects, units, leads |
| `builder_sales` (via builder_users) | Manage leads + unit status only |
| Public | Read published pages; submit leads |

Access check flow:

1. Verify Firebase ID token
2. Check `users.role` for RentalPins admin
3. Else check `builder_users` for builder assignment + role

---

## Revenue / Monetization Schema

Builder document fields (no payment integration in Phase 1–5):

```typescript
builderPlan: "basic" | "microsite" | "premium" | "enterprise"
planStatus: "active" | "trial" | "expired" | "cancelled"
planStartDate: Timestamp | null
planEndDate: Timestamp | null
featuredUntil: Timestamp | null
isFeatured: boolean
maxProjects: number
maxLeads: number
allowedModules: string[]  // e.g. ["profile", "microsite", "plot_finder", "crm"]
```

Project document: `isFeatured`, `featuredUntil`, `viewCount`, `enquiryCount`.

---

## Phased Implementation Plan

| Phase | Scope | Status |
|-------|-------|--------|
| **0** | Codebase research + this blueprint | ✅ Complete |
| **1** | Types, Firestore services, public builder/project pages, SEO | 🔄 In progress |
| **2** | Admin CRUD (builders, projects, units), publish controls | 🔄 In progress |
| **3** | Inventory table, filters, lead forms, lead dashboard | 🔄 In progress |
| **4** | Master plan upload, marker editor, public plot finder | 🔄 In progress |
| **5** | Multi-angle master plan support | 🔄 In progress |
| **6** | Plan fields, featured support, analytics counters, sitemap | 🔄 In progress |

---

## Sample Data

Development seed (via `POST /api/builders/seed` or script):

**Builder:** ABC Developers (`abc-developers`)

**Project:** ABC Greens Mohali (`abc-greens-mohali`, city: `mohali`)

**Plots:**

| Plot | Size | Status | Price | Notes |
|------|------|--------|-------|-------|
| 101 | 250 sq yd | Available | ₹1.15 Cr | East Facing |
| 102 | 300 sq yd | Reserved | ₹1.35 Cr | Park Facing |
| 103 | 200 sq yd | Sold | ₹95 Lakh | — |
| 104 | 500 sq yd | Coming Soon | TBD | Corner Plot |

---

## Testing Guide

### Local setup

```powershell
cd C:\RentIt_Dev\apps\RentalPins_Full_web
npm install
# Ensure .env.local has Firebase + Google Maps keys
npm run dev
```

### Seed sample data

1. Sign in as admin user
2. `POST /api/builders/seed` with Bearer token
3. Or visit `/admin/builders` → "Seed Sample Data" button

### Verify public pages

- `/builders/abc-developers`
- `/projects/mohali/abc-greens-mohali`
- `/projects/abc-greens-mohali` (should redirect to canonical)
- `/projects/mohali/abc-greens-mohali/plots`
- `/projects/mohali/abc-greens-mohali/master-plan`

### Create first builder (admin)

1. Go to `/admin/builders/new`
2. Fill name, slug, contact details
3. Save → Publish

### Create first project

1. Go to `/admin/projects/new`
2. Select builder, fill project details, set city slug
3. Save → Publish

### Place plot markers

1. Go to `/admin/master-plan/{projectId}`
2. Upload master plan image
3. Click to add markers, drag to position
4. Link each marker to a plot unit
5. Save → Preview on public master-plan page

---

## Known Limitations & Next Steps

### Current limitations

1. **Flat project URLs** require redirect through city lookup — canonical remains `/projects/{city}/{slug}`
2. **Firestore rules** must be deployed from `rentit_clean` before production writes
3. **Payment integration** for builder plans is schema-only
4. **Image uploads** use URL fields; Firebase Storage upload UI deferred
5. **CSV bulk import** basic parser; no validation UI for large files
6. **Reviews/testimonials** are placeholder sections
7. **Existing static project pages** (Green Valley etc.) remain until migrated to Firestore

### Recommended next improvements

1. Stripe/Razorpay builder subscription checkout
2. Firebase Storage direct upload for logos, galleries, brochures
3. Builder self-service portal (builder_admin login without RentalPins staff)
4. Email/WhatsApp lead notifications via Cloud Functions
5. Analytics dashboard (views, enquiries, CTA clicks)
6. Sitemap registration for all published microsites
7. Merge static `buy-projects-config` and rent `PROJECTS` inline data into Firestore
8. AI-generated project descriptions and SEO copy
9. Virtual site visit scheduling integration
10. Compare projects tool cross-linking

---

## File Inventory (Implementation)

See git diff for complete list. Key additions:

- `docs/builder-project-microsites-blueprint.md` (this file)
- `lib/types/builder-microsite.ts`
- `lib/builders/*`
- `components/builders/*`
- `app/builders/page.tsx`
- `app/(seo)/builders/[builderSlug]/page.tsx` (enhanced)
- `app/projects/[city]/[project-slug]/*` (enhanced + sub-routes)
- `app/admin/builders/*`, `app/admin/projects/*`, etc.
- `app/api/builders/*`, `app/api/builder-projects/*`, etc.
- `firestore.indexes.web-additions.json` (updated)

---

*End of blueprint*
