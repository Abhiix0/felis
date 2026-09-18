from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Header, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.session import get_db
from db.repositories.task import TaskRepository
from db.models import SyncMutation as SyncMutationModel
from auth.dependencies import get_current_user
from auth.adapter import AuthenticatedUser
from domain.task_service import TaskCreate, TaskUpdate, TaskResponse
from domain.activity_service import record_activity
from app.errors import NotFoundError

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("", response_model=list[TaskResponse])
async def list_tasks(
    projectId: UUID | None = None,
    status: str | None = None,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    task_repo = TaskRepository(db)
    tasks = await task_repo.get_by_user(current_user.id, project_id=projectId, status=status)
    return [TaskResponse.model_validate(t) for t in tasks]

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    data: TaskCreate,
    request: Request,
    x_client_mutation_id: str | None = Header(None, alias="X-Client-Mutation-ID"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Idempotency check
    if x_client_mutation_id:
        try:
            m_uuid = UUID(x_client_mutation_id)
            stmt = select(SyncMutationModel).where(
                SyncMutationModel.id == m_uuid,
                SyncMutationModel.user_id == current_user.id
            )
            res = await db.execute(stmt)
            existing_mutation = res.scalar_one_or_none()
            if existing_mutation and existing_mutation.payload:
                task_id_str = existing_mutation.payload.get("task_id")
                if task_id_str:
                    task_repo = TaskRepository(db)
                    existing_task = await task_repo.get_by_id(UUID(task_id_str), current_user.id)
                    if existing_task:
                        return TaskResponse.model_validate(existing_task)
        except ValueError:
            pass

    task_repo = TaskRepository(db)
    task = await task_repo.create(current_user.id, data.model_dump())

    if x_client_mutation_id:
        try:
            mutation = SyncMutationModel(
                id=UUID(x_client_mutation_id),
                user_id=current_user.id,
                type="CREATE_TASK",
                payload={"task_id": str(task.id)},
                status="completed",
            )
            db.add(mutation)
            await db.commit()
        except Exception:
            pass

    await record_activity(
        db,
        current_user.id,
        "TASK_CREATED",
        task.id,
        "task",
        {"title": task.title, "priority": task.priority},
    )

    return TaskResponse.model_validate(task)

@router.get("/{id}", response_model=TaskResponse)
async def get_task(
    id: UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    task_repo = TaskRepository(db)
    task = await task_repo.get_by_id(id, current_user.id)
    if not task:
        raise NotFoundError("Task")
    return TaskResponse.model_validate(task)

@router.patch("/{id}", response_model=TaskResponse)
async def update_task(
    id: UUID,
    data: TaskUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    task_repo = TaskRepository(db)
    task = await task_repo.get_by_id(id, current_user.id)
    if not task:
        raise NotFoundError("Task")
    updated = await task_repo.update(task, data.model_dump(exclude_unset=True))
    await record_activity(
        db,
        current_user.id,
        "TASK_UPDATED",
        task.id,
        "task",
        {"title": updated.title, "status": updated.status},
    )
    return TaskResponse.model_validate(updated)

@router.post("/{id}/complete", response_model=TaskResponse)
async def complete_task(
    id: UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    task_repo = TaskRepository(db)
    task = await task_repo.get_by_id(id, current_user.id)
    if not task:
        raise NotFoundError("Task")
    now = datetime.now(timezone.utc)
    updated = await task_repo.update(task, {"status": "completed", "completed_at": now})
    await record_activity(
        db,
        current_user.id,
        "TASK_COMPLETED",
        task.id,
        "task",
        {"title": updated.title},
    )
    return TaskResponse.model_validate(updated)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    id: UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    task_repo = TaskRepository(db)
    task = await task_repo.get_by_id(id, current_user.id)
    if not task:
        raise NotFoundError("Task")
    await record_activity(
        db,
        current_user.id,
        "TASK_DELETED",
        task.id,
        "task",
        {"title": task.title},
    )
    await task_repo.delete(task)
