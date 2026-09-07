from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import upload

app = FastAPI(title="InsightX API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (Vercel, localhost, etc.)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers under both prefixes so routing succeeds whether /api is forwarded or stripped
app.include_router(upload.router, prefix="/api/v1")
app.include_router(upload.router, prefix="/v1")

@app.get("/")
@app.get("/api")
@app.get("/api/health")
def root():
    return {"message": "InsightX API is running", "status": "ok"}

