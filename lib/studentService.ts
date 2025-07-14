// lib/studentService.ts
import pool from './database';
import { StudentRegistrationData } from './validation';

export const studentService = {
  checkEmailExists: async (email: string): Promise<boolean> => {
    const result = await pool.query(
      'SELECT id FROM students WHERE email = $1',
      [email]
    );
    return result.rows.length > 0;
  },

  checkRegistrationNumberExists: async (registrationNumber: string): Promise<boolean> => {
    const result = await pool.query(
      'SELECT id FROM students WHERE registration_number = $1',
      [registrationNumber]
    );
    return result.rows.length > 0;
  },

  checkCollegeExists: async (collegeId: number): Promise<boolean> => {
    const result = await pool.query(
      'SELECT id FROM colleges WHERE id = $1',
      [collegeId]
    );
    return result.rows.length > 0;
  },

  createStudent: async (data: StudentRegistrationData & { college_id: number }) => {
    const { name, email, phone, registration_number, college_id } = data;
    
    const result = await pool.query(
      `INSERT INTO students (name, email, phone, registration_number, college_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, created_at`,
      [name, email, phone, registration_number, college_id]
    );

    return result.rows[0];
  },

  validateStudentData: async (data: StudentRegistrationData) => {
    const errors: string[] = [];

    // Check if email already exists
    if (await studentService.checkEmailExists(data.email)) {
      errors.push('Email already exists');
    }

    // Check if registration number already exists
    if (await studentService.checkRegistrationNumberExists(data.registration_number)) {
      errors.push('Registration number already exists');
    }

    // Convert college_id to integer and check if college exists
    const collegeIdInt = parseInt(data.college_id);
    if (!await studentService.checkCollegeExists(collegeIdInt)) {
      errors.push('Invalid college selected');
    }

    return {
      isValid: errors.length === 0,
      errors,
      collegeId: collegeIdInt
    };
  }
};

export default studentService;