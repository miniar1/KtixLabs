import pkg from 'pg';
import dotenv from 'dotenv';
import { Sequelize }  from "sequelize";  
dotenv.config();

const { Pool } = pkg;
export const sequelize = new Sequelize(
  "ktixlabs",
  "postgres",
  "Mx23?Ry#",
    {
        host:"localhost",
        dialect: "postgres",
       
    }
);
export const db = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ktixlabs',
    password: process.env.DB_PASSWORD || 'Mx23?Ry#',
    port: parseInt(process.env.DB_PORT || '5432'),
});

db.on('connect', () => {
    console.log('✅ Connected to PostgreSQL');
});

db.on('error', (err) => {
    console.error('❌ PostgreSQL connection error:', err);
    process.exit(-1);
});



export default sequelize;
