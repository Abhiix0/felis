import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "request_id" in data

@pytest.mark.asyncio
async def test_auth_token_and_me(client: AsyncClient):
    # Obtain dev token
    response = await client.post("/auth/token", json={"email": "alice@felis.app", "display_name": "Alice"})
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Query /me
    me_resp = await client.get("/me", headers=headers)
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["email"] == "alice@felis.app"
    assert me_data["display_name"] == "Alice"
    assert me_data["profile"]["timezone"] == "UTC"

    # Patch /me profile
    patch_resp = await client.patch(
        "/me",
        headers=headers,
        json={"timezone": "Asia/Kolkata", "preferred_focus_minutes": 30}
    )
    assert patch_resp.status_code == 200
    patched_data = patch_resp.json()
    assert patched_data["profile"]["timezone"] == "Asia/Kolkata"
    assert patched_data["profile"]["preferred_focus_minutes"] == 30

@pytest.mark.asyncio
async def test_unauthorized_access(client: AsyncClient):
    response = await client.get("/me")
    assert response.status_code == 401
    err = response.json()
    assert "error" in err
    assert err["error"]["code"] == "UNAUTHORIZED"
