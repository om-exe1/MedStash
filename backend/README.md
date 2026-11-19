# MedStash Backend 🚀

Fast, modern Python backend built with **FastAPI**, **SQLAlchemy**, and **SQLite** to power MedStash — Neighborhood Medicine & Pharmacy Finder.

---

## 📌 Features

- **Interactive API Documentation**: Built-in Swagger UI at `http://127.0.0.1:8000/docs` and ReDoc at `http://127.0.0.1:8000/redoc`.
- **Pre-seeded Database**: Automatically seeds medicine catalog, pharmacies, and stock inventory into local `medstash.db` on first run.
- **RESTful Endpoints**:
  - `GET /api/medicines` — Search medicines, filter by category or popular status.
  - `GET /api/medicines/{id}` — Full medicine details, dosage, precautions.
  - `GET /api/pharmacies` — List local pharmacies and their inventory.
  - `PUT /api/pharmacies/{pharmacy_id}/inventory/{medicine_id}` — Live stock & price updates for pharmacy owners.
  - `GET /api/reservations` — Fetch patient/pharmacy reservations.
  - `POST /api/reservations` — Book a medicine reservation (auto-generates reservation code and updates inventory).
  - `PATCH /api/reservations/{id}/status` — Mark reservation as `Picked Up` or `Cancelled` (restores stock if cancelled).
  - `POST /api/auth/login` — Patient & Pharmacy Owner role login.
  - `GET /api/notifications` — Notification alerts for stock and deals.
- **Vite Integration**: Vite dev server proxies `/api` directly to `http://127.0.0.1:8000`.

---

## 🛠️ Quick Start

### 1. Activate the Virtual Environment
```bash
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1

# Or in Windows CMD:
.\.venv\Scripts\activate.bat
```

### 2. Start the Backend Server
```bash
python run.py
```
Or directly with uvicorn:
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The server will start at:
- **API URL**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
