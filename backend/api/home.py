import zoneinfo
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.session import get_db
from db.models import Profile as ProfileModel
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

    # Get user profile timezone if set
    stmt = select(ProfileModel).where(ProfileModel.user_id == current_user.id)
    res = await db.execute(stmt)
    profile = res.scalar_one_or_none()

    tz = timezone.utc
    if profile and profile.timezone:
        try:
            tz = zoneinfo.ZoneInfo(profile.timezone)
        except Exception:
            tz = timezone.utc

    user_now = datetime.now(tz)
    hour = user_now.hour
    if hour < 12:
        greeting = f"Good morning, {current_user.display_name}"
    elif hour < 17:
        greeting = f"Good afternoon, {current_user.display_name}"
    else:
        greeting = f"Good evening, {current_user.display_name}"

    today_str = user_now.strftime("%A, %d %B")
    today_iso = user_now.strftime("%Y-%m-%d")

    def is_today_or_overdue(t) -> bool:
        if not t.due_date:
            return True
        if t.due_date <= today_iso:
            return True
        lower = t.due_date.lower()
        return "today" in lower or "overdue" in lower

    today_tasks = [TaskResponse.model_validate(t) for t in tasks if t.status != "completed" and is_today_or_overdue(t)]
    completed_tasks = [TaskResponse.model_validate(t) for t in tasks if t.status == "completed"][:5]

    rec = compute_next_action(tasks, projects, user_now)

    return HomeResponse(
        greeting=greeting,
        date_label=today_str,
        today_tasks=today_tasks,
        recommendation=rec,
        recently_completed=completed_tasks,
    )
