import requests
import json
import uuid

BASE_URL = "http://127.0.0.1:8000"

def run_debug():
    # 1. Signup/Login to get token
    email = f"test_{str(uuid.uuid4())[:8]}@example.com"
    password = "password123"
    
    print(f"Creating user: {email}")
    
    signup_url = f"{BASE_URL}/api/auth/signup"
    signup_data = {
        "email": email,
        "password": password,
        "name": "Test User"
    }
    
    try:
        # Signup
        resp = requests.post(signup_url, json=signup_data)
        if resp.status_code != 201:
            # Maybe already exists, try login
            print(f"Signup status: {resp.status_code}. Trying login...")
            login_url = f"{BASE_URL}/api/auth/token"
            resp = requests.post(login_url, data={"username": email, "password": password})
            
        if resp.status_code not in [200, 201]:
            print(f"❌ Auth failed: {resp.text}")
            return

        auth_data = resp.json()
        token = auth_data.get("token")
        if not token:
            print("❌ No access token found in response")
            print(auth_data)
            return
            
        print("✅ Authenticated. Token obtained.")
        
        # 2. Create Task
        tasks_url = f"{BASE_URL}/api/tasks"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        task_data = {
            "title": "Debug Task",
            "description": "Created via debug script"
        }
        
        print("\nAttempting to create task...")
        resp = requests.post(tasks_url, json=task_data, headers=headers)
        
        print(f"Status Code: {resp.status_code}")
        print(f"Response: {resp.text}")
        
        if resp.status_code == 201:
            print("✅ Task created successfully")
        else:
            print("❌ Task creation failed")
            
    except Exception as e:
        print(f"❌ Exception occurred: {e}")

if __name__ == "__main__":
    run_debug()
