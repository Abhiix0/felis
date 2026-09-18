import pytest
import uuid
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_mutation_idempotency(client: AsyncClient, auth_headers: dict):
    mutation_id = str(uuid.uuid4())
    headers_with_mutation = {**auth_headers, "X-Client-Mutation-ID": mutation_id}

    # 1. Create task with client mutation id
    resp1 = await client.post(
        "/tasks",
        headers=headers_with_mutation,
        json={"title": "Idempotent Task", "priority": "high"},
    )
    assert resp1.status_code == 201
    task1 = resp1.json()

    # 2. Resend same request with same mutation id (simulating retry after offline/network drop)
    resp2 = await client.post(
        "/tasks",
        headers=headers_with_mutation,
        json={"title": "Idempotent Task", "priority": "high"},
    )
    assert resp2.status_code == 201 or resp2.status_code == 200
    task2 = resp2.json()

    # Must return identical task ID without creating a duplicate
    assert task1["id"] == task2["id"]

    # Verify task count
    all_tasks_resp = await client.get("/tasks", headers=auth_headers)
    tasks = all_tasks_resp.json()
    matching = [t for t in tasks if t["id"] == task1["id"]]
    assert len(matching) == 1
