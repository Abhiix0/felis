from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db
from db.repositories.task import TaskRepository
from db.repositories.project import ProjectRepository
from db.models import Recommendation as RecommendationModel, RecommendationOutcome as RecommendationOutcomeModel
from auth.dependencies import get_current_user
from auth.adapter import AuthenticatedUser
from domain.recommendation_engine import compute_next_action

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

class OutcomeCreate(BaseModel):
    event: str
    corrected_task_id: Optional[UUID] = None
    recorded_at: Optional[datetime] = None

class RecommendationSignal(BaseModel):
    type: str
    value: int
    reason: str

class RecommendationResponse(BaseModel):
    id: Optional[str] = None
    task_id: str
    title: str
    project_id: Optional[str] = None
    project_name: Optional[str] = None
    score: int
    signals: List[RecommendationSignal]
    estimated_minutes: int
    priority: str
    due_date: Optional[str] = None

@router.get("/next-action", response_model=Optional[RecommendationResponse])
async def get_next_action(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    task_repo = TaskRepository(db)
    project_repo = ProjectRepository(db)

    tasks = await task_repo.get_by_user(current_user.id)
    projects = await project_repo.get_by_user(current_user.id)

    rec_data = compute_next_action(tasks, projects)
    if not rec_data:
        return None

    # Persist recommendation snapshot
    now = datetime.now(timezone.utc)
    rec_record = RecommendationModel(
        user_id=current_user.id,
        task_id=UUID(rec_data["task_id"]),
        score=float(rec_data["score"]),
        signals=rec_data["signals"],
        state_snapshot_version=now.isoformat(),
    )
    db.add(rec_record)
    await db.commit()
    await db.refresh(rec_record)

    rec_data["id"] = str(rec_record.id)
    return RecommendationResponse(**rec_data)

@router.post("/{id}/outcome", status_code=status.HTTP_200_OK)
async def record_outcome(
    id: UUID,
    data: OutcomeCreate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    outcome = RecommendationOutcomeModel(
        recommendation_id=id,
        user_id=current_user.id,
        event=data.event,
        corrected_task_id=data.corrected_task_id,
        recorded_at=data.recorded_at or datetime.now(timezone.utc),
    )
    db.add(outcome)
    await db.commit()
    return {"status": "ok"}
