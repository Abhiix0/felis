from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from db.models import Task as TaskModel, Subtask as SubtaskModel

class TaskRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user(
        self,
        user_id: UUID,
        project_id: UUID | None = None,
        status: str | None = None
    ) -> list[TaskModel]:
        query = select(TaskModel).options(selectinload(TaskModel.subtasks)).where(TaskModel.user_id == user_id)
        if project_id:
            query = query.where(TaskModel.project_id == project_id)
        if status:
            query = query.where(TaskModel.status == status)
        query = query.order_by(TaskModel.created_at.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_by_id(self, task_id: UUID, user_id: UUID) -> TaskModel | None:
        result = await self.db.execute(
            select(TaskModel)
            .options(selectinload(TaskModel.subtasks))
            .where(and_(TaskModel.id == task_id, TaskModel.user_id == user_id))
        )
        return result.scalar_one_or_none()

    async def create(self, user_id: UUID, data: dict) -> TaskModel:
        clean_data = {k: v for k, v in data.items() if v is not None or k != "id"}
        if clean_data.get("id") is None:
            clean_data.pop("id", None)
        task = TaskModel(user_id=user_id, **clean_data)
        self.db.add(task)
        await self.db.commit()
        await self.db.refresh(task)
        return task

    async def update(self, task: TaskModel, data: dict) -> TaskModel:
        for key, value in data.items():
            if value is not None:
                setattr(task, key, value)
        await self.db.commit()
        await self.db.refresh(task)
        return task

    async def delete(self, task: TaskModel) -> None:
        await self.db.delete(task)
        await self.db.commit()
