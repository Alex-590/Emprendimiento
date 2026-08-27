from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from db_handler import Credentials, DBHandler
from dotenv import load_dotenv
import os

app = FastAPI()

load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Temporary config, quite unsecure for deployment. TODO: restrict origins allowed to communicate with FastAPI
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get('/check-db')
def test_db_connection():
    creds: Credentials = Credentials(
        database=os.getenv('DB_NAME'),
        host=os.getenv('DB_HOST'),
        password=os.getenv('DB_PASSWORD'),
        user=os.getenv('DB_USER')
    )
    success: bool
    error: str | None = None
    try:
        db_handler: DBHandler = DBHandler(creds)
        success = True
    except Exception as e:
        print(f'Error when trying to establish connection to the db: {e}')
        success = False
    finally:
        del db_handler
        return { 'connection_successful': success } if success else { 'connection_successful': success, 'error': error }

@app.get('/check')
def test_server_connection():
    return { 'message': 'herkese merhaba!!' }

handler: Mangum = Mangum(app=app)

if __name__ == '__main__':
    creds: Credentials = Credentials(
        database=os.getenv('DB_NAME'),
        host=os.getenv('DB_HOST'),
        password=os.getenv('DB_PASSWORD'),
        user=os.getenv('DB_USER')
    )
    db_handler: DBHandler = DBHandler(creds)
    del db_handler