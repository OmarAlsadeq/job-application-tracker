import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin'; // Firebase Admin setup
import db from '@/lib/db'; // Sequelize or ORM instance

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!token) {
    console.error('Authorization token is missing');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Ensure the user is an admin
    const user = await db.User.findOne({ where: { firebaseUid: decodedToken.uid } });
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Fetch all job applications
    const jobs = await db.JobApplication.findAll();
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ message: 'Error fetching jobs' }, { status: 500 });
  }
}
