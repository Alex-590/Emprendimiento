from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Temporary config, quite unsecure for deployment. TODO: restrict origins allowed to communicate with FastAPI
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get('/')
def test_connection():
    return { 'message': 'herkese merhaba!!' }

handler: Mangum = Mangum(app=app)