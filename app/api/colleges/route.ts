import { NextResponse } from 'next/server';
import pool from '@/lib/database';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, name FROM colleges ORDER BY name ASC'
    );
    
    return NextResponse.json({
      colleges: result.rows,
      success: true
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch colleges' },
      { status: 500 }
    );
  }
}