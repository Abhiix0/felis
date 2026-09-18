from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from db.models import Project as ProjectModel, Task as TaskModel

class ProjectRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user(self, user_id: UUID) -> list[ProjectModel]:
        result = await self.db.execute(
            select(ProjectModel).where(ProjectModel.user_id == user_id).order_by(ProjectModel.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, project_id: UUID, user_id: UUID) -> ProjectModel | None:
        result = await self.db.execute(
            select(ProjectModel).where(
                and_(ProjectModel.id == project_id, ProjectModel.user_id == user_id)
            )
        )
        return result.scalar_one_or_none()

    async def create(self, user_id: UUID, data: dict) -> ProjectModel:
        project = ProjectModel(user_id=user_id, **data)
        self.db.add(project)
        await self.db.commit()
        await self.db.refresh(project)
        return project

    async def update(self, project: ProjectModel, data: dict) -> ProjectModel:
        for key, value in data.items():
            if value is not None:
                setattr(project, key, value)
        await self.db.commit()
        await self.db.refresh(project)
        return project

    async def delete(self, project: ProjectModel) -> None:
        await self.db.delete(project)
        await self.db.commit()
