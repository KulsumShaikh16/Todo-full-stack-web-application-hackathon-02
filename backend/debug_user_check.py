from sqlmodel import Session, select
from db import engine
from models import User

def check_user(email: str):
    with Session(engine) as session:
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()
        if user:
            print(f"User found: {user.email}")
            print(f"User ID: {user.id}")
            print(f"Has password hash: {bool(user.password_hash)}")
        else:
            print(f"User NOT found: {email}")

if __name__ == "__main__":
    email = "kulsumshaikh2020@gmail.com"
    print(f"Checking for user: {email}")
    check_user(email)
