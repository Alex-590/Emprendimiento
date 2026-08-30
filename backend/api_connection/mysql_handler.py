from dataclasses import dataclass
from contextlib import asynccontextmanager
from typing import AsyncGenerator
import asyncmy
from asyncmy import Connection as AsyncMySQLConnection

@dataclass
class Connection:
    host: str
    user: str
    password: str
    name: str
    port: str

class MySQLManager:
    __connection: Connection
    __pool: asyncmy.Pool | None

    def __init__(self, con: Connection) -> None:
        self.__connection = con
        self.__pool = None

    async def initialize(self) -> None:
        self.__pool = await asyncmy.create_pool(
            host=self.__connection.host,
            port=int(self.__connection.port),
            user=self.__connection.user,
            password=self.__connection.password,
            db=self.__connection.name,
            minsize=4,
            maxsize=50,
            autocommit=True
        )

    async def close(self) -> None:
        if self.__pool:
            self.__pool.close()
            await self.__pool.wait_closed()

    @asynccontextmanager
    async def get_connection(self) -> AsyncGenerator[AsyncMySQLConnection, None]:
        if not self.__pool:
            raise RuntimeError("Database pool has not been initialized yet")

        async with self.__pool.acquire() as connection:
            yield connection