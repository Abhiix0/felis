import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_home_feed(client: AsyncClient, auth_headers: dict):
    # 1. Create active task
    await client.post(
        "/tasks",
        headers=auth_headers,
        json={"title": "Morning task", "priority": "high", "estimate_minutes": 30},
    )

    # 2. Query home feed
    resp = await client.get("/home", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "greeting" in data
    assert "date_label" in data
    assert "today_tasks" in data
    assert len(data["today_tasks"]) >= 1
    assert data["recommendation"] is not None
    assert data["recommendation"]["title"] == "Morning task"
