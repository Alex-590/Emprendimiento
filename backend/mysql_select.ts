import 'dotenv/config'; //le mi archio. env mete los valores en process.env
import mysql from 'mysql2/promise'; //Esta libreria sabe hablar el protoclo de MySql / promise = usa async y await
import type { RowDataPacket } from 'mysql2/promise'; 


interface Author extends RowDataPacket { author: string; }//Esto es solo para que TypeScript me ayude con autocompletado y detecte errores



const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD } = process.env; //es un objeto de Node.js que contiene las variables de entorno del sistema en el que se está ejecutando tu aplicación.

if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_PASSWORD) {
  throw new Error('Faltan variables de entorno: revisa tu archivo .env');
}


async function main(): Promise<void> {  //no me va a regresar nada la conexion, debe ser asincorna debido a loq eu se tarda en cncetarse a la base de datos
let connection; 

try { connection = await mysql.createConnection({ //"quiero abrir un canal de comunicación hacia esta base de datos, con estas credenciales".
  host: MYSQL_HOST!,
  user: MYSQL_USER!,
  password: MYSQL_PASSWORD!,
  database: 'mysql',});

console.log('Conectado a la base de datos'); 
}
catch (err) { 
console.error('Ocurrio un error:', err); 
}

finally { 
  if (connection) { 
    await connection.end(); 
    console.log('Conexion cerrada'); } 
  }
} 


main();