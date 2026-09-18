from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel

class ErrorDetail(BaseModel):
    code: str
    message: str
    request_id: str

class ErrorResponse(BaseModel):
    error: ErrorDetail

class FelisException(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)

class NotFoundError(FelisException):
    def __init__(self, resource: str):
        super().__init__(f"{resource.upper()}_NOT_FOUND", f"{resource} was not found.", status.HTTP_404_NOT_FOUND)

class ForbiddenError(FelisException):
    def __init__(self, message: str = "Access denied."):
        super().__init__("FORBIDDEN", message, status.HTTP_403_FORBIDDEN)

class UnauthorizedError(FelisException):
    def __init__(self, message: str = "Invalid or expired token."):
        super().__init__("UNAUTHORIZED", message, status.HTTP_401_UNAUTHORIZED)

class ValidationError(FelisException):
    def __init__(self, message: str = "Invalid request payload."):
        super().__init__("VALIDATION_ERROR", message, status.HTTP_422_UNPROCESSABLE_ENTITY)

async def felis_exception_handler(request: Request, exc: FelisException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "unknown")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "request_id": request_id,
            }
        },
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "unknown")
    first_error = exc.errors()[0] if exc.errors() else {"msg": "Validation failed"}
    msg = f"{first_error.get('loc', ['body'])[-1]}: {first_error.get('msg', 'invalid')}"
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": msg,
                "request_id": request_id,
            }
        },
    )
