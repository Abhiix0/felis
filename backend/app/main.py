import uuid
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from api.health import router as health_router
from app.config import settings

app = FastAPI(
    title="FELIS API",
    version="0.1.0",
    description="FELIS — Personal Execution OS API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

app.include_router(health_router)
