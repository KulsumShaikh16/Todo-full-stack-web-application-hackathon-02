"""JWT authentication dependency for verifying Better Auth tokens."""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel, field_validator
from sqlmodel import Session
from db import get_db


# JWT token payload schema
class TokenPayload(BaseModel):
    """Decoded JWT token payload."""
    sub: str  # user_id
    email: Optional[str] = None
    exp: Optional[int] = None

    @field_validator('exp')
    @classmethod
    def validate_exp(cls, v):
        if v is not None:
            return int(v)
        return v


# Security scheme
security = HTTPBearer()


def decode_token(token: str) -> TokenPayload:
    """Decode and verify a JWT token.

    Args:
        token: The JWT token string

    Returns:
        Decoded token payload

    Raises:
        HTTPException: If token is invalid or expired
    """
    from db import settings

    try:
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=["HS256"],
            options={"verify_exp": True}
        )
        return TokenPayload(**payload)
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> TokenPayload:
    """Dependency to get the current authenticated user from JWT token.

    This verifies the JWT from the Authorization header and returns
    the decoded user information.

    Args:
        credentials: HTTP Bearer credentials from request header

    Returns:
        TokenPayload with user_id and email

    Raises:
        HTTPException: 401 if no valid token provided
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    return decode_token(token)


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        HTTPBearer(auto_error=False)
    ),
) -> Optional[TokenPayload]:
    """Dependency to optionally get the current user.

    Returns None if no valid token is provided, instead of raising an error.
    Useful for endpoints that work with or without authentication.
    """
    if not credentials:
        return None

    try:
        return decode_token(credentials.credentials)
    except HTTPException:
        return None
