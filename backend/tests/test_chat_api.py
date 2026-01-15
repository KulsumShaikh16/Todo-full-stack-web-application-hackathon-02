import requests
import json

BASE_URL = "http://localhost:8000"

def test_chat_flow():
    # 1. Sign in or use test account
    # For now, let's assume we can get a token or use the test seeding
    # Actually, seeding doesn't provide a known password hash easily unless we know it's "password"
    
    auth_data = {
        "email": "test@example.com",
        "password": "password"
    }
    
    print("Attempting to sign in...")
    response = requests.post(f"{BASE_URL}/api/auth/signin", json=auth_data)
    if response.status_code != 200:
        print(f"Signin failed: {response.text}")
        return
        
    token = response.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Send chat message
    print("Sending chat message: 'Add a task to buy coffee'...")
    chat_data = {"message": "Add a task to buy coffee"}
    response = requests.post(f"{BASE_URL}/api/chat", json=chat_data, headers=headers)
    
    if response.status_code != 200:
        print(f"Chat failed: {response.text}")
        return
        
    result = response.json()
    print(f"Response: {result['response']}")
    print(f"Tool Calls: {json.dumps(result['tool_calls'], indent=2)}")
    
    conv_id = result["conversation_id"]
    
    # 3. List conversations
    print("\nListing conversations...")
    response = requests.get(f"{BASE_URL}/api/chat/conversations", headers=headers)
    print(f"Found {response.json()['total']} conversations")
    
    # 4. Get conversation details
    print(f"\nGetting details for conversation {conv_id}...")
    response = requests.get(f"{BASE_URL}/api/chat/conversations/{conv_id}", headers=headers)
    details = response.json()
    print(f"Conversations has {len(details['messages'])} messages")
    for msg in details['messages']:
        print(f"  [{msg['role']}]: {msg['content'][:50]}...")

if __name__ == "__main__":
    test_chat_flow()
