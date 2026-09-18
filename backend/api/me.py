from uuid import UUID
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.session import get_db
from db.models import User as UserModel, Profile as ProfileModel
from auth.dependencies import get_current_user
from auth.adapter import AuthenticatedUser
from app.errors import NotFoundError

router = APIRouter(prefix="/me", tags=["user"])

class ProfileSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    timezone: str = "UTC"
    preferred_focus_minutes: int = 25
    work_start_hour: int = 9
    work_end_hour: int = 18

class UserProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str
    display_name: str
    avatar_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    profile: ProfileSchema

class ProfileUpdate(BaseModel):
    display_name: Optional[str] = Field(None, min_length=1, max_length=100)
    timezone: Optional[str] = None
    preferred_focus_minutes: Optional[int] = Field(None, ge=5, le=180)
    work_start_hour: Optional[int] = Field(None, ge=0, le=23)
    work_end_hour: Optional[int] = Field(None, ge=0, le=23)

@router.get("", response_model=UserProfileResponse)
async def get_my_profile(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(UserModel).where(UserModel.id == current_user.id)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if not user:
        raise NotFoundError("User")

    prof_stmt = select(ProfileModel).where(ProfileModel.user_id == current_user.id)
    prof_res = await db.execute(prof_stmt)
    profile = prof_res.scalar_one_or_none()
    if not profile:
        profile = ProfileModel(user_id=user.id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)

    return UserProfileResponse(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        avatar_url=user.avatar_url,
        created_at=user.created_at,
        updated_at=user.updated_at,
        profile=ProfileSchema.model_validate(profile),
    )

@router.patch("", response_model=UserProfileResponse)
async def update_my_profile(
    data: ProfileUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(UserModel).where(UserModel.id == current_user.id)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if not user:
        raise NotFoundError("User")

    if data.display_name is not None:
        user.display_name = data.display_name

    prof_stmt = select(ProfileModel).where(ProfileModel.user_id == current_user.id)
    prof_res = await db.execute(prof_stmt)
    profile = prof_res.scalar_one_or_none()
    if not profile:
        profile = ProfileModel(user_id=user.id)
        db.add(profile)

    if data.timezone is not None:
        profile.timezone = data.timezone
    if data.preferred_focus_minutes is not None:
        profile.preferred_focus_minutes = data.preferred_focus_minutes
    if data.work_start_hour is not None:
        profile.work_start_hour = data.work_start_hour
    if data.work_end_hour is not None:
        profile.work_end_hour = data.work_end_hour

    await db.commit()
    await db.refresh(user)
    await db.refresh(profile)

    return UserProfileResponse(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        avatar_url=user.avatar_url,
        created_at=user.created_at,
        updated_at=user.updated_at,
        profile=ProfileSchema.model_validate(profile),
    )
