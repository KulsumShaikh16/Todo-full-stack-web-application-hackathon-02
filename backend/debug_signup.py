import requests
import json

url = "http://127.0.0.1:8000/api/auth/signup"
headers = {"Content-Type": "application/json"}
data = {
    "email": "signup_test_999@example.com",
    "password": "password123",
    "name": "Signup Test"
}

try:
    response = requests.post(url, json=data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Text: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
