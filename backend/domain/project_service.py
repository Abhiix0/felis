from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class ProjectStats(BaseModel):
    totalTasks: int = 0
    activeTasks: int = 0
    completedTasks: int = 0
    progressPercent: int = 0

class ProjectCreate(BaseModel):
    id: Optional[UUID] = None
    name: str = Field(min_length=1, max_length=100)
    goal: Optional[str] = None
    description: Optional[str] = None
    tech_stack: List[str] = Field(default_factory=list)
    icon_type: str = "terminal"

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    goal: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    icon_type: Optional[str] = None
    status: Optional[str] = None

class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    name: str
    goal: Optional[str]
    description: Optional[str]
    tech_stack: List[str]
    icon_type: str
    status: str
    created_at: datetime
    updated_at: datetime
    stats: Optional[ProjectStats] = None
