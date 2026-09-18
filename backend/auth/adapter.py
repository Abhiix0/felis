from abc import ABC, abstractmethod
from typing import Optional
from uuid import UUID
from pydantic import BaseModel

class AuthenticatedUser(BaseModel):
    id: UUID
    email: str
    display_name: str

class AuthAdapter(ABC):
    @abstractmethod
    async def verify_token(self, token: str) -> Optional[AuthenticatedUser]:
        """Verify a Bearer token and return the authenticated user, or None."""
        pass

    @abstractmethod
    async def create_dev_token(self, email: str, display_name: str) -> str:
        """Development only: create a signed token for an email."""
        pass
