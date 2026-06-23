# Shiraz Afghan Restaurant — Homepage & Booking System

## Live Links

| | URL |
|---|---|
| Frontend | *(deployment not yet configured)* |
| Backend API | *(deployment not yet configured)* |
| GitHub Repository | *(add repository URL here)* |

---

## Project Overview

This project was built as part of a full-stack technical assessment. The goal was to create a polished, client-ready homepage for Shiraz Afghan Restaurant alongside a custom table booking system — without relying on third-party booking widgets.

The homepage draws visual inspiration from a premium reference restaurant website to understand the kind of atmosphere, typography, and movement that works well for fine-dining brands. Everything implemented here is original and built specifically around the Shiraz identity, using the provided brand and food assets rather than placeholder images.

The booking system handles real restaurant concerns: capacity matching, opening hours, slot availability, cancellation, booking modification, and preventing double bookings under simultaneous requests. The emphasis throughout was on frontend polish, backend correctness, responsive design, and clear engineering decisions.

---

## Main Features

### Frontend

- **Homepage** — full-page experience with hero, story, menu showcase, reservation teaser, and footer
- **Hero section** — background video with layered text, scroll cue, and ambient gradient
- **Our Story section** — editorial layout with stat callouts, story imagery, value cards, and quote
- **Food & Drink section** — category grid built from provided assets; clicking a category reveals all items in that category with smooth transitions and a sticky back bar
- **Reservation teaser** — warm CTA section linking to the booking page
- **Customer booking flow** — four-step form (party size → date → available times → contact details) with animated transitions between steps
- **Booking confirmation** — dedicated confirmation screen with full booking summary and reference number
- **Admin dashboard** — view bookings by day, week, or all time; cancel bookings; modify bookings; toggle table service status
- **Responsive layout** — designed and tested at 375px, 430px, and desktop widths
- **Scroll animations** — Framer Motion-powered reveal animations, stagger effects, and hover states throughout
- **Premium UI details** — gold accent system, custom typography pairing, skeleton loading states, error states, and smooth transitions everywhere

### Backend

- **REST API** built with Express.js using ES Modules
- **MongoDB Atlas** database with Mongoose schema modeling
- **Restaurant table management** — capacity, zone, and out-of-service status
- **Reservation management** — create, list, cancel, and modify bookings
- **Opening hours configuration** — per-day settings including closed days
- **Booking settings** — configurable slot length, reservation duration, and advance booking window
- **Available slot calculation** — server-side logic that filters by opening hours, table capacity, existing reservations, and active booking locks
- **BookingLock-based double-booking prevention** — atomic lock acquisition using MongoDB unique indexes
- **Validation** — Zod schemas on all inputs with structured error responses
- **Clear error handling** — meaningful status codes and messages throughout

---

## Tech Stack

### Frontend

| Package | Purpose |
|---|---|
| React | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations and scroll-triggered reveals |
| React Router DOM | Client-side routing |
| Axios | HTTP client with interceptors |
| Lucide React | Icon library |

### Backend

| Package | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM and schema modeling |
| Zod | Runtime validation |
| dotenv | Environment variable loading |
| cors | Cross-origin request handling |
| morgan | HTTP request logging |
| nodemon | Dev server auto-restart |
| concurrently | Run frontend and backend in parallel from root |

---

## Folder Structure

