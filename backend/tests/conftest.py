import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from httpx import AsyncClient, ASGITransport

from app.main import app
from db.session import Base, get_db
from db.models import User, Profile
from auth.dev_jwt import DevJWTAdapter

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest_asyncio.fixture
async def test_db():
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with async_session() as session:
        yield session
        
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()

@pytest_asyncio.fixture
async def client(test_db):
    async def override_get_db():
        yield test_db

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()

@pytest_asyncio.fixture
async def test_user(test_db):
    user = User(email="engineer_b@felis.app", display_name="Engineer B")
    test_db.add(user)
    await test_db.flush()
    profile = Profile(user_id=user.id, timezone="UTC", preferred_focus_minutes=25)
    test_db.add(profile)
    await test_db.commit()
    await test_db.refresh(user)
    return user

@pytest_asyncio.fixture
async def auth_headers(test_user):
    adapter = DevJWTAdapter()
    token = await adapter.create_dev_token(test_user.email, test_user.display_name, test_user.id)
    return {"Authorization": f"Bearer {token}"}
