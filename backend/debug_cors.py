import requests

def test_cors():
    url = "http://127.0.0.1:8000/api/tasks"
    origin = "http://localhost:3000"
    
    print(f"Testing CORS for URL: {url} with Origin: {origin}")
    
    # Test OPTIONS (Preflight)
    print("\n--- Testing OPTIONS Preflight ---")
    headers = {
        "Origin": origin,
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "authorization",
    }
    try:
        response = requests.options(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print("Headers:")
        for k, v in response.headers.items():
            if 'access-control' in k.lower():
                print(f"  {k}: {v}")
                
        if response.headers.get('access-control-allow-origin') == origin:
            print("✅ Preflight Allow-Origin correct")
        else:
            print("❌ Preflight Allow-Origin MISSING or incorrect")
            
    except Exception as e:
        print(f"❌ OPTIONS request failed: {e}")

    # Test GET (Actual request simulation)
    print("\n--- Testing GET request ---")
    headers = {
        "Origin": origin,
        "Authorization": "Bearer invalid_token_for_test"
    }
    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print("Headers:")
        for k, v in response.headers.items():
            if 'access-control' in k.lower():
                print(f"  {k}: {v}")
                
        if response.headers.get('access-control-allow-origin') == origin:
            print("✅ GET Allow-Origin correct")
        else:
            print("❌ GET Allow-Origin MISSING or incorrect")

    except Exception as e:
        print(f"❌ GET request failed: {e}")

if __name__ == "__main__":
    test_cors()
