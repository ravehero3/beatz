# Beatz — Master Scaffold Prompt
### Paste this into your AI coding agent (Replit, Cursor, etc.) to generate the full platform

---

## PROJECT OVERVIEW

Build a full-stack web application called **Beatz** — a SaaS platform that lets music producers create their own beat store. Think Shoptet, but for beats.

**Business model:**
- Producers pay Beatz a monthly or yearly subscription to use the platform
- Producers set up their own mini-store with beats
- Buyers purchase beats directly from producers
- Money flows directly between buyer and producer — Beatz never touches buyer payments
- Beatz earns only from producer subscriptions (via GoPay or Lemon Squeezy)

---

## TECH STACK

- **Framework:** React + Vite
- **Styling:** Tailwind CSS (utility-first, no component library)
- **Routing:** React Router v6
- **State:** Zustand (global audio player, cart, auth)
- **Auth + DB:** Supabase (auth, PostgreSQL, real-time)
- **File storage:** Cloudflare R2 (audio files, images)
- **i18n:** react-i18next (Czech + English, auto-detect browser language)
- **PDF generation:** pdf-lib or react-pdf (invoices, licenses, payout statements)
- **QR payment:** qrcode npm package + SPD format (Czech QR platba standard)
- **Audio player/waveform:** wavesurfer.js with React wrapper
- **Animations:** Framer Motion

---

## DESIGN SYSTEM — FOLLOW EXACTLY

### Typography
- **Font:** Figtree (Google Fonts) — use for everything, no exceptions
- Import in index.html: `<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`
- Body text: Figtree 400, 14–16px, color #111111
- Headings: Figtree 700, letter-spacing -0.03em
- Small/muted text: Figtree 400, color #888888 or #AAAAAA
- Labels/caps: Figtree 500, font-size 11px, letter-spacing 0.06em, uppercase

### Colors
```
--color-black:       #0A0A0A
--color-white:       #FFFFFF
--color-gray-50:     #F9F9F9
--color-gray-100:    #F2F2F2
--color-gray-200:    #E5E5E5
--color-gray-300:    #D4D4D4
--color-gray-500:    #888888
--color-gray-700:    #444444
--color-gray-900:    #111111
--color-accent:      #0A0A0A   (primary CTA = black)
--color-error:       #EF4444
--color-success:     #22C55E
--color-warning:     #F59E0B
```

Everything is white background, black text. No color splashes except status colors (error, success, warning).

### Spacing — 8px grid
Use multiples of 8 for all spacing: 8, 16, 24, 32, 40, 48, 64, 80, 96, 128px.

### Border radius
- Buttons: `border-radius: 9999px` (full pill — always)
- Cards: `border-radius: 16px`
- Inputs: `border-radius: 10px`
- Modals: `border-radius: 20px`
- Small chips/tags: `border-radius: 9999px`

### Borders
- Cards and containers: `border: 1px solid #E5E5E5`
- Inputs default: `border: 1px solid #E5E5E5`
- Inputs focused: `border: 1px solid #0A0A0A`
- Dividers: `border-top: 1px solid #F2F2F2`

### Shadows
- Card default: `box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`
- Card hover: `box-shadow: 0 8px 24px rgba(0,0,0,0.10)`
- Modal: `box-shadow: 0 24px 64px rgba(0,0,0,0.14)`
- Button hover: `box-shadow: 0 4px 12px rgba(0,0,0,0.15)`

### Buttons
- **Primary:** background #0A0A0A, color #FFFFFF, border-radius 9999px, height 44px, px-6, Figtree 500, font-size 14px. Hover: opacity 0.88, translateY(-1px), shadow.
- **Secondary:** background #FFFFFF, color #0A0A0A, border 1px solid #E5E5E5, border-radius 9999px, same sizing. Hover: background #F9F9F9.
- **Ghost:** no background, no border, color #888888. Hover: color #0A0A0A.
- **Danger:** background #EF4444, color #FFFFFF, border-radius 9999px.
- All buttons: `transition: all 0.15s ease`, cursor pointer, font-family Figtree.

