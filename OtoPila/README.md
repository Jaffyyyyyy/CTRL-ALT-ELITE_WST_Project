# OtoPila – Smart Queue for Car Care

OtoPila is a lightweight, front-end–only demo of a smart queueing system for automotive service centers. Customers can join a queue and track their status in real-time; advisors can manage the queue from a dashboard. Data is stored in the browser via localStorage and seeded with demo data for easy testing.

This repository contains the OtoPila front-end under the `OtoPila/` folder.

## Highlights

- Join the queue remotely and get a queue number
- Live status page with “Now Serving” and customers-ahead count
- Advisor dashboard to call next customer, update statuses, and load demo data
- Auto-loaded demo dataset for quick try-outs
- Car plate input auto-format: ABC-1234
- Minimal, consistent Quick Actions buttons in the dashboard

## Folder structure

```
OtoPila/
	index.html              # Landing page
	queue.html              # Join the service queue
	status.html             # View queue status and "Now Serving"
	advisor-portal.html     # Advisor login page
	advisor-dashboard.html  # Advisor queue management
	scripts/                # App logic (no bundler/build step)
	styles/                 # CSS (Bootstrap is included via CDN)
	demodata/               # Sample queue data (auto-loaded on first run)
	partials/               # Header/footer includes for nav loader
```

Key scripts:

- `scripts/queue-logic.js` – localStorage-backed queue state and operations
- `scripts/auto-load-demo.js` – seeds demo data when storage is empty
- `scripts/join-queue.js` – form handling + car plate auto-format/validation
- `scripts/status-page.js` – customer-facing status updates
- `scripts/advisor-dashboard.js` – advisor view, metrics, and actions
- `scripts/auth.js` + `scripts/auth-guard.js` – simple advisor auth and guard

## Running locally

Open the files via a simple static server (recommended for loading the demo JSON). If Python is installed:

```cmd
py -m http.server 5500
```

Then open:

- http://localhost:5500/OtoPila/index.html
- http://localhost:5500/OtoPila/advisor-portal.html

## Demo data

On first load (empty storage), OtoPila auto-loads `demodata/sample-queue.json` to populate sample customers. This helps both the Status page and Advisor Dashboard show realistic data instantly.

## Advisor login

Hardcoded demo credentials (see `scripts/auth.js`):

- Username: `admin`
- Password: `password123`

After login, you’ll be redirected to `advisor-dashboard.html`.

## Usage guide

Customer journey:

1. Open `index.html` and click “Join Queue Now” → `queue.html`
2. Enter your name, optional email, and optional car plate
	 - Car plate auto-formats to ABC-1234 (uppercase letters + dash + digits)
3. Submit to get your queue number and be redirected to `status.html`

Advisor journey:

1. Go to `advisor-portal.html` and login (admin/password123)
2. From the dashboard:
	 - View “Now Serving” and “Next In Queue”
	 - Update a customer’s status (Waiting, In Service, Completed)
	 - Call Next Customer (moves first Waiting → In Service)
	 - Load Demo Data or Clear Queue

## Data model & persistence

State is saved in `localStorage` under the key `otoPilaQueue` and includes:

- `customers`: active customers with `status` of Waiting or In Service
- `history`: completed customers
- `nowServing`: the id of the customer currently in service (may be null)
- `nextQueueNumber`: counter used for new queue numbers (`A-###`)

Events: UI updates listen to `storage` and a custom `queueUpdated` event to re-render.

## Recent improvements

- Now Serving display is more robust: if the stored id is missing, it falls back to the first “In Service” customer; otherwise it shows `---` (never blank)
- Car plate input masking and validation added on the Join Queue form (ABC-1234)
- Quick Actions buttons restyled to a minimal, consistent look (`.btn-quick-*`)

Date: 2025‑10‑19

## Troubleshooting

- “Now Serving” is blank
	- With the latest scripts, it should show the current “In Service” queue number or `---` when none is active.
	- Ensure `scripts/queue-logic.js`, `scripts/status-page.js`, and `scripts/advisor-dashboard.js` are not cached (hard refresh).

- Resetting the app state
	- Clear the browser’s localStorage or click “Clear Queue” in the Advisor Dashboard.

## Contributing

This is a demo project; contributions are welcome. Keep it dependency-light and avoid adding build steps unless necessary. Match existing code style and prefer small, focused changes.

## Credits & Attribution

### Image Assets

Stock photos used under the Unsplash License:
- **Car illustration** - Photo by [Erik McLean](https://unsplash.com/@introspectivedsgn) on Unsplash
- **Checklist image** - Photo by [C Joyful](https://unsplash.com/@alonly) on Unsplash

For full attribution details, see [CREDITS.md](CREDITS.md).

## AI Assistance

AI assistance was used for the following:
- Refactoring and implementing of scripts through Learning Agent CHATGPT
- Grammar for READ.me
