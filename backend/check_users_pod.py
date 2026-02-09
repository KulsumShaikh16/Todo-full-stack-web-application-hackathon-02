from sqlmodel import Session, select
from db import engine
from models import User

def check_users():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        print(f"Total users: {len(users)}")
        for user in users:
            print(f"- {user.email}")

if __name__ == "__main__":
    check_users()
