import pytest
import uuid
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_task_crud_and_complete(client: AsyncClient, auth_headers: dict):
    # 1. Create task with client UUID
    client_task_id = str(uuid.uuid4())
    create_resp = await client.post(
        "/tasks",
        headers=auth_headers,
        json={
            "id": client_task_id,
            "title": "Implement auth middleware",
            "priority": "high",
            "estimate_minutes": 45,
            "due_date": "2026-10-01",
        },
    )
    assert create_resp.status_code == 201
    task_data = create_resp.json()
    assert task_data["id"] == client_task_id
    assert task_data["title"] == "Implement auth middleware"
    assert task_data["priority"] == "high"
    assert task_data["status"] == "pending"

    # 2. List tasks
    list_resp = await client.get("/tasks", headers=auth_headers)
    assert list_resp.status_code == 200
    tasks = list_resp.json()
    assert len(tasks) >= 1
    assert any(t["id"] == client_task_id for t in tasks)

    # 3. Get single task
    get_resp = await client.get(f"/tasks/{client_task_id}", headers=auth_headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == client_task_id

    # 4. Update task
    patch_resp = await client.patch(
        f"/tasks/{client_task_id}",
        headers=auth_headers,
        json={"title": "Implement auth middleware & tests", "priority": "urgent"},
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["title"] == "Implement auth middleware & tests"
    assert patch_resp.json()["priority"] == "urgent"

    # 5. Complete task
    complete_resp = await client.post(f"/tasks/{client_task_id}/complete", headers=auth_headers)
    assert complete_resp.status_code == 200
    completed_data = complete_resp.json()
    assert completed_data["status"] == "completed"
    assert completed_data["completed_at"] is not None

    # 6. Delete task
    del_resp = await client.delete(f"/tasks/{client_task_id}", headers=auth_headers)
    assert del_resp.status_code == 204
    get_del = await client.get(f"/tasks/{client_task_id}", headers=auth_headers)
    assert get_del.status_code == 404
