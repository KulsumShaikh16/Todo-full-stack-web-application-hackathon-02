from routes.auth import hash_password, create_access_token
from db import settings

try:
    print("Testing Password Hashing...")
    hashed = hash_password("testpassword")
    print(f"Hash success: {hashed[:10]}...")
except Exception as e:
    print(f"Hashing failed: {e}")

try:
    print("Testing JWT Generation...")
    token, exp = create_access_token("test_user_id", "test@example.com")
    print(f"JWT success: {token[:10]}...")
except Exception as e:
    print(f"JWT failed: {e}")
