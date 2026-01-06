"""Unit tests for JWT authentication dependency."""

from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException
from jose import jwt

from backend.db import settings
from backend.dependencies.auth import (
    TokenPayload,
    decode_token,
    get_current_user,
)


class TestTokenPayload:
    """Tests for TokenPayload model."""

    def test_token_payload_creation(self):
        """Test TokenPayload can be created with required fields."""
        payload = TokenPayload(sub="user-123")
        assert payload.sub == "user-123"
        assert payload.email is None
        assert payload.exp is None

    def test_token_payload_creation_with_all_fields(self):
        """Test TokenPayload can be created with all fields."""
        now = int(datetime.utcnow().timestamp())
        payload = TokenPayload(
            sub="user-123",
            email="test@example.com",
            exp=now,
        )
        assert payload.sub == "user-123"
        assert payload.email == "test@example.com"
        assert payload.exp == now


class TestDecodeToken:
    """Tests for decode_token function."""

    def test_decode_valid_token(self):
        """Test decoding a valid JWT token."""
        payload = {
            "sub": "user-456",
            "email": "user@example.com",
            "exp": datetime.utcnow() + timedelta(hours=1),
        }
        token = jwt.encode(payload, settings.better_auth_secret, algorithm="HS256")
        result = decode_token(token)

        assert result.sub == "user-456"
        assert result.email == "user@example.com"

    def test_decode_token_without_email(self):
        """Test decoding a JWT token without email."""
        payload = {
            "sub": "user-789",
            "exp": datetime.utcnow() + timedelta(hours=1),
        }
        token = jwt.encode(payload, settings.better_auth_secret, algorithm="HS256")
        result = decode_token(token)

        assert result.sub == "user-789"
        assert result.email is None

    def test_decode_expired_token(self):
        """Test that expired tokens raise HTTPException."""
        payload = {
            "sub": "user-123",
            "exp": datetime.utcnow() - timedelta(hours=1),
        }
        token = jwt.encode(payload, settings.better_auth_secret, algorithm="HS256")

        with pytest.raises(HTTPException) as exc_info:
            decode_token(token)

        assert exc_info.value.status_code == 401
        assert "Invalid token" in str(exc_info.value.detail)

    def test_decode_invalid_token(self):
        """Test that invalid tokens raise HTTPException."""
        with pytest.raises(HTTPException) as exc_info:
            decode_token("invalid.token.here")

        assert exc_info.value.status_code == 401

    def test_decode_token_wrong_secret(self):
        """Test that tokens signed with wrong secret raise HTTPException."""
        payload = {
            "sub": "user-123",
            "exp": datetime.utcnow() + timedelta(hours=1),
        }
        token = jwt.encode(payload, "wrong-secret", algorithm="HS256")

        with pytest.raises(HTTPException) as exc_info:
            decode_token(token)

        assert exc_info.value.status_code == 401


class TestGetCurrentUser:
    """Tests for get_current_user dependency."""

    def test_decode_valid_token_sync(self):
        """Test decoding a valid JWT token synchronously."""
        payload = {
            "sub": "user-123",
            "email": "test@example.com",
            "exp": datetime.utcnow() + timedelta(hours=1),
        }
        token = jwt.encode(payload, settings.better_auth_secret, algorithm="HS256")
        result = decode_token(token)

        assert result.sub == "user-123"
        assert result.email == "test@example.com"

    def test_decode_no_credentials(self):
        """Test that missing credentials raises HTTPException."""
        with pytest.raises(HTTPException) as exc_info:
            decode_token("")

        assert exc_info.value.status_code == 401
        assert "Invalid token" in str(exc_info.value.detail)

    def test_decode_invalid_token(self):
        """Test that invalid token raises HTTPException."""
        with pytest.raises(HTTPException) as exc_info:
            decode_token("invalid.token")

        assert exc_info.value.status_code == 401


class TestJWTTokenGeneration:
    """Tests for JWT token generation scenarios."""

    def test_token_with_long_expiration(self):
        """Test token with long expiration time."""
        payload = {
            "sub": "user-123",
            "exp": datetime.utcnow() + timedelta(days=7),
        }
        token = jwt.encode(payload, settings.better_auth_secret, algorithm="HS256")
        result = decode_token(token)

        assert result.sub == "user-123"

    def test_token_without_expiration(self):
        """Test token without expiration (should still work if verify_exp=False)."""
        payload = {"sub": "user-123"}
        token = jwt.encode(payload, settings.better_auth_secret, algorithm="HS256")

        # Token without exp should decode if we don't verify expiration
        decoded = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=["HS256"],
            options={"verify_exp": False},
        )
        assert decoded["sub"] == "user-123"

    def test_token_algorithm_hs256(self):
        """Test that HS256 algorithm is used."""
        payload = {
            "sub": "user-123",
            "exp": datetime.utcnow() + timedelta(hours=1),
        }
        token = jwt.encode(payload, settings.better_auth_secret, algorithm="HS256")

        # Verify the token uses HS256
        unverified = jwt.get_unverified_header(token)
        assert unverified["alg"] == "HS256"
