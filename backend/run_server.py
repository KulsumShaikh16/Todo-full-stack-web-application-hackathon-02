import uvicorn
from main import app

from db import settings

if __name__ == "__main__":
    uvicorn.run(app, host=settings.backend_host, port=settings.backend_port, reload=False)