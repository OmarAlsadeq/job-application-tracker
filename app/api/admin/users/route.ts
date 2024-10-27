import { adminAuth } from "@/lib/firebaseAdmin";
import db from "@/models";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  
  // Check if token exists
  if (!token) {
    console.error('Authorization token is missing');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Received token:', token);
    console.log('Verifying token...');
    // Verify the Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    console.log('Firebase UID:', firebaseUid);

    if (!db || !db.User) {
      console.error('Database or User model not properly initialized');
      return NextResponse.json({ message: 'Internal Server Error: Database Issue' }, { status: 500 });
    }

    // Find user in the database
    const user = await db.User.findOne({ where: { firebaseUid } });
    if (!user) {
      console.error('User not found in database');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    console.log('User found:', user.email, 'Role:', user.role);
    // Ensure the user is an admin
    if (user.role !== 'admin') {
      console.error('User is not an admin');
      return NextResponse.json({ message: 'Forbidden: Admins only' }, { status: 403 });
    }

    console.log('User is an admin, fetching all users...');
    // Fetch all users if the authenticated user is an admin
    const users = await db.User.findAll();
    console.log('Users fetched successfully:', users.length);
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error('Error details:', error.message, error.stack);
    console.error('Error verifying token or fetching users:', error);
    return NextResponse.json({ message: 'Error fetching users or verifying token' }, { status: 500 });
  }
}
