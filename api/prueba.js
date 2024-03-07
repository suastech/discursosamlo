import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const { Pool } = pkg;
async function prueba(req) {
    console.log("llega llamada con:",req.query.phrase)
   
    const pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    console.log(pool)
    console.log(pool.user, pool.password)
  }

  prueba();

  export default prueba;