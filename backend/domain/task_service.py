from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SubtaskResponse(BaseModel):
    id: UUID
    task_id: UUID
    title: str
    completed: bool
    completed_at: Optional[datetime]
    position: int

    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    project_id: Optional[UUID] = None
    title: str = Field(min_length=1, max_length=500)
    description: Optional[str] = None
    priority: str = "medium"
    due_date: Optional[str] = None
    due_time: Optional[str] = None
    estimate_minutes: Optional[int] = None

class TaskUpdate(BaseModel):
    project_id: Optional[UUID] = None
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[str] = None
    due_time: Optional[str] = None
    estimate_minutes: Optional[int] = None
    completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: UUID
    user_id: UUID
    project_id: Optional[UUID]
    title: str
    description: Optional[str]
    priority: str
    status: str
    due_date: Optional[str]
    due_time: Optional[str]
    estimate_minutes: Optional[int]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]
    subtasks: List[SubtaskResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True
