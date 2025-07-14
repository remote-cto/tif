// lib/database.ts
import { Pool } from 'pg';

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:ScSXzjLMSOvbfXHcOsniPmgtHkOakvZJ@hopper.proxy.rlwy.net:20704/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

export default pool;