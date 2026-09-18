import pytest
import uuid
from datetime import datetime, timezone, timedelta
from httpx import AsyncClient
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

def test_score_never_exceeds_100():
    now = datetime.now(timezone.utc)
    yesterday = (now - timedelta(days=1)).strftime("%Y-%m-%d")
    recent_created = now - timedelta(minutes=15)

    task = Task(
        id=None,
        title="Max score test",
        priority="urgent",
        status="pending",
        due_date=yesterday,
        estimate_minutes=25,
        created_at=recent_created,
        updated_at=recent_created,
    )
    rec = compute_next_action([task], [], now=now)
    assert rec is not None
    assert rec["score"] <= 100

@pytest.mark.asyncio
async def test_recommendation_api_flow(client: AsyncClient, auth_headers: dict):
    # Create task
    task_resp = await client.post(
        "/tasks",
        headers=auth_headers,
        json={"title": "Next action task", "priority": "high", "estimate_minutes": 25},
    )
    assert task_resp.status_code == 201

    # Get next action
    rec_resp = await client.get("/recommendations/next-action", headers=auth_headers)
    assert rec_resp.status_code == 200
    rec_data = rec_resp.json()
    assert rec_data is not None
    assert "id" in rec_data
    rec_id = rec_data["id"]

    # Record valid outcome event
    outcome_resp = await client.post(
        f"/recommendations/{rec_id}/outcome",
        headers=auth_headers,
        json={"event": "accepted"},
    )
    assert outcome_resp.status_code == 200

    # Record invalid outcome event fails with 422
    invalid_resp = await client.post(
        f"/recommendations/{rec_id}/outcome",
        headers=auth_headers,
        json={"event": "invalid_event_type"},
    )
    assert invalid_resp.status_code == 422

    # Unowned recommendation returns 404
    fake_rec_id = str(uuid.uuid4())
    unowned_resp = await client.post(
        f"/recommendations/{fake_rec_id}/outcome",
        headers=auth_headers,
        json={"event": "completed"},
    )
    assert unowned_resp.status_code == 404

