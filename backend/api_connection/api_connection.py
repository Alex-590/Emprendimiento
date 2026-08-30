from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from mysql_handler import Connection, MySQLManager
from asyncmy import Connection as AsyncMySQLConnection
from asyncmy.cursors import DictCursor
from contextlib import asynccontextmanager
from mangum import Mangum
from dotenv import load_dotenv
import os

load_dotenv()

connection: Connection = Connection(
    host=os.getenv("DB_HOST", ""),
    password=os.getenv("DB_PASSWORD", ""),
    name=os.getenv("DB_NAME", "mysql"),
    user=os.getenv("DB_USER", "admin"),
    port=os.getenv("DB_PORT", "3306")
)

db_manager: MySQLManager = MySQLManager(connection)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await db_manager.initialize()
    yield
    await db_manager.close()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get('/check')
def check():
    return { "message": "Herkese Merhaba!!" }

@app.get('/project-leaders')
async def read_project_leaders(
    session: AsyncMySQLConnection = Depends(db_manager.get_connection)
):
    async with session.cursor(DictCursor) as cur:
        await cur.execute("SELECT * FROM Lideres;")
        items = await cur.fetchall()
    return items

handler: Mangum = Mangum(app=app)