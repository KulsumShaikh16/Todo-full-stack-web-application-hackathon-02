import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables if available
load_dotenv()

# Define the API URL - adjust for your deployment
BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:8000")  # Default from settings

def test_signin():
    """Test the signin endpoint."""
    url = f"{BASE_URL}/api/auth/signin"
    headers = {"Content-Type": "application/json"}
    
    # Test with test user credentials
    data = {
        "email": "test@example.com",
        "password": "password"  # Default password for test user
    }
    
    print(f"Attempting sign-in with {data['email']}")
    print(f"Target URL: {url}")
    
    try:
        response = requests.post(url, json=data, headers=headers)
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Text: {response.text}")
        
        if response.status_code == 200:
            print("SUCCESS: Sign-in worked!")
            response_json = response.json()
            print(f"User ID: {response_json.get('user', {}).get('id', 'N/A')}")
            print(f"Token length: {len(response_json.get('token', ''))}")
        elif response.status_code == 401:
            print("FAILED: Invalid credentials")
        elif response.status_code == 500:
            print("ERROR: Internal server error - check server logs!")
        else:
            print(f"Unexpected status code: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print(f"ERROR: Could not connect to {url}")
        print("Make sure your server is running!")
    except Exception as e:
        print(f"Request failed with error: {e}")

def test_health_check():
    """Test the health check endpoint."""
    url = f"{BASE_URL}/health"
    
    print(f"\nTesting health check at: {url}")
    
    try:
        response = requests.get(url)
        print(f"Health check Status: {response.status_code}")
        print(f"Health check Response: {response.text}")
    except Exception as e:
        print(f"Health check failed: {e}")

def test_env_vars():
    """Test environment variables."""
    print("\nChecking environment variables:")
    print(f"DATABASE_URL set: {'DATABASE_URL' in os.environ}")
    print(f"BETTER_AUTH_SECRET set: {'BETTER_AUTH_SECRET' in os.environ}")
    print(f"DATABASE_URL: {os.getenv('DATABASE_URL', 'Not set')[:50]}...")
    print(f"BETTER_AUTH_SECRET: {'Set' if os.getenv('BETTER_AUTH_SECRET') else 'Not set'}")

if __name__ == "__main__":
    print("Debugging Sign-in Issues\n")
    test_env_vars()
    test_health_check()
    test_signin()