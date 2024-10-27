import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { adminAuth } from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token using Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Extract body from request
    const body = await request.json();
    const { email, role } = body;

    // Create user in MySQL
    const [user, created] = await db.User.findOrCreate({
      where: { firebaseUid },
      defaults: {
        email,
        firebaseUid,
        role,
        displayName: email.split('@')[0],
        password: '', // If using Firebase Auth, password might not be needed
      },
    });

    if (!created) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    return NextResponse.json({ message: 'User added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding user to MySQL:', error);
    return NextResponse.json({ message: 'Error adding user to MySQL' }, { status: 500 });
  }
}
