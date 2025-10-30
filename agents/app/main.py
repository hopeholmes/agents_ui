from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import health, agents, dashboard, approvals, events, logs

# -------------------------------------------------
# Initialize the main FastAPI app
# -------------------------------------------------
app = FastAPI(
    title="Americana Agents API",
    version="1.0.0",
    description="Backend API for the Americana Amplified ecosystem (Agents, Strategy, CRM, and UI)."
)

# -------------------------------------------------
# CORS Middleware: allow frontend & related domains
# -------------------------------------------------
origins = [
    "https://agents.americanaamplified.com",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://www.agents.americanaamplified.com",
    "https://api.americanaamplified.com",  # safe to include self
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# Routers
# -------------------------------------------------
app.include_router(health.router)
app.include_router(agents.router)
app.include_router(dashboard.router)
app.include_router(approvals.router)
app.include_router(events.router)
app.include_router(logs.router)

# -------------------------------------------------
# Root endpoint
# -------------------------------------------------
@app.get("/")
async def root():
    return {"message": "Welcome to Americana Agents API"}

