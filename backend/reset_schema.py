"""
Database schema reset script to fix schema mismatch issues.

This script will drop existing tables and recreate them with the correct schema.
Use this if you're experiencing schema mismatch errors.
"""

from sqlmodel import text
from db import engine, SQLModel
from models import User, Todo

def reset_schema():
    """Drop and recreate tables with the correct schema."""
    print("Resetting database schema...")
    
    # Drop all tables
    print("Dropping existing tables...")
    SQLModel.metadata.drop_all(engine)
    
    # Create all tables with the correct schema
    print("Creating tables with correct schema...")
    SQLModel.metadata.create_all(engine)
    
    print("Database schema reset completed successfully!")

if __name__ == "__main__":
    reset_schema()