```txt
shiraz-afghan-restaurant/
├── client/                        # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                   # Axios instance and API helpers
│   │   │   ├── api.js             # Base Axios instance + extractApiError helper
│   │   │   ├── bookingApi.js      # Booking-specific API calls
│   │   │   └── adminApi.js        # Admin-specific API calls
│   │   ├── components/
│   │   │   ├── admin/             # Admin dashboard components
│   │   │   ├── booking/           # Booking flow step components
│   │   │   ├── common/            # Navbar, Footer, AnimatedSection, etc.
│   │   │   └── home/              # Homepage sections
│   │   ├── data/                  # Menu data, asset imports, restaurant config
│   │   ├── layouts/               # MainLayout, AdminLayout
│   │   ├── pages/                 # HomePage, BookingPage, AdminPage
│   │   ├── raw-assests/           # Provided brand/food assets (images and video)
│   │   └── utils/                 # Shared formatting helpers
│   ├── .env.example
│   └── vite.config.js
│
├── server/                        # Express backend
│   ├── src/
│   │   ├── config/                # Environment config and DB connection
│   │   ├── controllers/           # Route handler functions
│   │   ├── models/                # Mongoose schemas
│   │   ├── routes/                # Express routers
│   │   ├── scripts/               # Seed script
│   │   ├── services/              # Business logic (bookingService.js)
│   │   ├── utils/                 # Response helpers, logger
│   │   ├── validators/            # Zod validation schemas
│   │   ├── app.js                 # Express app setup
│   │   └── server.js              # Entry point
│   └── .env.example
│
├── package.json                   # Root — concurrently dev script
└── README.md
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repo-url>
cd shiraz-afghan-restaurant
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

### 4. Configure Environment Variables

Neither `.env` file is committed to the repository. Copy the examples and fill in your values.

**Frontend** (`client/.env`):

In development, the Vite proxy forwards `/api` requests to the backend automatically so no URL is needed. For production builds, set:

```env
VITE_API_URL=https://your-deployed-api.com/api
```

**Backend** (`server/.env`):

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shiraz?retryWrites=true&w=majority
NODE_ENV=development
```

### 5. Seed the Database

The seed script clears and repopulates the `RestaurantTable`, `OpeningHour`, and `BookingSetting` collections with realistic sample data. Run this before starting the server for the first time.

```bash
cd server
npm run seed
```

This inserts sample tables across four zones (Window, Main Hall, Family Area, Private Dining), weekly opening hours with realistic open/close times and one closed day, and default booking settings (30-minute slots, 90-minute reservations, 30-day advance window).

### 6. Run Both Frontend and Backend Together

From the project root:

```bash
npm run dev
```

This uses `concurrently` to start both servers in a single terminal session.

Or run them separately:

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

### 7. Test Locally

| | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend health check | `http://localhost:5000/api/health` |
| API base | `http://localhost:5000/api` |

---

## Environment Variables

| App | Variable | Purpose |
|---|---|---|
| Frontend | `VITE_API_URL` | Backend API base URL (production only; Vite proxy handles dev) |
| Backend | `PORT` | Port Express listens on |
| Backend | `CLIENT_URL` | Allowed frontend origin for CORS |
| Backend | `MONGO_URI` | MongoDB Atlas connection string |
| Backend | `NODE_ENV` | `development` or `production` |

**Important:**

- Real `.env` files are in `.gitignore` and never committed.
- `.env.example` templates are provided for both apps.
- MongoDB credentials should never be committed to version control.

---

## Database Design

The project uses MongoDB Atlas with Mongoose. Schemas are defined explicitly to keep the data structure predictable and readable. Each collection is described below.

### RestaurantTable

Stores the physical tables in the restaurant.

| Field | Type | Description |
|---|---|---|
| `name` | String | Display name, e.g. `T1`, `Family 1` |
| `capacity` | Number | Maximum guests the table can seat |
| `zone` | String | Area: `Window`, `Main Hall`, `Family Area`, `Private Dining` |
| `isOutOfService` | Boolean | Excludes the table from availability checks |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

**Indexes:** `capacity`, `zone`, `isOutOfService`

The booking engine uses `capacity >= partySize` and `isOutOfService: false` to build the list of eligible tables for any given request.

---

### Reservation

Stores customer bookings.

| Field | Type | Description |
|---|---|---|
| `customerName` | String | Guest's full name |
| `email` | String | Guest's email (lowercase) |
| `phone` | String | Guest's phone number |
| `date` | String | `YYYY-MM-DD` — stored as string for easy day-based querying |
| `startTime` | Date | UTC start time of the reservation |
| `endTime` | Date | UTC end time (start + reservation duration) |
| `partySize` | Number | Number of guests |
| `status` | String | `CONFIRMED`, `CANCELLED`, `COMPLETED`, `NO_SHOW` |
| `table` | ObjectId | Reference to the assigned `RestaurantTable` |
| `specialRequest` | String | Optional guest note |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

**Indexes:** `date`, `status`, compound `(table, startTime, endTime)`

Cancelled reservations are kept in the database for admin visibility. They are excluded from availability checks so they do not block future bookings.

---

### OpeningHour

Stores the weekly schedule, one document per day of the week.

