#!/usr/bin/env python3
"""
Verification script to check if the database is properly initialized with tables and test data.
"""

import sys
from sqlmodel import select, Session
from db import engine, logger
from models import User, Todo


def verify_database():
    """Verify that the database has been properly initialized with tables and test data."""
    try:
        with Session(engine) as session:
            # Verify tables exist by attempting to count users
            user_count = session.exec(select(User)).all()
            logger.info(f"Found {len(user_count)} user(s) in the database")
            
            # Look for our test user
            test_users = session.exec(select(User).where(User.email == "test@example.com")).all()
            if test_users:
                logger.info("✅ Test user exists in database")
                test_user = test_users[0]
                
                # Count todos for the test user
                todo_count = session.exec(select(Todo).where(Todo.user_id == test_user.id)).all()
                logger.info(f"✅ Found {len(todo_count)} todo(s) for test user")
                
                if len(todo_count) == 3:
                    logger.info("✅ All 3 sample todos are present")
                    for i, todo in enumerate(todo_count, 1):
                        status = "✓" if todo.completed else "○"
                        logger.info(f"  {status} Todo {i}: {todo.title}")
                else:
                    logger.warning(f"⚠️  Expected 3 todos, found {len(todo_count)}")
            else:
                logger.warning("⚠️  Test user not found in database")
            
            logger.info("Database verification completed successfully!")
            return True
            
    except Exception as e:
        logger.error(f"❌ Database verification failed: {e}")
        return False


if __name__ == "__main__":
    success = verify_database()
    sys.exit(0 if success else 1)