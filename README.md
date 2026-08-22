# Incorvo Reach

> **Verified Actions. Measurable Growth.**

A production-ready, high-trust two-sided marketplace where businesses pay for genuine, verifiable customer actions (qualitative research, original UGC, demo appointments, store visits, referrals, and sales) rather than artificial social media metrics. Operated by **Quenix Analytics Private Limited**.

---

## Architecture Overview

```text
incorvo-reach/
├── apps/
│   └── web/                     # Next.js 15 App Router, React 19, TypeScript, Tailwind CSS
├── services/
│   ├── api/                     # FastAPI Backend, SQLAlchemy async ORM, Argon2id, Double-Entry Ledger
│   └── worker/                  # Background worker definitions
├── packages/
│   └── shared-types/            # Common domain types
├── infrastructure/              # Docker & production configs
├── docker-compose.yml           # PostgreSQL, Redis, API, and Next.js containers
├── .env.example                 # Environment variables specification
└── README.md
```

---

## Key Capabilities & Features

1. **Marketplace Engine**:
   - 12 standardized campaign templates (Private Research Survey, Original UGC Video, Hosted Video & Quiz, Qualified Leads, Store Visit QR Check-in, Tracked Coupons, Referrals, etc.).
   - Multi-step guided Campaign Creation Wizard with real-time budget and escrow calculators.
2. **Immutable Double-Entry Ledger**:
   - Double-entry accounting system where $\sum \text{Debit} = \sum \text{Credit}$ is enforced for every journal posting.
   - Escrow holds on campaign creation, instant participant wallet settlements on approval, and regulated payout requests.
3. **Role-Based Access Control (RBAC)**:
   - Public Visitor, Participant, Vendor Owner/Manager/Analyst, Verifier/Moderator, Finance Admin, Super Admin.
   - Built-in **Live Demo Role Switcher** to seamlessly test the application from any perspective.
4. **Anti-Fraud & Integrity Safeguards**:
   - Zero tolerance for paid 5-star public reviews, bot clicks, or follower manipulation.
   - Perceptual image hashing, device velocity scoring, and human verification queues.

---

## Local Development Quickstart

### 1. Prerequisites
- Node.js 20+ & npm
- Python 3.11+ (or Python 3.13)
- Docker & Docker Compose (optional for containerized run)

### 2. Backend (FastAPI)

```bash
# Navigate to API service
cd services/api

# Create & activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run seed script (populates realistic vendors, participants, campaigns, submissions & ledger entries)
PYTHONPATH=. python -m app.seed.seed_data

# Run test suite (Auth, RBAC, Double-entry ledger invariants, Campaign flow)
PYTHONPATH=. pytest

# Start FastAPI development server (Port 8000)
uvicorn app.main:app --reload --port 8000
```

FastAPI OpenAPI Documentation will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend (Next.js 15 Web App)

```bash
# Navigate to web application
cd apps/web

# Install dependencies
npm install

# Start Next.js development server (Port 3000)
npm run dev
```

Visit the web platform at: [http://localhost:3000](http://localhost:3000)

### 4. Running with Docker Compose

```bash
docker compose up --build
```

---

## Seed Accounts & Identities

All seed accounts share the default development password: `IncorvoPass2026!`

| Role | Email | Description |
| :--- | :--- | :--- |
| **Super Admin** | `admin@reach.incorvo.in` | Platform governance, revenue & risk oversight |
| **Moderator** | `moderator@reach.incorvo.in` | Verifier for UGC proofs, fraud alerts & disputes |
| **Vendor Owner** | `founder@novahealth.in` | NovaHealth Organics (Verified Vendor) |
| **Participant 1** | `ananya.iyer@gmail.com` | Software Engineer in Bengaluru (₹1,000 wallet) |
| **Participant 2** | `rohit.verma@outlook.com` | Student in Delhi (₹500 completed payout) |
| **Participant 3** | `kavita.patel@yahoo.com` | Marketing Consultant in Ahmedabad |

*Tip: You can also use the interactive Role Switcher bar at the top of the webpage to jump into any role instantly.*

---

## Verification & Testing

- **Backend Pytest**: `PYTHONPATH=services/api ./services/api/.venv/bin/pytest services/api/tests`
- **Frontend Typecheck**: `npm --prefix apps/web run type-check`
- **Frontend Production Build**: `npm --prefix apps/web run build`
