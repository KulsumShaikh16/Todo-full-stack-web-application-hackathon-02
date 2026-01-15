import asyncio
import logging
import sys
import os

# Set up logging to stdout
logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger(__name__)

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents.todo_agent import run_todo_agent
from db import Session, engine, SQLModel
from models import User

async def test_agent():
    # 1. Ensure a test user exists
    with Session(engine) as session:
        # Check if user exists
        user = session.get(User, "test-agent-user")
        if not user:
            user = User(id="test-agent-user", email="agent-test@example.com", name="Agent Test", password_hash="dummy")
            session.add(user)
            session.commit()
            session.refresh(user)
    
    user_id = "test-agent-user"
    
    print("\n--- TEST: Add Task ---")
    result = await run_todo_agent(user_id, "Add a task to record a demo video")
    print(f"Agent Response: {result['response']}")
    print(f"Tool Calls: {result['tool_calls']}")

    print("\n--- TEST: List Tasks ---")
    result = await run_todo_agent(user_id, "What are my tasks?")
    print(f"Agent Response: {result['response']}")
    print(f"Tool Calls: {result['tool_calls']}")

if __name__ == "__main__":
    asyncio.run(test_agent())
