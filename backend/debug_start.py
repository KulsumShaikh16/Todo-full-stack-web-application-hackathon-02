
import sys
import uvicorn
import logging

print("DEBUG: Starting script", flush=True)

try:
    from main import app
    print("DEBUG: Imported app", flush=True)
except Exception as e:
    print(f"DEBUG: Failed to import app: {e}", flush=True)
    sys.exit(1)

logging.basicConfig(level=logging.DEBUG)

if __name__ == "__main__":
    print("DEBUG: Starting Uvicorn...", flush=True)
    try:
        uvicorn.run(app, host="127.0.0.1", port=8000, log_level="debug")
    except Exception as e:
        print(f"DEBUG: Uvicorn failed: {e}", flush=True)
