from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base, SessionLocal
from .seed import seed_database
from .routers import medicines, pharmacies, reservations, auth, notifications, analytics

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup database schema and initial seed data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="MedStash API",
    description="Backend API for MedStash — Neighborhood Medicine & Pharmacy Finder",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS so Vite React frontend can make cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route handlers
app.include_router(medicines.router)
app.include_router(pharmacies.router)
app.include_router(reservations.router)
app.include_router(auth.router)
app.include_router(notifications.router)
app.include_router(analytics.router)

@app.get("/", tags=["Health"])
@app.get("/api", tags=["Health"])
@app.get("/api/", tags=["Health"])
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "service": "MedStash Backend API",
        "version": "1.0.0",
        "docs": "/docs"
    }