| Field | Type | Description |
|---|---|---|
| `dayOfWeek` | Number | `0` = Sunday, `1` = Monday … `6` = Saturday |
| `openTime` | String | `HH:mm`, e.g. `12:00` |
| `closeTime` | String | `HH:mm`, e.g. `22:30` |
| `isClosed` | Boolean | Marks the restaurant as fully closed on this day |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

The availability endpoint reads these records to determine valid slot ranges and to reject requests for closed days.

---

### BookingSetting

Stores global booking configuration as a single document.

| Field | Type | Description |
|---|---|---|
| `slotLengthMinutes` | Number | Interval between available time options, e.g. `30` |
| `reservationDurationMinutes` | Number | How long each booking holds the table, e.g. `90` |
| `maxAdvanceBookingDays` | Number | How far ahead guests can book, e.g. `30` |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

Keeping these values in the database rather than hardcoded makes the booking logic easier to adjust without redeploying.

---

### BookingLock

Prevents double bookings under near-simultaneous requests. See the [Double-Booking Prevention](#double-booking-prevention) section for full details.

| Field | Type | Description |
|---|---|---|
| `lockKey` | String | Unique: `tableId_YYYY-MM-DD_HH:mm` |
| `table` | ObjectId | The table being held |
| `reservation` | ObjectId | Populated once the reservation is saved; `null` for pending locks |
| `date` | String | `YYYY-MM-DD` |
| `slotTime` | String | `HH:mm` — the segment start time this lock covers |
| `expiresAt` | Date | TTL field — auto-cleaned by MongoDB |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

**Indexes:** unique on `lockKey`, compound `(table, date, slotTime)`, TTL on `expiresAt`

---

## Booking Logic

When a customer submits a booking, the backend follows these steps:

1. Validate the request body (Zod schema: name, email, phone, date, time, partySize).
2. Check the requested date is not in the past and is within the advance booking window.
3. Check the exact time slot has not already passed.
4. Load `OpeningHour` for the requested day — reject if closed or outside operating hours.
5. Query `RestaurantTable` for tables where `capacity >= partySize` and `isOutOfService = false`, sorted smallest capacity first.
6. For each candidate table:
   - Check for any `CONFIRMED` reservation that overlaps the window:
     ```
     existing.startTime < newEndTime AND existing.endTime > newStartTime
     ```
   - Attempt to atomically insert `BookingLock` documents for every time segment the reservation covers (e.g. 19:00, 19:30, 20:00 for a 90-minute booking with 30-minute slots).
   - If all locks are acquired, create the `Reservation` document and link the locks to it.
   - If any lock fails with a duplicate-key error, release any partial locks and try the next table.
7. If no table can be locked, respond with a clear "slot no longer available" message.

Cancelled reservations are excluded from the overlap check, so a cancelled slot is immediately available for new bookings once its locks are removed.

---

## Double-Booking Prevention

Availability checks alone are not safe. Two users can both see a slot as available and submit the booking form at almost the same time. By the time the server processes both requests, the first one has committed the reservation but the second one has not yet detected the conflict.

This project handles that with the `BookingLock` collection. Every table-time segment gets its own lock document with a unique `lockKey`:

```
tableId_YYYY-MM-DD_HH:mm
```

For a 90-minute reservation with 30-minute slots starting at 19:00, the backend tries to insert three lock records:

```
tableId_2026-06-25_19:00
tableId_2026-06-25_19:30
tableId_2026-06-25_20:00
```

Because `lockKey` has a unique index in MongoDB, only one request can insert each lock. If a concurrent request tries to insert the same key, MongoDB returns a duplicate-key error (code `11000`). The backend catches this, rolls back any partial locks for that table, and moves on to the next available table.

**TTL behaviour:**
Locks start with a 60-second expiry so that any lock created by a request that crashes mid-way is automatically cleaned up by MongoDB. Once a reservation is confirmed, the lock expiry is extended to 2 hours after the reservation ends, ensuring the slot stays protected for its full duration.

When a booking is cancelled, its locks are deleted immediately, making the slot available for new bookings right away.

---

## API Overview

All endpoints are prefixed with `/api`.

### Health

```
GET /api/health
```

Returns a 200 with server and database status.

---

### Tables

```
GET  /api/tables
PATCH /api/tables/:id/out-of-service
```

`GET /api/tables` — returns all tables sorted by capacity.

`PATCH /api/tables/:id/out-of-service` — toggles the `isOutOfService` flag. Out-of-service tables are excluded from availability checks immediately.

---

### Availability

```
GET /api/availability?date=YYYY-MM-DD&partySize=4
```

Returns a list of available time slots for the given date and party size. Slots already in the past, on closed days, outside operating hours, or with no free table are excluded.

**Example response:**
```json
{
  "success": true,
  "data": {
    "date": "2026-06-25",
    "partySize": 4,
    "slots": [
      { "time": "12:00", "available": true },
      { "time": "12:30", "available": true }
    ]
  }
}
```

---

### Reservations

```
POST  /api/reservations
GET   /api/reservations
PATCH /api/reservations/:id
PATCH /api/reservations/:id/cancel
```

**`POST /api/reservations`** — create a new reservation.

Request body:
```json
{
  "customerName": "Ali Khan",
  "email": "ali@example.com",
  "phone": "+923001234567",
  "date": "2026-06-25",
  "time": "19:00",
  "partySize": 4,
  "specialRequest": "Window seat if available"
}
```

**`GET /api/reservations`** — list reservations. Optional query params:
- `?date=YYYY-MM-DD` — filter by date
- `?date=YYYY-MM-DD&view=week` — return 7 days from the given date
- No params — returns all reservations

**`PATCH /api/reservations/:id`** — modify an existing reservation. Accepts any subset of fields (date, time, partySize, customerName, phone, specialRequest, status). If the schedule changes, the backend re-runs the full availability and conflict-prevention logic.

**`PATCH /api/reservations/:id/cancel`** — cancel a reservation and immediately release its booking locks.

---

## Design Decisions

The reference restaurant website was studied for inspiration — specifically its use of dark backgrounds, warm accent colours, generous whitespace, typography pairing, and subtle movement. Nothing was copied; the goal was to understand what makes a premium restaurant site feel intentional and then build something with the same quality bar for Shiraz.

The provided assets in `client/src/raw-assests` were used throughout. The hero section uses the provided background video. The food and drink section uses the categorised food image folders directly — a `menuData.js` file maps each category to its images with generated descriptions, so clicking a category on the homepage reveals all items without any external imagery.

**Framer Motion** was chosen because it fits naturally into the React component model. Scroll-triggered reveals, staggered entrance animations, step transitions in the booking flow, and route-level transitions are all handled through the same animation library without pulling in multiple tools.

**Tailwind CSS** was used to keep styling consistent and fast to iterate. Rather than fighting a component library, every design decision is visible in the markup, which makes it straightforward to adjust spacing, colour, and responsiveness.

**All times are stored and calculated in UTC.** The server treats restaurant local time as UTC directly. This sidesteps timezone issues for the scope of this assessment while keeping the logic predictable and verifiable.

**Tables are sorted by capacity (smallest first)** when selecting a table for a booking. This means a party of two is seated at a two-person table before a six-person table, keeping larger tables free for larger groups.

---

## Performance Notes

- Availability is calculated server-side. The frontend never makes booking decisions based on locally cached state — it always re-fetches before confirming.
- MongoDB indexes were added on the most common query fields: `date`, `status`, `(table, startTime, endTime)`, `capacity`, and `isOutOfService`. The compound index on the reservation overlap query is particularly important.
- Images in the menu section use `loading="lazy"` and `decoding="async"` with a skeleton placeholder via the `OptimizedImage` component, so the initial page load is not blocked by food photography.
- The homepage background video uses `preload="metadata"` rather than `preload="auto"` to avoid unnecessary bandwidth on load.
- Framer Motion animations use `useInView` to trigger only when sections enter the viewport, so offscreen animations do not run unnecessarily.

---

## Validation and Error Handling

All inputs pass through Zod schemas before reaching business logic. Validation errors return a structured `errors` array with field names and messages so the frontend can surface them clearly.

The following are explicitly rejected with appropriate error messages:

- Past dates or time slots
- Invalid email formats
- Missing required fields (name, phone, email)
- Party size less than 1
- Bookings for closed days
- Time slots outside opening hours
- Requests when no table can fit the party size
- Booking attempts when a slot is taken or locked

The frontend uses a shared `extractApiError` helper that handles three shapes of failure: no network response (server down), a backend Zod validation errors array, and a plain message string — so users always see meaningful feedback rather than a silent failure.

---

## AI Tools Usage

AI tools were used during this project as part of the development workflow, not as a replacement for understanding the requirements or reviewing the final behaviour.

### ChatGPT

Used for:

- Breaking down the assessment requirements and planning the development order
- Designing the booking data model and thinking through edge cases (double bookings, overlapping reservations, TTL locks)
- Drafting and refining prompts for implementation steps
- Reviewing README structure and technical communication

### Cursor

Used for:

- Generating boilerplate and component scaffolding faster
- Implementing backend routes, services, and validators
- Refactoring repeated logic across components
- Debugging integration issues between frontend and backend
- Improving UI layout and component organisation

### Manual Review

Every piece of AI-generated output was reviewed before being kept:

- Booking edge cases were tested manually against the running server
- UI responsiveness was checked at 375px, 430px, and desktop widths
- Backend route order, conflict prevention behaviour, and error messages were verified manually
- The TTL bug (confirmed booking locks expiring prematurely) was identified through code review and fixed

AI accelerated the build speed, but all decisions about architecture, data modelling, and what to keep or change were made with a developer's judgement applied.

---

## Testing Checklist

### Booking Logic

- [ ] Book a past date → rejected with a clear error
- [ ] Book with an invalid email → validation error returned
- [ ] Book with no customer name or phone → validation error returned
- [ ] Book a party size of 0 → rejected
- [ ] Book a party larger than any available table → "No tables available" error
- [ ] Book a valid slot → confirmation with table and reference number
- [ ] Book the same slot twice → second request gets "slot no longer available"
- [ ] Send two rapid duplicate requests for the same slot → only one succeeds
- [ ] Cancel a booking → slot becomes available again for new bookings
- [ ] Mark a table out of service → it no longer appears in availability
- [ ] Modify a booking to a conflicting slot → conflict is detected and rejected
- [ ] Modify a booking to a past time → rejected

### Frontend and UX

- [ ] Homepage loads at desktop width without layout issues
- [ ] Homepage at 375px — no horizontal scroll, all sections readable
- [ ] Homepage at 430px — buttons and text are comfortably sized
- [ ] Booking flow loading states show while fetching slots
- [ ] Booking flow error states show clearly when the server rejects the request
- [ ] Confirmation step shows correct date, time, table, and reference
- [ ] Server down scenario shows "Unable to connect" rather than a silent failure
- [ ] Scroll animations feel smooth and are not excessive or distracting

### Admin Dashboard

- [ ] Reservations tab loads with skeleton then data
- [ ] Filter by Today, This Week, All works correctly
- [ ] Search by name or email filters the list
- [ ] Cancel a booking — row updates immediately, toast confirms
- [ ] Modify a booking — changes reflected in the list after saving
- [ ] Tables tab shows correct service status for each table
- [ ] Toggle out-of-service — status updates and is reflected in availability

---

## Known Limitations

- **No admin authentication.** The `/admin` dashboard has no login gate. It is accessible by URL. Authentication was not a core requirement of this assessment.
- **No email or SMS notifications.** Customers receive a confirmation screen with a reference number but no automated email. A service like SendGrid or Twilio was outside the scope of this project.
- **No payment processing.** The booking system reserves a table but does not handle deposits or payments.
- **Homepage is single-page.** The site covers the requested sections — hero, story, menu showcase, reservation teaser, and footer — but does not include full subpages for a complete menu, blog, or about page.
- **MongoDB TTL cleanup latency.** Abandoned `BookingLock` documents (from failed requests) expire after 60 seconds, but MongoDB's TTL background job runs approximately once per minute, so a stale lock may persist for up to a minute beyond its expiry. This is a MongoDB engine constraint and does not affect correctly completed bookings.

---

## Final Notes

This project was built to demonstrate both frontend craft and practical backend booking logic. The goal was not just to make something that looks good in a screenshot — it was to handle real reservation concerns: matching capacity, respecting opening hours, preventing double bookings atomically, and giving users clear feedback at every step.

The design reflects the brief: a premium feel for a real restaurant brand, using the provided assets, with original layout decisions rather than borrowing a template. The booking engine is genuinely functional: it validates, checks availability, prevents conflicts, and cleans up after itself.

The engineering choices throughout — Zod for validation, BookingLock for concurrency, TTL indexes for cleanup, indexes for query performance, and a shared error helper on the frontend — were made deliberately and can be explained and defended.
