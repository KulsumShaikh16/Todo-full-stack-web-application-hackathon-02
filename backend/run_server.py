import uvicorn
from main import app

from db import settings

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=settings.backend_port, reload=False)