from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db
from db.repositories.user import UserRepository
from auth.dependencies import get_auth_adapter
from auth.adapter import AuthAdapter
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

class DevTokenRequest(BaseModel):
    email: EmailStr
    display_name: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str

@router.post("/token", response_model=TokenResponse)
async def create_token(
    request: DevTokenRequest,
    db: AsyncSession = Depends(get_db),
    adapter: AuthAdapter = Depends(get_auth_adapter),
):
    if settings.AUTH_PROVIDER != "dev_jwt":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Dev token generation is disabled in this environment."
        )

    user_repo = UserRepository(db)
    user = await user_repo.get_or_create_dev_user(request.email, request.display_name)
    token = await adapter.create_dev_token(user.email, user.display_name, user.id)

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=str(user.id),
    )
