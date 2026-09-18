import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, JSON, Float, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.session import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    display_name = Column(String(100), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = 'profiles'

    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    timezone = Column(String(50), default='UTC', nullable=False)
    preferred_focus_minutes = Column(Integer, default=25, nullable=False)
    work_start_hour = Column(Integer, default=9, nullable=False)
    work_end_hour = Column(Integer, default=18, nullable=False)

    user = relationship("User", back_populates="profile")

class Project(Base):
    __tablename__ = 'projects'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    goal = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    tech_stack = Column(JSON, nullable=False, default=list)
    icon_type = Column(String(20), nullable=False, default='terminal')
    status = Column(String(20), nullable=False, default='active', index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="projects")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey('projects.id', ondelete='SET NULL'), nullable=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String(20), nullable=False, default='medium', index=True)
    status = Column(String(20), nullable=False, default='pending', index=True)
    due_date = Column(String(20), nullable=True, index=True) # YYYY-MM-DD
    due_time = Column(String(10), nullable=True) # HH:MM
    estimate_minutes = Column(Integer, nullable=True)
    recurrence_id = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="tasks")
    project = relationship("Project", back_populates="tasks")
    subtasks = relationship("Subtask", back_populates="task", cascade="all, delete-orphan", order_by="Subtask.position")

class Subtask(Base):
    __tablename__ = 'subtasks'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id = Column(UUID(as_uuid=True), ForeignKey('tasks.id', ondelete='CASCADE'), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    position = Column(Integer, default=0, nullable=False)

    task = relationship("Task", back_populates="subtasks")

class FocusSession(Base):
    __tablename__ = 'focus_sessions'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    task_id = Column(UUID(as_uuid=True), ForeignKey('tasks.id', ondelete='CASCADE'), nullable=False, index=True)
    planned_minutes = Column(Integer, nullable=False, default=25)
    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    actual_minutes = Column(Integer, nullable=True)
    status = Column(String(20), nullable=False, default='running')
    paused_total_seconds = Column(Integer, default=0, nullable=False)

class Recommendation(Base):
    __tablename__ = 'recommendations'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    task_id = Column(UUID(as_uuid=True), ForeignKey('tasks.id', ondelete='CASCADE'), nullable=False, index=True)
    score = Column(Float, nullable=False)
    signals = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    state_snapshot_version = Column(String(100), nullable=False)

class RecommendationOutcome(Base):
    __tablename__ = 'recommendation_outcomes'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recommendation_id = Column(UUID(as_uuid=True), ForeignKey('recommendations.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    event = Column(String(50), nullable=False)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    corrected_task_id = Column(UUID(as_uuid=True), nullable=True)

class ActivityEvent(Base):
    __tablename__ = 'activity_events'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    type = Column(String(50), nullable=False, index=True)
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    entity_type = Column(String(50), nullable=False)
    metadata_payload = Column(JSON, nullable=True)
    occurred_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class SyncMutation(Base):
    __tablename__ = 'sync_mutations'

    id = Column(UUID(as_uuid=True), primary_key=True) # client_mutation_id
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    type = Column(String(50), nullable=False)
    payload = Column(JSON, nullable=True)
    status = Column(String(20), nullable=False, default='completed')
    retry_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_attempt_at = Column(DateTime(timezone=True), nullable=True)
    error = Column(Text, nullable=True)
