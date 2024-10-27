import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user'; // Ensure this path is correct for your user model
import db from '@/lib/db';
import { adminAuth } from '@/lib/firebaseAdmin'; // Adjust to your Firebase Admin SDK path

// Named export for the GET method
export async function GET(request: NextRequest, { params }: { params: { uid: string } }) {
  const { uid } = params; // Get the UID from the URL

  // Log the UID received from the request
  console.log('Received UID:', uid);

  try {
    // Extract token from Authorization header
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    console.log('Extracted Token:', token); // Log the extracted token

    if (!token) {
      console.log('No token provided');
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // Verify the token using Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(token);
    console.log('Decoded Token:', decodedToken); // Log the decoded token

    const firebaseUid = decodedToken.uid;
    console.log('Firebase UID from token:', firebaseUid); // Log Firebase UID

    // Find user in the database using the Firebase UID
    const user = await db.User.findOne({ where: { firebaseUid } });

    
    console.log('Found User:', user); // Log found user

    if (!user) {
      console.log('User not found in database');
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Respond with the user's role
    return NextResponse.json({ role: user.role }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user role:', error); // Log any errors
    return NextResponse.json({ message: 'Error fetching user role' }, { status: 500 });
  }
}
