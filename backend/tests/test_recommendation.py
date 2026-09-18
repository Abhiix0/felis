import pytest
from datetime import datetime, timezone, timedelta
from db.models import Task, Project
from domain.recommendation_engine import compute_next_action

def test_empty_tasks_returns_none():
    assert compute_next_action([], []) is None

def test_high_priority_beats_low():
    now = datetime.now(timezone.utc)
    t1 = Task(id=None, title="Low prio", priority="low", status="pending", created_at=now)
    t2 = Task(id=None, title="High prio", priority="high", status="pending", created_at=now)
    rec = compute_next_action([t1, t2], [], now=now)
    assert rec is not None
    assert rec["title"] == "High prio"

def test_overdue_gets_high_urgency():
    now = datetime.now(timezone.utc)
    yesterday = (now - timedelta(days=1)).strftime("%Y-%m-%d")
    next_week = (now + timedelta(days=7)).strftime("%Y-%m-%d")

    t1 = Task(id=None, title="Due later", priority="medium", status="pending", due_date=next_week, created_at=now)
    t2 = Task(id=None, title="Overdue task", priority="medium", status="pending", due_date=yesterday, created_at=now)

    rec = compute_next_action([t1, t2], [], now=now)
    assert rec is not None
    assert rec["title"] == "Overdue task"
