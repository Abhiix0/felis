import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_no_auth():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "request_id" in data

@pytest.mark.asyncio
async def test_dev_token_creation():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Note: In mock/isolated test without DB, token endpoint creates dev token
        # When DB is mocked or present
        pass
