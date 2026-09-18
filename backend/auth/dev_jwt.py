import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt, JWTError
from auth.adapter import AuthAdapter, AuthenticatedUser
from app.config import settings

# DEV ADAPTER — Not for production use.
# In production, swap with managed provider adapter (Supabase, Clerk, Auth0).
class DevJWTAdapter(AuthAdapter):
    ALGORITHM = "HS256"

    async def create_dev_token(self, email: str, display_name: str, user_id: Optional[uuid.UUID] = None) -> str:
        uid = str(user_id or uuid.uuid4())
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        payload = {
            "sub": uid,
            "email": email,
            "display_name": display_name,
            "exp": expire,
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=self.ALGORITHM)

    async def verify_token(self, token: str) -> Optional[AuthenticatedUser]:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[self.ALGORITHM])
            user_id_str = payload.get("sub")
            email = payload.get("email")
            display_name = payload.get("display_name", "")
            if not user_id_str or not email:
                return None
            return AuthenticatedUser(
                id=uuid.UUID(user_id_str),
                email=email,
                display_name=display_name,
            )
        except (JWTError, ValueError):
            return None
