from uuid import UUID
from fastapi import APIRouter, Depends, Header, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.session import get_db
from db.models import SyncMutation as SyncMutationModel
from db.repositories.project import ProjectRepository
from db.repositories.task import TaskRepository
from auth.dependencies import get_current_user
from auth.adapter import AuthenticatedUser
from domain.project_service import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectStats
from domain.activity_service import record_activity
from app.errors import NotFoundError

router = APIRouter(prefix="/projects", tags=["projects"])

def compute_project_stats(tasks) -> ProjectStats:
    total = len(tasks)
    completed = sum(1 for t in tasks if t.status == "completed")
    active = total - completed
    progress = round((completed / total) * 100) if total > 0 else 0
    return ProjectStats(
        totalTasks=total,
        activeTasks=active,
        completedTasks=completed,
        progressPercent=progress,
    )

@router.get("", response_model=list[ProjectResponse])
async def list_projects(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    project_repo = ProjectRepository(db)
    task_repo = TaskRepository(db)
    projects = await project_repo.get_by_user(current_user.id)
    all_tasks = await task_repo.get_by_user(current_user.id)

    responses = []
    for p in projects:
        p_tasks = [t for t in all_tasks if t.project_id == p.id]
        stats = compute_project_stats(p_tasks)
        resp = ProjectResponse.model_validate(p)
        resp.stats = stats
        responses.append(resp)
    return responses

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreate,
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
                project_id_str = existing_mutation.payload.get("project_id")
                if project_id_str:
                    project_repo = ProjectRepository(db)
                    existing_project = await project_repo.get_by_id(UUID(project_id_str), current_user.id)
                    if existing_project:
                        resp = ProjectResponse.model_validate(existing_project)
                        resp.stats = ProjectStats()
                        return resp
        except ValueError:
            pass

    project_repo = ProjectRepository(db)
    project = await project_repo.create(current_user.id, data.model_dump())

    if x_client_mutation_id:
        try:
            mutation = SyncMutationModel(
                id=UUID(x_client_mutation_id),
                user_id=current_user.id,
                type="CREATE_PROJECT",
                payload={"project_id": str(project.id)},
                status="completed",
            )
            db.add(mutation)
            await db.commit()
        except Exception:
            pass

    await record_activity(
        db,
        current_user.id,
        "PROJECT_CREATED",
        project.id,
        "project",
        {"name": project.name},
    )

    resp = ProjectResponse.model_validate(project)
    resp.stats = ProjectStats()
    return resp

@router.get("/{id}", response_model=ProjectResponse)
async def get_project(
    id: UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    project_repo = ProjectRepository(db)
    task_repo = TaskRepository(db)
    project = await project_repo.get_by_id(id, current_user.id)
    if not project:
        raise NotFoundError("Project")
    p_tasks = await task_repo.get_by_user(current_user.id, project_id=id)
    resp = ProjectResponse.model_validate(project)
    resp.stats = compute_project_stats(p_tasks)
    return resp

@router.patch("/{id}", response_model=ProjectResponse)
async def update_project(
    id: UUID,
    data: ProjectUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    project_repo = ProjectRepository(db)
    project = await project_repo.get_by_id(id, current_user.id)
    if not project:
        raise NotFoundError("Project")
    updated = await project_repo.update(project, data.model_dump(exclude_unset=True))
    await record_activity(
        db,
        current_user.id,
        "PROJECT_UPDATED",
        project.id,
        "project",
        {"name": updated.name},
    )
    resp = ProjectResponse.model_validate(updated)
    return resp

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    id: UUID,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    project_repo = ProjectRepository(db)
    project = await project_repo.get_by_id(id, current_user.id)
    if not project:
        raise NotFoundError("Project")
    await record_activity(
        db,
        current_user.id,
        "PROJECT_DELETED",
        project.id,
        "project",
        {"name": project.name},
    )
    await project_repo.delete(project)
