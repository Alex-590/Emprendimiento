import 'dotenv/config';
import mysql from 'mysql2/promise';
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD } = process.env;
if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_PASSWORD) {
    throw new Error('Faltan variables de entorno: revisa tu archivo .env');
}
async function main() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: MYSQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_PASSWORD,
            database: 'mysql',
        });
        console.log('Conectado a la base de datos');
        const [rows] = await connection.query('SELECT VERSION() AS author');
        console.log('Resultado de la consulta:', rows);
    }
    catch (err) {
        console.error('Ocurrio un error:', err);
    }
    finally {
        if (connection) {
            await connection.end();
            console.log('Conexion cerrada');
        }
    }
}
main();
//# sourceMappingURL=mysql_select.js.map