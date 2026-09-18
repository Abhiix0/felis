from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from db.models import User as UserModel, Profile as ProfileModel

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: UUID) -> UserModel | None:
        result = await self.db.execute(select(UserModel).where(UserModel.id == user_id))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> UserModel | None:
        result = await self.db.execute(select(UserModel).where(UserModel.email == email))
        return result.scalar_one_or_none()

    async def get_or_create_dev_user(self, email: str, display_name: str) -> UserModel:
        user = await self.get_by_email(email)
        if not user:
            user = UserModel(email=email, display_name=display_name)
            self.db.add(user)
            await self.db.flush()
            profile = ProfileModel(user_id=user.id)
            self.db.add(profile)
            await self.db.commit()
            await self.db.refresh(user)
        return user
