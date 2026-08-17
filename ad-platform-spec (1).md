# Social Ad Management Platform — Project Specification

## Table of Contents

1. [Vision](#1-vision)
2. [User Roles](#2-user-roles)
3. [UI Structure — Screen by Screen](#3-ui-structure--screen-by-screen)
4. [System Structure — Routing Map](#4-system-structure--routing-map)
5. [System Architecture Overview](#5-system-architecture-overview)
6. [Data Model (MongoDB collections)](#6-data-model-mongodb-collections)
7. [End-to-end Functional Flow](#7-end-to-end-functional-flow)
8. [External API Integration Map](#8-external-api-integration-map)
9. [Background Jobs (BullMQ queues)](#9-background-jobs-bullmq-queues)
10. [Security & Compliance Notes](#10-security--compliance-notes)
11. [MVP Phase Suggestion](#11-mvp-phase-suggestion)

---

## 1. Vision

Most small businesses can't afford a virtual/international card and don't understand how to navigate Meta Ads Manager or TikTok Ads Manager. This platform removes both barriers: users deposit money through payment rails they already trust and understand (Mobile Money, crypto), and the platform runs real, official ad campaigns on their behalf on Facebook, Instagram, and TikTok — no ad account setup, no card, no learning curve.

**Core promise to the user:** "Give us a budget and tell us what you're promoting. We handle the rest."

---

## 2. User Roles

| Role | Description |
|---|---|
| **Business user** | Signs up, deposits funds, creates and monitors campaigns for their own business |
| **Admin (you)** | Manages the platform's own Meta/TikTok Business Manager accounts, oversees all deposits and campaigns, manages pricing plans, handles support |

This is a **Model B (managed/reseller)** platform — users never connect their own ad accounts or payment methods to Meta/TikTok. All campaigns run under the platform's own Business Manager, funded by the platform's own payment method, and billed internally through the wallet system.

---

## 3. UI Structure — Screen by Screen

### 3.1 Public / Marketing pages
- **Landing page** — value proposition, pricing preview, testimonials, "Get started" CTA
- **Pricing page** — plan comparison table (see pricing model)
- **Login / Sign up** — email + password, optionally phone-number based (common in target market)

### 3.2 Onboarding (first login only)
1. **Business profile setup** — business name, industry, what they're promoting (product/service/page link)
2. **Verification (light KYC)** — phone number verification (important given mobile money integration), optional business registration doc upload for higher spend limits
3. **Choose starting plan** — Pay-as-you-go / Growth / Agency

### 3.3 Main app — authenticated area

**Dashboard (home)**
- Wallet balance (prominent, top of page)
- Active campaigns summary (count, total spend today, total reach)
- Quick action: "Create new campaign" button
- Recent activity feed (deposits, campaign status changes)

**Wallet**
- Current balance (large, top)
- "Add funds" button → opens deposit modal:
  - Tab: MTN Mobile Money (phone number input, triggers USSD push)
  - Tab: Crypto (shows QR code + address + countdown timer)
- Transaction history table (deposits, holds, spend deductions, refunds) — filterable by type/date
- Downloadable statement (CSV/PDF) for record-keeping

**Create Campaign (wizard — multi-step)**
1. **What are you promoting?** — link/page selection (Facebook Page, Instagram account, TikTok account, or external website URL)
2. **Objective** — Traffic / Engagement / Conversions / Awareness (mapped internally to Meta/TikTok objective enums)
3. **Audience** — location, age range, gender, interests (simplified UI — internally maps to Meta/TikTok targeting spec)
4. **Platforms** — toggle Facebook / Instagram / TikTok (can run on multiple simultaneously)
5. **Budget & duration** — daily budget × number of days, live total cost calculator showing ad spend + management fee = total
6. **Creative** — upload image/video, write ad copy, choose call-to-action button
7. **Review & launch** — full summary, "Confirm & Launch" button (this triggers the wallet hold + API submission)

**Campaigns (list view)**
- Table: name, platform(s), status (Draft / In Review / Active / Paused / Completed / Rejected), budget, spend so far, days remaining
- Filters: status, platform, date range
- Row actions: Pause / Resume / Edit budget / View details

**Campaign detail page**
- Status banner (with reason if rejected/paused)
- Performance chart: impressions, clicks, spend over time (line chart)
- Key metrics cards: reach, CTR, cost-per-click, cost-per-result
- Creative preview (what the ad looks like on-platform)
- Spend vs. budget progress bar
- "Stop campaign" (with refund-of-unused-budget confirmation)

**Billing / Invoices**
- Per-campaign cost breakdown (ad spend + fee, itemized — see pricing model)
- Monthly subscription invoice (if on paid plan)
- Downloadable receipts

**Settings**
- Profile, business info
- Notification preferences
- Plan management (upgrade/downgrade)
- Support / contact

### 3.4 Admin panel (internal, separate auth)
- All users, all deposits, all campaigns (searchable/filterable)
- Business Manager ad account health (spend capacity, payment method status)
- Manual campaign review queue (for anything flagged by content moderation before hitting Meta/TikTok)
- Pricing plan configuration
- Support ticket queue

---

## 4. System Structure — Routing Map

One unified tree, ordered exactly as a user/admin moves through the system. Four route groups, each with its own auth guard applied once at the group's layout level — never re-checked per page.

```
/
│
├── (PUBLIC)                                   no auth
│   ├── /                                      Landing page
│   ├── /pricing                               Plan comparison
│   ├── /login                                 Sign in
│   └── /signup                                Sign up
│
├── (ONBOARDING)                                auth required, profile incomplete
│   ├── /onboarding/business-profile           Business name, industry, promoting what
│   ├── /onboarding/verify                     Phone verification + doc upload
│   └── /onboarding/plan                       Choose Pay-as-you-go / Growth / Agency
│
├── (APP)                                       auth required, onboarding complete
│   ├── /dashboard                              Home: balance, active campaigns, activity feed
│   │
│   ├── /wallet                                 Balance + transaction history
│   │   └── (modal) add-funds                   Tab: MoMo | Tab: Crypto
│   │
│   ├── /campaigns                              List view (table: status, budget, spend)
│   │   ├── /campaigns/new                      Creation wizard (7 steps, single route)
│   │   │       step=promoting                  1. What are you promoting
│   │   │       step=objective                  2. Traffic/Engagement/Conversions/Awareness
│   │   │       step=audience                   3. Location, age, gender, interests
│   │   │       step=platforms                  4. FB / IG / TikTok toggle
│   │   │       step=budget                     5. Daily budget × days, cost calculator
│   │   │       step=creative                   6. Upload media, copy, CTA
│   │   │       step=review                     7. Confirm & Launch
│   │   └── /campaigns/[id]                     Detail: chart, metrics, creative, stop button
│   │
│   ├── /billing                                Cost breakdowns, invoices, receipts
│   │
│   └── /settings
│       ├── /settings/profile
│       ├── /settings/notifications
│       └── /settings/plan
│
├── (ADMIN)                                      separate auth, separate session
│   ├── /admin/login
│   ├── /admin/users
│   ├── /admin/deposits
│   ├── /admin/campaigns
│   ├── /admin/ad-accounts                      Business Manager health
│   ├── /admin/review-queue                     Manual moderation before Meta/TikTok submit
│   ├── /admin/pricing
│   └── /admin/support
│
└── (API)                                        internal REST, called by all above
    ├── /api/auth/[...nextauth]
    ├── /api/users/me
    │
    ├── /api/wallet/balance
    ├── /api/wallet/transactions
    │
    ├── /api/deposits/momo
    ├── /api/deposits/momo/webhook           ⚠ signature auth, not session
    ├── /api/deposits/crypto
    ├── /api/deposits/crypto/webhook         ⚠ signature auth, not session
    │
    ├── /api/campaigns                        GET list · POST create (hold + submit)
    ├── /api/campaigns/[id]                   GET · PATCH (pause/resume/edit)
    ├── /api/campaigns/[id]/stop
    ├── /api/campaigns/[id]/insights
    │
    ├── /api/billing/invoices
    │
    └── /api/admin/*                          ⚠ admin-role auth only
        ├── /api/admin/users
        ├── /api/admin/deposits
        ├── /api/admin/campaigns
        ├── /api/admin/review-queue
        └── /api/admin/pricing-plans
```

### 4.1 Auth boundary → guard (4 rules)

| Boundary | Condition | Fail → redirect |
|---|---|---|
| PUBLIC | none | already logged in → `/dashboard` |
| ONBOARDING | session ✓, onboarding ✗ | no session → `/login` |
| APP | session ✓, onboarding ✓ | onboarding incomplete → `/onboarding/*` |
| ADMIN | separate admin session | → `/admin/login` |

API layer adds two more, independent of the above:

| Route pattern | Guard |
|---|---|
| `/api/*/webhook` | gateway signature only, no session |
| `/api/admin/*` | admin role only, business session rejected |

### 4.2 Design notes

- **One tree, top to bottom** mirrors the exact order a user hits these screens: public → onboarding → app (admin runs in parallel, not downstream).
- **4 route groups = 4 auth guards**, each defined once at the group layout.
- **Only two dynamic segments in the whole app:** `/campaigns/[id]` and its sub-actions. Everything else is a static path.
- **Wizard is one route, not seven** — `/campaigns/new?step=...` — so state persists naturally instead of being threaded across 7 separate pages.
- **Wallet "Add funds" is a modal, not a route** — it opens on top of `/wallet`, it doesn't navigate away.

---

## 5. System Architecture Overview

```
┌─────────────┐      ┌──────────────────┐      ┌───────────────────┐
│  Frontend   │─────▶│   Backend API     │─────▶│    MongoDB         │
│  (Next.js)  │◀─────│   (Next.js API /  │◀─────│   (via Mongoose)   │
└─────────────┘      │    Node service)  │      └───────────────────┘
                      └────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                 ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
    │ Payment rails │  │ Background   │  │ Ad platform APIs  │
    │ (MoMo, crypto │  │ jobs (Redis/ │  │ (Meta Marketing,  │
    │  processor)   │  │  BullMQ)     │  │  TikTok Ads)      │
    └──────────────┘  └──────────────┘  └──────────────────┘
```

**Stack**
- Frontend + backend: Next.js (TypeScript), single deployable app
- Database: MongoDB + Mongoose (ODM)
- Auth: NextAuth.js
- Background jobs / queues: BullMQ + Redis (spend polling, ad status polling, wallet reconciliation)
- File storage: S3-compatible bucket for ad creatives

---

## 6. Data Model (MongoDB collections)

```
users
  _id, email, phone, businessName, planId, kycStatus, createdAt

wallets
  _id, userId, currency (USD, internal), createdAt
  -- balance is DERIVED by aggregating ledgerEntries, never stored as a mutable field

ledgerEntries
  _id, walletId, type (deposit|hold|settlement|holdRelease|refund),
  amount, currency, gateway (momo|crypto), gatewayRef, campaignId, status, createdAt

deposits
  _id, userId, method (momo|crypto), amount, currency,
  originalCurrency, originalAmount, fxRateUsed,
  gatewayRef, status, createdAt, confirmedAt

campaigns
  _id, userId, name, objective, platforms: [], status,
  dailyBudget, days, totalAdSpend, managementFee,
  totalCharge, startDate, endDate,
  metaCampaignId, tiktokCampaignId, createdAt,
  adSets: [ { platform, targeting: {}, externalId } ],   -- embedded (adset_id / ad_group_id)
  creative: { mediaUrl, copyText, ctaType, externalId }   -- embedded

spendSnapshots
  _id, campaignId, platform, spendAtPoll, polledAt
  -- audit trail of every Insights API poll

pricingPlans
  _id, name, monthlyFee, feePercent, spendThreshold
```

**Modeling note:** `adSets` and `creative` are embedded directly inside the `campaigns` document rather than separate collections, since they're always read/written together with their parent campaign and rarely queried independently — a good fit for MongoDB's document model. `ledgerEntries`, `deposits`, and `spendSnapshots` stay as separate collections since they grow independently and are queried on their own (e.g. transaction history, audit trails).

---

## 7. End-to-end Functional Flow

1. **Sign up** → business profile → phone verification → plan selection
2. **Deposit funds**
   - MoMo: enter phone → Request to Pay → USSD approval → webhook confirms → XAF converted to USD via EUR peg → ledger credited
   - Crypto: invoice generated → user pays → processor webhook confirms → ledger credited (USD)
3. **Create campaign** via wizard → system calculates `total_ad_spend + management_fee = total_charge`
4. **Launch**
   - Check `wallet.available_balance >= total_charge` → reject if insufficient
   - Place **hold** on `total_charge` in ledger
   - Submit to Meta Marketing API and/or TikTok Ads API: create Campaign → Ad Set → Ad Creative → Ad (all created `PAUSED`)
   - Poll ad review status every 1–2 min
5. **Approved** → flip status to `ACTIVE` via API → campaign goes live
6. **While running** — background worker (every 5–15 min):
   - Poll Insights API for `spend`
   - Convert delta spend into a **settlement** ledger entry (spend + proportional fee)
   - If balance/hold nearly exhausted → auto-pause campaign via API
7. **Campaign ends** (end date reached, budget exhausted, or manually stopped)
   - Final spend reconciliation against Insights API
   - Release any unused portion of the hold back to wallet balance
8. **Reporting** — dashboard reads stored `spend_snapshots` + live Insights API calls for the detail view

---

## 8. External API Integration Map

| API | Used for | Where in the flow |
|---|---|---|
| **MTN MoMo (via aggregator, e.g. Fapshi/Campay) API** | Mobile Money deposits | Wallet → Add funds → MoMo tab |
| **Crypto processor API (NOWPayments/CoinGate)** | Crypto deposits | Wallet → Add funds → Crypto tab |
| **FX rate API (exchangerate.host or similar)** | XAF → EUR → USD conversion | Triggered inside MoMo webhook handler |
| **Meta Marketing API** | Campaign/Ad Set/Creative/Ad creation, status polling, Insights (spend/performance) | Campaign wizard launch step; background worker polling |
| **TikTok Ads API** | Same as above, TikTok equivalent | Same trigger points, TikTok-specific endpoints |
| **Internal REST API** (your own backend) | Everything the frontend calls: `/api/campaigns`, `/api/wallet`, `/api/deposits`, `/api/auth/*` | Every frontend screen |

---

## 9. Background Jobs (BullMQ queues)

| Job | Frequency | Purpose |
|---|---|---|
| `poll-ad-review-status` | Every 1–2 min, per pending campaign | Detect approval/rejection, flip status |
| `poll-campaign-spend` | Every 5–15 min, per active campaign | Fetch Insights spend, write settlement ledger entries, trigger auto-pause |
| `refresh-fx-rate` | Hourly | Cache EUR/USD rate for MoMo conversion |
| `reconcile-completed-campaigns` | On end-date reached | Final spend check, release unused hold |
| `deposit-timeout-check` | Every few minutes | Mark stale pending MoMo/crypto deposits as expired |

---

## 10. Security & Compliance Notes

- All payment webhooks must be signature-verified and processed idempotently (never trust a webhook body alone).
- Wallet balance is always **derived from the ledger**, never a mutable column — full auditability.
- Ad review content should optionally pass through a lightweight internal moderation check before submission, to reduce rejection rate and platform policy risk.
- Crypto deposits carry additional regulatory considerations in the CEMAC/Cameroon context (see prior discussion) — recommend local legal consultation before scaling this rail.
- KYC/phone verification reduces fraud risk on the deposit side, especially important given irreversible payment rails (MoMo, crypto).

---

## 11. MVP Phase Suggestion

**Phase 1** — Auth, wallet (MTN MoMo deposits only), campaign wizard, Meta API integration only, manual admin review
**Phase 2** — Add crypto deposits, add TikTok Ads API, background job automation (polling, auto-pause)
**Phase 3** — Admin panel, multi-plan pricing, reporting/analytics polish
