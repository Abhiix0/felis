import uuid
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from api.health import router as health_router
from api.auth import router as auth_router
from api.me import router as me_router
from api.projects import router as projects_router
from api.tasks import router as tasks_router
from api.recommendations import router as recommendations_router
from api.focus_sessions import router as focus_sessions_router
from api.home import router as home_router
from app.config import settings
from app.errors import FelisException, felis_exception_handler, validation_exception_handler

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

app.add_exception_handler(FelisException, felis_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(me_router)
app.include_router(projects_router)
app.include_router(tasks_router)
app.include_router(recommendations_router)
app.include_router(focus_sessions_router)
app.include_router(home_router)
