from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db
from db.repositories.task import TaskRepository
from db.repositories.project import ProjectRepository
from auth.dependencies import get_current_user
from auth.adapter import AuthenticatedUser
from domain.recommendation_engine import compute_next_action
from domain.task_service import TaskResponse

router = APIRouter(prefix="/home", tags=["home"])

class HomeResponse(BaseModel):
    greeting: str
    date_label: str
    today_tasks: List[TaskResponse]
    recommendation: Optional[dict] = None
    recently_completed: List[TaskResponse] = []

@router.get("", response_model=HomeResponse)
async def get_home_feed(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    task_repo = TaskRepository(db)
    project_repo = ProjectRepository(db)

    tasks = await task_repo.get_by_user(current_user.id)
    projects = await project_repo.get_by_user(current_user.id)

    now = datetime.now(timezone.utc)
    hour = now.hour
    if hour < 12:
        greeting = f"Good morning, {current_user.display_name}"
    elif hour < 17:
        greeting = f"Good afternoon, {current_user.display_name}"
    else:
        greeting = f"Good evening, {current_user.display_name}"

    today_str = now.strftime("%A, %d %B")

    today_tasks = [TaskResponse.model_validate(t) for t in tasks if t.status != "completed"]
    completed_tasks = [TaskResponse.model_validate(t) for t in tasks if t.status == "completed"][:5]

    rec = compute_next_action(tasks, projects, now)

    return HomeResponse(
        greeting=greeting,
        date_label=today_str,
        today_tasks=today_tasks,
        recommendation=rec,
        recently_completed=completed_tasks,
    )
