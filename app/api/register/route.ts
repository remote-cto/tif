// app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import emailService from '@/lib/email';
import verificationService from '../../../lib/verification';
import studentService from '@/lib/studentService';
import validationUtils, { StudentRegistrationData } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = body as StudentRegistrationData;

    // Validate input data
    const validation = validationUtils.validateRegistrationData(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors[0] },
        { status: 400 }
      );
    }

    // Validate student data against database
    const studentValidation = await studentService.validateStudentData(data);
    if (!studentValidation.isValid) {
      return NextResponse.json(
        { error: studentValidation.errors[0] },
        { status: studentValidation.errors[0].includes('already exists') ? 409 : 400 }
      );
    }

    // Generate verification code
    const verificationCode = verificationService.generateCode();

    // Store verification code and student data
    verificationService.storeCode(
      data.email,
      verificationCode,
      { ...data, college_id: studentValidation.collegeId },
      10 // 10 minutes expiration
    );

    // Send verification email
    await emailService.sendVerificationEmail(data.email, data.name, verificationCode);

    return NextResponse.json({
      message: 'Verification code sent to your email',
      success: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, verificationCode } = body;

    if (!email || !verificationCode) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Validate verification code
    if (!verificationService.isCodeValid(email, verificationCode)) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    // Get stored data
    const storedData = verificationService.getStoredData(email);
    if (!storedData) {
      return NextResponse.json(
        { error: 'Verification data not found' },
        { status: 400 }
      );
    }

    // Create student in database
    const student = await studentService.createStudent(storedData.data);

    // Remove verification code from memory
    verificationService.deleteCode(email);

    return NextResponse.json({
      message: 'Registration successful! Welcome to XWORKS.',
      success: true,
      student
    });

  } catch (error) {
    console.error('Verification error:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'Email or registration number already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Check if there's pending verification for this email
    const storedData = verificationService.getStoredData(email);
    if (!storedData) {
      return NextResponse.json(
        { error: 'No pending verification for this email' },
        { status: 400 }
      );
    }

    // Generate new verification code
    const newVerificationCode = verificationService.generateCode();

    // Update stored verification code
    verificationService.updateCode(email, newVerificationCode);

    // Send new verification email
    await emailService.sendResendVerificationEmail(email, storedData.data.name, newVerificationCode);

    return NextResponse.json({
      message: 'New verification code sent to your email',
      success: true
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}