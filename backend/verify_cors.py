import requests
import argparse
import sys

def verify_cors(url, origin):
    """
    Test if the target URL accepts the given origin for CORS preflight.
    """
    print(f"Testing CORS preflight...")
    print(f"  Target URL: {url}")
    print(f"  Simulated Origin: {origin}")
    
    headers = {
        "Origin": origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
    }
    
    try:
        # Use OPTIONS for preflight test
        response = requests.options(url, headers=headers)
        
        print(f"\nResponse Status: {response.status_code}")
        
        # Check CORS headers
        allow_origin = response.headers.get("Access-Control-Allow-Origin")
        allow_methods = response.headers.get("Access-Control-Allow-Methods")
        allow_headers = response.headers.get("Access-Control-Allow-Headers")
        
        print("\nCORS Headers in Response:")
        print(f"  Access-Control-Allow-Origin: {allow_origin}")
        print(f"  Access-Control-Allow-Methods: {allow_methods}")
        print(f"  Access-Control-Allow-Headers: {allow_headers}")
        
        if allow_origin == origin:
            print("\n✅ SUCCESS: Origin is correctly allowed!")
        elif allow_origin == "*":
            print("\n✅ SUCCESS: All origins allowed (wildcard)")
        else:
            print("\n❌ FAILED: Origin is NOT allowed.")
            if not allow_origin:
                print("   The server did not return an Access-Control-Allow-Origin header.")
            else:
                print(f"   The server returned '{allow_origin}' instead.")
            
    except Exception as e:
        print(f"\n❌ ERROR: Request failed: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Verify CORS headers for a URL.")
    parser.add_ecord = parser.add_argument_group("Required Arguments")
    parser.add_argument("--url", required=True, help="The API endpoint to test (e.g. http://localhost:8000/api/auth/signin)")
    parser.add_argument("--origin", required=True, help="The origin to simulate (e.g. https://your-app.vercel.app)")
    
    args = parser.parse_args()
    verify_cors(args.url, args.origin)
