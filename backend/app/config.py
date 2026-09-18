from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str = "postgresql://felis:felis_dev@localhost:5432/felis"
    SECRET_KEY: str = "change-me-in-production"
    AUTH_PROVIDER: str = "dev_jwt"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "tauri://localhost"]
    DEBUG: bool = False

settings = Settings()