### Header — fixed, 44px height
```
height: 44px
background: rgba(255,255,255,0.92)
backdrop-filter: blur(12px)
border-bottom: 1px solid #F2F2F2
position: fixed
top: 0
left: 0
right: 0
z-index: 1000
display: flex
align-items: center
padding: 0 24px
```
- Logo "beatz" in top-left: Figtree 700, font-size 18px, color #0A0A0A, letter-spacing -0.04em
- Body content must have `padding-top: 44px` to clear the fixed header

### Image placeholders
Any image upload placeholder (profile picture, cover image, landing page banner) must:
```css
background: #F2F2F2;
border-radius: [context-appropriate];
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
transition: background 0.15s ease;
```
On hover: `background: #E5E5E5` (slightly darker)
Show a small upload icon (SVG, color #AAAAAA) and text "Upload image" / "Nahrát obrázek" centered inside.
No actual images — placeholder only.

### Cards
```css
background: #FFFFFF;
border: 1px solid #E5E5E5;
border-radius: 16px;
padding: 24px;
transition: box-shadow 0.2s ease, transform 0.2s ease;
```
Hover: `box-shadow: 0 8px 24px rgba(0,0,0,0.10); transform: translateY(-2px)`

### Grid system
Use CSS Grid with these standard column setups:
- Desktop (1280px+): 12 columns, gap 24px, max-width 1280px, centered with auto margins
- Tablet (768–1279px): 8 columns, gap 20px
- Mobile (<768px): 4 columns, gap 16px

Content sections: max-width 1280px, margin 0 auto, padding 0 24px.

---

## FOLDER STRUCTURE

```
src/
  components/
    layout/
      Header.jsx          — 44px fixed header, logo, nav, user menu
      Footer.jsx          — minimal footer
      Sidebar.jsx         — sidebar for /studio and /admin
    ui/
      Button.jsx          — primary/secondary/ghost/danger variants
      Card.jsx            — base card component
      Input.jsx           — text input with label, error state
      Modal.jsx           — centered modal with backdrop
      Badge.jsx           — small pill badge
      Placeholder.jsx     — image upload placeholder
      AudioPlayer.jsx     — wavesurfer.js player, 30-sec preview lock
      BeatCard.jsx        — beat card for grids (cover, title, BPM, price, play button)
      QRPayment.jsx       — QR platba code display + payment status polling
      LicenseSelector.jsx — license tier picker (Basic/Premium/Exclusive)
      PricingCard.jsx     — subscription plan card
    forms/
      BeatUploadForm.jsx  — full beat upload form for artists
      ProfileForm.jsx     — artist profile edit form
      StoreSettingsForm.jsx
  pages/
    public/
      HomePage.jsx        — browse all beats, featured artists
      BrowseBeatsPage.jsx — /beats — full catalog with filters
      BeatDetailPage.jsx  — /beats/:id — single beat, player, license picker, buy button
      ArtistsPage.jsx     — /artists — browse all artists
      ArtistStorePage.jsx — /artists/:slug — producer's public store
      LoginPage.jsx       — /login
      RegisterPage.jsx    — /register
      PricingPage.jsx     — /pricing — subscription plans
    buyer/
      AccountPage.jsx     — /account — overview
      PurchasesPage.jsx   — /account/purchases — download purchased beats
      LicensesPage.jsx    — /account/licenses — view/download PDF licenses
      SavedPage.jsx       — /account/saved — wishlist
      SettingsPage.jsx    — /account/settings
      CheckoutPage.jsx    — /checkout
      CheckoutSuccessPage.jsx — /checkout/success
    studio/
      StudioDashboard.jsx   — /studio — sales overview, earnings chart
      MyBeatsPage.jsx       — /studio/beats — manage uploaded beats
      UploadBeatPage.jsx    — /studio/beats/upload
      EditBeatPage.jsx      — /studio/beats/:id/edit
      EarningsPage.jsx      — /studio/earnings — balance, withdrawal history
      OrdersPage.jsx        — /studio/orders — orders received
      ProfilePage.jsx       — /studio/profile — edit public profile
      StoreSettingsPage.jsx — /studio/store — store name, design template, colors
      StudioSettingsPage.jsx — /studio/settings — payment setup, notifications
    admin/
      AdminDashboard.jsx    — /admin — platform-wide stats
      AdminUsersPage.jsx    — /admin/users — all users
      AdminArtistsPage.jsx  — /admin/artists — all artists
      AdminBeatsPage.jsx    — /admin/beats — all beats, flag/remove
      AdminTransactionsPage.jsx — /admin/transactions
      AdminPayoutsPage.jsx  — /admin/payouts — withdrawal requests
      AdminReportsPage.jsx  — /admin/reports — DMCA, flagged content
      AdminSettingsPage.jsx — /admin/settings — platform config
    upgrade/
      UpgradePage.jsx       — /upgrade — pricing + upgrade flow (see spec below)
  store/
    audioStore.js     — Zustand: current playing beat, progress, isPlaying
    cartStore.js      — Zustand: cart items, selected licenses
    authStore.js      — Zustand: user, role, session
  lib/
    supabase.js       — Supabase client
    r2.js             — Cloudflare R2 upload helpers
    qrpayment.js      — SPD QR platba generator
    pdf.js            — PDF generation (invoices, licenses, payout statements)
    audio.js          — ffmpeg-wasm preview clip generation (30 sec)
  i18n/
    index.js          — i18next config, auto-detect browser language
    cs.json           — Czech strings
    en.json           — English strings
  hooks/
    useAuth.js
    useRole.js        — returns { isAdmin, isArtist, isBuyer }
    useBeats.js
    useAudio.js
```

---

## DATABASE SCHEMA (Supabase PostgreSQL)

```sql
-- Users (extends Supabase auth.users)
profiles (
  id uuid PRIMARY KEY references auth.users,
  email text,
  first_name text,
  last_name text,
  role text DEFAULT 'buyer', -- 'buyer' | 'artist' | 'admin'
  avatar_url text,           -- placeholder until uploaded
  created_at timestamptz DEFAULT now()
)

-- Artist profiles
artists (
  id uuid PRIMARY KEY references profiles,
  slug text UNIQUE,          -- URL: /artists/:slug
  display_name text,
  bio text,
  banner_url text,           -- landing page image placeholder
  profile_picture_url text,
  store_template text DEFAULT 'light', -- 'light' | 'dark'
  store_primary_color text DEFAULT '#0A0A0A',
  social_instagram text,
  social_soundcloud text,
  social_youtube text,
  bank_iban text,            -- for QR platba payouts
  bank_account_name text,
  gopay_account text,        -- optional
  fio_api_token text,        -- optional, for auto-confirmation
  subscription_tier text DEFAULT 'free', -- 'free' | 'pro'
  subscription_status text,  -- 'active' | 'expired' | 'cancelled'
  subscription_ends_at timestamptz,
  balance_czk numeric DEFAULT 0,  -- pending withdrawal balance
  total_earned_czk numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
)

-- Beats
beats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid references artists,
  title text NOT NULL,
  slug text,
  description text,
  bpm integer,
  key text,                  -- e.g. 'C minor'
  genre text,
  mood text,
  tags text[],
  cover_url text,            -- placeholder until uploaded
  audio_preview_url text,    -- 30-second MP3 preview (auto-generated)
  audio_full_url text,       -- full MP3 (delivered after purchase)
  audio_wav_url text,        -- full WAV (delivered with premium/exclusive)
  price_basic numeric,       -- Basic license price in CZK
  price_premium numeric,
  price_exclusive numeric,
  is_exclusive_sold boolean DEFAULT false,
  plays integer DEFAULT 0,
  status text DEFAULT 'active', -- 'active' | 'flagged' | 'removed'
  created_at timestamptz DEFAULT now()
)

-- License types reference
-- Basic: MP3, non-exclusive, commercial use, limited streams
-- Premium: WAV + stems, non-exclusive, unlimited commercial use
-- Exclusive: WAV + stems, exclusive, beat removed from sale after purchase

-- Orders
orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid references profiles,
  artist_id uuid references artists,
  beat_id uuid references beats,
  license_type text,         -- 'basic' | 'premium' | 'exclusive'
  amount_czk numeric,
  payment_method text,       -- 'qr_bank' | 'gopay' | 'lemon_squeezy'
  payment_status text DEFAULT 'pending', -- 'pending' | 'paid' | 'failed'
  variable_symbol text,      -- unique VS for QR platba matching
  qr_code_data text,         -- SPD string for QR generation
  license_pdf_url text,      -- auto-generated PDF
  confirmed_at timestamptz,
  created_at timestamptz DEFAULT now()
)

-- Withdrawal requests
withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid references artists,
  amount_czk numeric,
  status text DEFAULT 'pending', -- 'pending' | 'processing' | 'paid'
  qr_code_data text,         -- SPD QR for admin to scan and pay
  requested_at timestamptz DEFAULT now(),
  paid_at timestamptz
)

-- Saved beats (wishlist)
saved_beats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid references profiles,
  beat_id uuid references beats,
  created_at timestamptz DEFAULT now()
)

-- Platform subscriptions (artist paying Beatz)
subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id uuid references artists,
  plan text,                 -- 'pro_monthly' | 'pro_yearly'
  status text,               -- 'active' | 'cancelled' | 'expired'
  amount_czk numeric,
  payment_provider text,     -- 'gopay' | 'lemon_squeezy'
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz DEFAULT now()
)
```

---

## ROLE SYSTEM & ROUTE PROTECTION

```jsx
// Three roles: 'buyer' | 'artist' | 'admin'
// Role is stored in profiles.role in Supabase

// Route guards:
// /account/*        → requires: logged in (any role)
// /studio/*         → requires: role === 'artist' OR role === 'admin'
// /admin/*          → requires: role === 'admin'

// ProtectedRoute.jsx — wrap routes with this:
// <ProtectedRoute requiredRole="artist"> ... </ProtectedRoute>
// If not logged in → redirect to /login
// If wrong role → redirect to /account with a toast: "Upgrade to artist to access your studio"
```

---

## PAYMENT SYSTEM — QR PLATBA (PRIMARY)

QR platba is the main payment method. GoPay and Lemon Squeezy are optional extras artists can enable.

### How it works:
1. Buyer selects a beat + license tier → clicks "Buy"
2. System generates a unique variable symbol (VS): `timestamp + random 4 digits`
3. System generates SPD QR string:
```
SPD*1.0*ACC:CZ[artist IBAN]*AM:[amount]*CC:CZK*MSG:BEATZ [beat title]*X-VS:[variable symbol]
```
4. QR code is rendered using the `qrcode` npm package
5. Buyer sees QR code page with: amount, VS, artist bank details, and a status indicator
6. Status: "Waiting for payment..." → polls every 15 seconds

### Payment confirmation options (artist configures in settings):

**Option A — Manual (default):**
- Artist receives bank notification from their bank
- Artist logs into /studio/orders and clicks "Confirm payment" next to the order
- System marks order as paid, generates license PDF, emails download link to buyer

**Option B — Fio Bank API (automatic):**
- Artist enters their Fio API token in /studio/settings
- System polls Fio API every 30 seconds for new transactions
- Matches incoming payment by variable symbol
- Auto-confirms, generates license PDF, sends download link
- Status page updates automatically: "✓ Payment confirmed — check your email"

**Option C — GoPay (optional add-on):**
- Artist connects their own GoPay account (sub-merchant)
- Buyer can choose to pay by card instead of QR
- GoPay webhooks confirm payment automatically

### QRPayment.jsx component:
```
Display:
- Large QR code (256x256px minimum)
- Amount: "490 Kč"
- Variable symbol: "#20240601-3847"
- Artist name + IBAN (last 4 digits shown)
- Status badge: "Waiting..." (yellow) / "Confirmed ✓" (green) / "Failed" (red)
- Countdown timer showing time elapsed
- "I paid manually" button → opens confirmation modal for buyer to note payment
- Help text explaining what QR platba is and how to scan it
```

---

## AUDIO SYSTEM

### Upload flow:
1. Artist uploads MP3 (full quality) via BeatUploadForm
2. Backend (Supabase Edge Function) runs ffmpeg to cut a 30-second preview clip starting at 0:30 (skips intro)
3. Both full file and preview stored in Cloudflare R2
4. Only preview URL is public; full file URL is signed and only generated after purchase

### AudioPlayer.jsx:
- Uses wavesurfer.js to render waveform
- Shows 30-second preview clip for non-buyers
- At 29 seconds: fades out audio, shows "Buy to listen to full track"
- For buyers (after purchase): plays full track
- Global audio state via Zustand: only one beat plays at a time
- Mini player appears fixed at bottom when a beat is playing (above any footer)
- Mini player: cover art, title, artist name, play/pause, progress bar

---

## KEY PAGES — DETAILED SPECS

### Header (44px, fixed)
```
Left:   "beatz" wordmark (Figtree 700, 18px, black, letter-spacing -0.04em)
Center: nav links — "Browse" | "Artists" | "Pricing" (Figtree 500, 14px, color #444)
Right:  Language toggle (CS | EN) + Login button OR avatar dropdown if logged in

Avatar dropdown menu:
  My Account → /account
  My Studio  → /studio    (only if role === 'artist')
  Admin Panel → /admin   (only if role === 'admin')
  ─────────────────
  Log out
```

### HomePage (/):
- Hero section: large heading "Your beats. Your store." sub "The Czech beat marketplace for independent producers." + two CTA buttons: "Browse Beats" (primary) and "Start Selling" (secondary)
- No hero image — clean typographic hero on white background
- Featured beats grid: 3 columns, BeatCard components
- Featured artists row: horizontal scroll, artist avatar + name + beat count
- How it works: 3 steps (Upload beats → Set prices → Get paid directly)
- CTA section: "Start your beat store today" → /pricing

### ArtistStorePage (/artists/:slug):
This is each producer's public-facing mini-store. Style is controlled by the artist's chosen template.

```
Layout:
- Full-width banner placeholder (300px height) — artist's landing page image
- Artist avatar (96px circle) overlapping banner bottom edge, offset left
- Artist name (Figtree 700, 28px) + bio + social links
- Tab bar: "All Beats" | "Popular" | "New"
- Beat grid: 3 columns desktop, 2 tablet, 1 mobile
- Each BeatCard: cover image placeholder, title, BPM, key, genre tag, price (cheapest license shown), play button
```

### BeatDetailPage (/beats/:id):
```
Left column (60%):
- Cover image placeholder (square, 400px)
- Waveform player (wavesurfer.js, 30-sec preview)
- Beat info: title, BPM, key, genre, mood, tags

Right column (40%):
- Artist info card (avatar, name, "View store" link)
- LicenseSelector component:
    [ Basic  490 Kč  — MP3, non-exclusive, up to 500k streams    ]
    [ Premium 1490 Kč — WAV + stems, unlimited commercial use     ]
    [ Exclusive 4900 Kč — Full rights, beat removed from sale     ]
- "Buy Now" button (primary, full width)
- On click: if not logged in → redirect to /register → return here
- If logged in: go to /checkout with beat + license in cart
```

### CheckoutPage (/checkout):
```
Order summary card:
- Beat cover + title + license type + price

Payment method (artist's configured options):
  ● QR platba — bank transfer (default, always shown)
  ○ GoPay — pay by card (shown only if artist has GoPay configured)
  ○ Lemon Squeezy (shown only for international buyers or if artist configured)

"Complete order" button → generates order in DB, renders QRPayment component
```

### PricingPage (/pricing) — also used as UpgradePage (/upgrade):
Based on your uploaded UpgradePage.jsx structure but with white/black color scheme.

```
Header: "Choose your plan" (Figtree 700, clamp(2.5rem, 6vw, 4rem), black)
Subtext: "No contracts. Cancel anytime." (color #888888)

Monthly/Yearly toggle (pill toggle, saves ~17% on yearly)

Three plan cards (white bg, border #E5E5E5, border-radius 16px):

Card 1 — Free / Zdarma
  Price: 0 Kč / free forever
  Features:
    ✓ Up to 5 beats
    ✓ Basic profile page
    ✓ QR platba payments
    ✗ Custom store design
    ✗ Analytics
    ✗ Priority support
  CTA: "Start for free" (secondary button)

Card 2 — Pro (HIGHLIGHTED — black border 2px, slight scale 1.02)
  Monthly: 299 Kč/month | Yearly: 2 490 Kč/year (save 2 months)
  Badge: "Most popular" (black pill, white text, above card)
  Features:
    ✓ Unlimited beats
    ✓ Custom store design (3 templates)
    ✓ Full analytics dashboard
    ✓ QR platba + GoPay + Lemon Squeezy
    ✓ Auto-generated invoices + licenses
    ✓ Priority support
    ✓ Custom store URL slug
  CTA: "Start Pro" (primary black button)

Card 3 — Pro+ / Label
  Monthly: 799 Kč/month | Yearly: 6 990 Kč/year
  Features:
    ✓ Everything in Pro
    ✓ Multiple artist profiles (up to 5)
    ✓ White-label store (no "Beatz" branding)
    ✓ Fio API auto-confirmation
    ✓ Custom domain support
    ✓ Dedicated support
  CTA: "Go Pro+" (secondary button)

Beneath cards:
  "All plans include: GDPR-compliant, hosted in EU, cancel anytime, 
   automatic license PDF generation, buyer email notifications"

Payment on upgrade:
  → UserDetailsModal (same pattern as your uploaded file, but white/black colors)
  → Redirect to GoPay or Lemon Squeezy checkout
  → On return: subscription activated, role updated to 'artist'
```

### Studio Dashboard (/studio):
```
Sidebar (240px, fixed left, white bg, border-right #E5E5E5):
  Logo at top (same 44px header height)
  Navigation items (Figtree 500, 14px):
    📊 Dashboard
    🎵 My Beats
    📦 Orders
    💰 Earnings
    🎨 Store Design
    👤 Profile
    ⚙️  Settings
  Bottom: User avatar + name + "Back to site" link

Main content area (left margin 240px):
  Stats row (4 cards):
    Total earnings this month | Orders this month | Total plays | Active beats
  
  Recent orders table:
    Beat title | Buyer | License | Amount | Payment status | Date | Actions
  
  Earnings chart:
    Line chart showing daily earnings last 30 days (use recharts)
  
  Quick actions:
    "Upload new beat" button | "View my store" link
```

### Earnings Page (/studio/earnings):
```
Balance card:
  "Available balance: 3 420 Kč"
  "Request withdrawal" button →
    Opens modal: shows QR platba code for artist to display to admin
    Amount pre-filled, VS generated
    OR: shows bank details form if they want to enter IBAN for payout

Withdrawal history table:
  Date | Amount | Status (pending/processing/paid) | QR code (view)

All-time stats:
  Total earned | Total withdrawn | Platform fees paid (subscription cost)
```

### Admin Dashboard (/admin):
```
Admin sidebar (same pattern as studio sidebar, different nav items):
  📊 Dashboard
  👥 Users
  🎵 Artists
  🎶 Beats
  💳 Transactions
  💰 Payouts
  🚩 Reports
  ⚙️  Settings

Dashboard content:
  Stats row (6 cards):
    Total users | Total artists | Total beats | Revenue this month (subscriptions) | 
    Pending payouts | Open reports

  Platform activity feed (latest 20 events: new user, new beat, new order, new report)
  
  Quick links:
    Pending withdrawal requests (count badge) → /admin/payouts
    Open reports (count badge) → /admin/reports
```

### Admin Payouts (/admin/payouts):
```
Table: Artist name | Amount | Requested | Status | Actions
Actions:
  "View QR" → shows QR code for this payout (admin scans with banking app)
  "Mark as paid" → updates status, notifies artist
  "Reject" → with reason field

Each row expandable to show artist IBAN, bank name
```

### Admin Beats (/admin/beats):
```
Table with search + filters:
  Beat title | Artist | Status | Plays | Reported? | Created | Actions
Actions: "View" | "Flag" | "Remove" | "Restore"
Filter by: status (active/flagged/removed), reported, artist
```

---

## STORE TEMPLATES

Artists choose from 3 visual templates for their public store (/artists/:slug):

**Template 1 — Light (default):**
White background, black text, minimal. Same design system as main Beatz site.

**Template 2 — Dark:**
Background #0A0A0A, white text, same card structure but inverted.
Beat cards: background #1A1A1A, border #2A2A2A.

**Template 3 — Warm:**
Background #FAF8F5, dark text, warm gray card borders (#E8E4DE).
Slightly more rounded cards (border-radius: 20px).

Template is selected in /studio/store and previewed live before saving.

---

## PDF AUTO-GENERATION

Generate 3 PDF types automatically using pdf-lib:

**1. License agreement (on purchase):**
```
BEATZ LICENSE AGREEMENT
Beat title: [title]
License type: [Basic / Premium / Exclusive]  
Buyer: [buyer full name]
Artist: [artist display name]
Date: [purchase date]
Order ID: [order uuid]
---
[License terms for selected tier — full legal text]
---
Signatures section (buyer agrees digitally on purchase)
```

**2. Invoice (on purchase, for buyer):**
```
INVOICE / FAKTURA
From: [Artist display name] (seller)
To: [Buyer name]
Item: Beat license — [beat title] — [license type]
Amount: [price] Kč
VAT: Artist's responsibility per their tax status
Date: [date]
VS: [variable symbol]
```

**3. Payout statement (when admin marks withdrawal as paid):**
```
PAYOUT STATEMENT — BEATZ
Artist: [name]
Period: [dates]
Total sales: [amount]
Platform fee (subscription): [amount]
Amount paid out: [amount]
Date of transfer: [date]
```

---

## i18n — CZECH + ENGLISH

All UI strings must use `t('key')` from react-i18next.
Auto-detect browser language on first visit (navigator.language).
Persist language choice in localStorage.
Language toggle in header: "CS | EN" — small, top-right area.

Key namespaces:
- `common` — buttons, labels, status words
- `nav` — navigation items
- `beats` — beat-related strings
- `checkout` — payment flow
- `studio` — artist dashboard strings
- `admin` — admin panel strings
- `pricing` — plan names, features, CTAs
- `licenses` — license type descriptions and legal text

---

## LEGAL / TERMS

On artist registration (when they go from buyer → artist via /pricing):
Show a modal before proceeding to payment with this agreement text (translate both languages):

```
By activating your Beatz artist account, you agree that:
1. You are the seller of your beats — Beatz provides the platform only
2. You are solely responsible for all taxes on your earnings (income tax, VAT if applicable)
3. You will issue invoices to buyers according to Czech law if required
4. Payment disputes are between you and your buyers — Beatz is not a party
5. You have full rights to sell any beat you upload
6. You will comply with Czech copyright law (autorský zákon)

[ ✓ I agree to the Beatz Artist Terms ] — required checkbox
[ Continue to payment ]
```

This is stored as `terms_accepted_at` timestamp in the artists table.

---

## NOTIFICATIONS & EMAILS

Use Supabase Edge Functions + Resend (or similar) for transactional emails:

- **New order** → email to artist: "You sold a beat! [title] — [license] — [amount] Kč"
- **Payment confirmed** → email to buyer: "Your beat is ready — download link + license PDF attached"
- **Withdrawal paid** → email to artist: "Your withdrawal of [amount] Kč has been processed"
- **New report** → email to admin
- **Subscription expiring** → email to artist 7 days before expiry

---

## ENVIRONMENT VARIABLES

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_R2_BUCKET_URL=
VITE_GOPAY_CLIENT_ID=
VITE_LEMON_SQUEEZY_STORE_ID=
SUPABASE_SERVICE_KEY=        (server-side only, Edge Functions)
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
RESEND_API_KEY=
FIO_API_BASE=https://www.fio.cz/ib_api/rest
```

---

## IMPLEMENTATION ORDER

Build in this order — each phase is independently usable:

**Phase 1 — Foundation**
1. Vite + React + Tailwind + React Router setup
2. Supabase client + auth (login, register, session)
3. Header component (44px, fixed, logo, nav, user menu)
4. i18n setup (CS/EN, auto-detect)
5. Design system components: Button, Card, Input, Modal, Badge, Placeholder

**Phase 2 — Public site**
6. HomePage
7. BrowseBeatsPage (static, no real data yet)
8. BeatCard component
9. ArtistStorePage (static template)
10. PricingPage / UpgradePage

**Phase 3 — Audio + beats**
11. AudioPlayer + wavesurfer.js integration
12. 30-second preview clip logic
13. BeatDetailPage
14. LicenseSelector component

**Phase 4 — Checkout + payments**
15. QRPayment component (SPD generator + qrcode display)
16. CheckoutPage
17. Order creation in Supabase
18. CheckoutSuccessPage

**Phase 5 — Artist studio**
19. Studio sidebar + layout
20. StudioDashboard (stats, charts)
21. BeatUploadForm + R2 upload
22. MyBeatsPage (list, edit, delete)
23. EarningsPage + withdrawal request + QR generation
24. StoreSettingsPage (template picker)

**Phase 6 — Buyer account**
25. AccountPage + PurchasesPage + LicensesPage
26. SavedPage (wishlist)

**Phase 7 — Admin panel**
27. Admin sidebar + layout
28. AdminDashboard
29. AdminUsersPage, AdminArtistsPage, AdminBeatsPage
30. AdminPayoutsPage (QR payout display, mark as paid)
31. AdminReportsPage

**Phase 8 — Documents + emails**
32. PDF generation (licenses, invoices, payout statements)
33. Transactional email setup
34. Fio API polling (optional auto-confirmation)

---

## NOTES FOR THE AI CODING AGENT

- Use Tailwind utility classes — no CSS files except for global resets in index.css
- All components must be responsive (mobile-first)
- Use Framer Motion for page transitions and card hover animations
- Wrap all Supabase calls in try/catch with proper error states
- Every form must have loading state on submit button
- All monetary amounts displayed as "1 490 Kč" (Czech format, space as thousands separator)
- Dates displayed as "1. 6. 2024" (Czech format) in CS mode, "Jun 1, 2024" in EN mode
- Use React.lazy + Suspense for page-level code splitting
- All image placeholders must show a darker shade on hover (see design system above)
- Buttons always have border-radius 9999px — no exceptions
- The word "beatz" (logo) is always lowercase
