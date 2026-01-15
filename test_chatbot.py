#!/usr/bin/env python3
"""
Test script to check if the chatbot functionality is working properly.
This script will test the connection to your deployed backend.
"""

import requests
import json
import os

def test_backend_health(backend_url):
    """Test the health endpoint of the backend"""
    try:
        response = requests.get(f"{backend_url}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend health check successful: {data}")
            return True
        else:
            print(f"❌ Backend health check failed: Status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error connecting to backend: {e}")
        return False

def test_chat_functionality(backend_url, auth_token):
    """Test the chat functionality with a simple message"""
    try:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {auth_token}"
        }
        
        payload = {
            "message": "Hello, can you help me create a test task?",
            "conversation_id": None
        }
        
        response = requests.post(f"{backend_url}/api/chat", 
                                headers=headers, 
                                data=json.dumps(payload))
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Chat API test successful!")
            print(f"Response: {data['response']}")
            if data['tool_calls']:
                print(f"Tool calls made: {len(data['tool_calls'])}")
            return True
        else:
            print(f"❌ Chat API test failed: Status {response.status_code}")
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error testing chat functionality: {e}")
        return False

def main():
    # Get backend URL and token from environment variables or user input
    backend_url = os.getenv('BACKEND_URL', input("Enter your backend URL (e.g., https://your-app.onrender.com): "))
    
    # Remove trailing slash if present
    backend_url = backend_url.rstrip('/')
    
    print(f"Testing backend at: {backend_url}")
    
    # You'll need a valid auth token to test the chat functionality
    auth_token = os.getenv('AUTH_TOKEN', input("Enter your auth token (get this from browser's localStorage under 'auth_token'): "))
    
    print("\n🔍 Testing backend health...")
    if test_backend_health(backend_url):
        print("\n💬 Testing chat functionality...")
        test_chat_functionality(backend_url, auth_token)
    else:
        print("\n❌ Cannot test chat functionality without healthy backend connection.")

if __name__ == "__main__":
    main()