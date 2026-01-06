"""Authentication API endpoints for signup/signin/logout with JWT."""

import uuid
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlmodel import Session, select

from db import get_db, settings
from dependencies.auth import get_current_user, TokenPayload
from models import (
    User,
    SignupRequest,
    SigninRequest,
    AuthResponse,
    UserResponse,
)

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password for storing."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a stored password against one provided by user."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: str, email: str) -> tuple[str, int]:
    """Create a JWT access token.

    Returns:
        Tuple of (token, expires_at_timestamp)
    """
    # Change token expiry to 24 hours (86400 seconds) as requested
    expires_delta = timedelta(hours=24)
    expire = datetime.utcnow() + expires_delta

    to_encode = {
        "sub": user_id,
        "email": email,
        "exp": int(expire.timestamp()),
    }

    encoded_jwt = jwt.encode(
        to_encode,
        settings.better_auth_secret,
        algorithm="HS256"
    )

    return encoded_jwt, int(expire.timestamp())


# Add the new token generation endpoint as requested
class TokenRequest(BaseModel):
    """Request model for token generation."""
    email: str


class TokenResponse(BaseModel):
    """Response model for token generation."""
    user_id: str
    email: str
    token: str
    expires_at: int


@router.post("/token", response_model=TokenResponse)
async def generate_token(
    token_request: TokenRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Generate a JWT token for a user based on email.

    Args:
        token_request: Contains email to identify the user
        db: Database session

    Returns:
        TokenResponse with user info and JWT token and expiry timestamp

    Raises:
        HTTPException: 404 if user not found
    """
    # Find user by email
    user = db.exec(
        select(User).where(User.email == token_request.email)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Generate JWT token
    token, expires_at = create_access_token(user.id, user.email)

    return TokenResponse(
        user_id=user.id,
        email=user.email,
        token=token,
        expires_at=expires_at,
    )


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    signup_data: SignupRequest,
    db: Session = Depends(get_db),
) -> AuthResponse:
    """Create a new user account.
    
    Args:
        signup_data: Email, password, and optional name
        db: Database session
        
    Returns:
        AuthResponse with user info and JWT token
        
    Raises:
        HTTPException: 409 if email already exists
    """
    # Check if user already exists
    existing_user = db.exec(
        select(User).where(User.email == signup_data.email)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(signup_data.password)
    
    new_user = User(
        id=user_id,
        email=signup_data.email,
        password_hash=hashed_password,
        name=signup_data.name,
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate JWT token
    token, expires_at = create_access_token(new_user.id, new_user.email)
    
    return AuthResponse(
        user=UserResponse(
            id=new_user.id,
            email=new_user.email,
            name=new_user.name,
        ),
        token=token,
        expires_at=expires_at,
    )


@router.post("/signin", response_model=AuthResponse)
async def signin(
    signin_data: SigninRequest,
    db: Session = Depends(get_db),
) -> AuthResponse:
    """Authenticate a user and return JWT token.
    
    Args:
        signin_data: Email and password
        db: Database session
        
    Returns:
        AuthResponse with user info and JWT token
        
    Raises:
        HTTPException: 401 if credentials are invalid
    """
    # Find user by email
    user = db.exec(
        select(User).where(User.email == signin_data.email)
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    # Verify password
    if not verify_password(signin_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    # Generate JWT token
    token, expires_at = create_access_token(user.id, user.email)
    
    return AuthResponse(
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
        ),
        token=token,
        expires_at=expires_at,
    )


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    current_user: TokenPayload = Depends(get_current_user),
) -> dict:
    """Logout user (client-side token removal).
    
    Args:
        current_user: Currently authenticated user
        
    Returns:
        Success message
    """
    # In a stateless JWT system, logout is handled client-side
    # by removing the token. This endpoint exists for consistency
    # and could be extended to add token blacklisting if needed.
    return {"message": "Logged out successfully"}
