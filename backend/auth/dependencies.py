from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth.adapter import AuthenticatedUser, AuthAdapter
from auth.dev_jwt import DevJWTAdapter
from app.config import settings
from app.errors import UnauthorizedError

security = HTTPBearer(auto_error=False)

def get_auth_adapter() -> AuthAdapter:
    if settings.AUTH_PROVIDER == "dev_jwt":
        return DevJWTAdapter()
    raise NotImplementedError(f"Auth provider {settings.AUTH_PROVIDER} not implemented")

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    adapter: AuthAdapter = Depends(get_auth_adapter),
) -> AuthenticatedUser:
    if not credentials or not credentials.credentials:
        raise UnauthorizedError("Missing authentication token.")
    user = await adapter.verify_token(credentials.credentials)
    if not user:
        raise UnauthorizedError("Invalid or expired authentication token.")
    return user
