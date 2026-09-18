import pytest
import uuid
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_focus_session_lifecycle(client: AsyncClient, auth_headers: dict):
    # 1. Create a task first
    task_resp = await client.post(
        "/tasks",
        headers=auth_headers,
        json={"title": "Focus test task", "priority": "high"},
    )
    assert task_resp.status_code == 201
    task_id = task_resp.json()["id"]

    # 2. Start focus session
    start_resp = await client.post(
        "/focus-sessions",
        headers=auth_headers,
        json={"taskId": task_id, "plannedMinutes": 25},
    )
    assert start_resp.status_code == 201
    session_data = start_resp.json()
    session_id = session_data["id"]
    assert session_data["status"] == "running"
    assert session_data["planned_minutes"] == 25
    assert session_data["task_id"] == task_id

    # 3. End focus session
    end_resp = await client.patch(
        f"/focus-sessions/{session_id}",
        headers=auth_headers,
        json={"actualMinutes": 20, "status": "completed"},
    )
    assert end_resp.status_code == 200
    ended_data = end_resp.json()
    assert ended_data["status"] == "completed"
    assert ended_data["actual_minutes"] == 20
    assert ended_data["ended_at"] is not None
