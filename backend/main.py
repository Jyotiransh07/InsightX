from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import upload

app = FastAPI(title="InsightX API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "InsightX API is running"}
