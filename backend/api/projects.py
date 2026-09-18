from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db
from db.repositories.project import ProjectRepository
from db.repositories.task import TaskRepository
from auth.dependencies import get_current_user
from auth.adapter import AuthenticatedUser
from domain.project_service import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectStats
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
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    project_repo = ProjectRepository(db)
    project = await project_repo.create(current_user.id, data.model_dump())
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
    await project_repo.delete(project)
