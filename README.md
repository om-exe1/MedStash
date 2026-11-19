# MedStash 💊

> Neighborhood Medicine & Pharmacy Finder — Search neighborhood pharmacy medicine stock availability, compare prices, and reserve online.

🔗 **Live Demo**: 

---

## 📌 Features

- **Medicine Availability Search**: Real-time stock status across nearby pharmacies.
- **Price Comparison**: Compare medicine pricing across local drugstores to find the best deal.
- **Interactive Map**: View pharmacy locations and distances.
- **Online Reservation**: Reserve medicine for pickup at nearby stores.
- **Modern Responsive UI**: Built with React, Tailwind CSS, Lucide Icons, and Motion animations.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Python 3, FastAPI, SQLAlchemy, Uvicorn
- **Database**: SQLite (`medstash.db`)
- **API Docs**: Swagger UI (`/docs`) & ReDoc (`/redoc`)
- **Routing**: React Router DOM v6
- **Build Tool**: Vite
- **Deployment**: Vercel (Frontend), Python ASGI (Backend)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Python (3.10+ recommended)

### 1. Start the Backend API

In a terminal, run:
```bash
# Double click start_backend.bat on Windows, or run:
cd backend
python run.py
```
- API will run at: `http://127.0.0.1:8000`
- Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`

### 2. Start the Frontend

In another terminal, run:
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. Frontend API requests will automatically proxy to the FastAPI backend!

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📁 Project Documentation

Project reports, synopsis, and presentations are available in the [`docs/`](./docs) folder:
- **Final Report / Synopsis**: `MedStash_Final_fixed-1.pdf` & `MedStash_14_Page_Synopsis.pdf`
- **Synopsis Document**: `MedStash_Final_Synopsis.docx` & `MedStash_Synopsis_Report.docx`
- **Presentation Slides**: `MedStash_ppt.pptx`
