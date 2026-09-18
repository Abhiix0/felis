from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Header, status
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.session import get_db
from db.models import FocusSession as FocusSessionModel, SyncMutation as SyncMutationModel
from auth.dependencies import get_current_user
from auth.adapter import AuthenticatedUser
from app.errors import NotFoundError

router = APIRouter(prefix="/focus-sessions", tags=["focus-sessions"])

class FocusSessionStart(BaseModel):
    taskId: UUID
    plannedMinutes: int = 25

class FocusSessionEnd(BaseModel):
    endedAt: Optional[datetime] = None
    actualMinutes: Optional[int] = None
    status: str = "finished"

class FocusSessionResponse(BaseModel):
    id: UUID
    user_id: UUID
    task_id: UUID
    planned_minutes: int
    started_at: datetime
    ended_at: Optional[datetime] = None
    actual_minutes: Optional[int] = None
    status: str
    paused_total_seconds: int

    class Config:
        from_attributes = True

@router.post("", response_model=FocusSessionResponse, status_code=status.HTTP_201_CREATED)
async def start_focus_session(
    data: FocusSessionStart,
    x_client_mutation_id: Optional[str] = Header(None, alias="X-Client-Mutation-ID"),
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Idempotency check
    if x_client_mutation_id:
        try:
            m_uuid = UUID(x_client_mutation_id)
            stmt = select(SyncMutationModel).where(SyncMutationModel.id == m_uuid)
            res = await db.execute(stmt)
            existing_mutation = res.scalar_one_or_none()
            if existing_mutation and existing_mutation.payload:
                session_id = existing_mutation.payload.get("session_id")
                if session_id:
                    session_res = await db.execute(select(FocusSessionModel).where(FocusSessionModel.id == UUID(session_id)))
                    existing_session = session_res.scalar_one_or_none()
                    if existing_session:
                        return FocusSessionResponse.model_validate(existing_session)
        except ValueError:
            pass

    session = FocusSessionModel(
        user_id=current_user.id,
        task_id=data.taskId,
        planned_minutes=data.plannedMinutes,
        status="running",
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)

    if x_client_mutation_id:
        try:
            mutation = SyncMutationModel(
                id=UUID(x_client_mutation_id),
                user_id=current_user.id,
                type="START_FOCUS",
                payload={"session_id": str(session.id)},
                status="completed",
            )
            db.add(mutation)
            await db.commit()
        except Exception:
            pass

    return FocusSessionResponse.model_validate(session)

@router.patch("/{id}", response_model=FocusSessionResponse)
async def end_focus_session(
    id: UUID,
    data: FocusSessionEnd,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(FocusSessionModel).where(
        FocusSessionModel.id == id, FocusSessionModel.user_id == current_user.id
    )
    res = await db.execute(stmt)
    session = res.scalar_one_or_none()
    if not session:
        raise NotFoundError("FocusSession")

    ended_at = data.endedAt or datetime.now(timezone.utc)
    session.ended_at = ended_at
    session.status = data.status

    if data.actualMinutes is not None:
        session.actual_minutes = data.actualMinutes
    elif session.started_at:
        elapsed = (ended_at - session.started_at.replace(tzinfo=timezone.utc if session.started_at.tzinfo is None else session.started_at.tzinfo)).total_seconds()
        active_seconds = max(0, elapsed - session.paused_total_seconds)
        session.actual_minutes = max(1, round(active_seconds / 60))

    await db.commit()
    await db.refresh(session)
    return FocusSessionResponse.model_validate(session)
