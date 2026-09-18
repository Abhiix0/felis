import pytest
import uuid
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_project_crud(client: AsyncClient, auth_headers: dict):
    # 1. Create project
    client_proj_id = str(uuid.uuid4())
    create_resp = await client.post(
        "/projects",
        headers=auth_headers,
        json={
            "id": client_proj_id,
            "name": "FELIS Core",
            "goal": "Build the best dev assistant",
            "tech_stack": ["React", "FastAPI", "PostgreSQL"],
            "icon_type": "cat",
        },
    )
    assert create_resp.status_code == 201
    proj_data = create_resp.json()
    assert proj_data["id"] == client_proj_id
    assert proj_data["name"] == "FELIS Core"
    assert proj_data["tech_stack"] == ["React", "FastAPI", "PostgreSQL"]

    # 2. List projects
    list_resp = await client.get("/projects", headers=auth_headers)
    assert list_resp.status_code == 200
    projects = list_resp.json()
    assert len(projects) >= 1
    assert any(p["id"] == client_proj_id for p in projects)

    # 3. Get project by ID
    get_resp = await client.get(f"/projects/{client_proj_id}", headers=auth_headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["name"] == "FELIS Core"

    # 4. Update project
    update_resp = await client.patch(
        f"/projects/{client_proj_id}",
        headers=auth_headers,
        json={"name": "FELIS Core v2"},
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["name"] == "FELIS Core v2"

    # 5. Delete project
    del_resp = await client.delete(f"/projects/{client_proj_id}", headers=auth_headers)
    assert del_resp.status_code == 204

    # 6. Verify deleted
    get_after_del = await client.get(f"/projects/{client_proj_id}", headers=auth_headers)
    assert get_after_del.status_code == 404
