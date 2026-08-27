import mysql.connector
from mysql.connector import Error
from mysql.connector.abstracts import MySQLConnectionAbstract
from mysql.connector.pooling import PooledMySQLConnection
from dataclasses import dataclass

@dataclass
class Credentials:
    host: str
    user: str
    password: str
    database: str

class DBHandler:
    __connection: MySQLConnectionAbstract | PooledMySQLConnection | None
    def __init__(self, creds: Credentials) -> None:
        self.__connection = None
        try:
            self.__connection = mysql.connector.connect(
                host=creds.host,
                user=creds.user,
                password=creds.password,
                database=creds.database
            )
        except Error as e:
            print(f"Error while establishing connection with MySQL service: {e}")
            raise

    @property
    def is_connected(self) -> bool:
        return self.__connection.is_connected

    def __del__(self) -> None:
        if self.__connection and self.__connection.is_connected():
            self.__connection.close()