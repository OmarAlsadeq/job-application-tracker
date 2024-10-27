import { NextResponse } from 'next/server';
import db from '../../../models'; // Ensure this imports your models correctly
import { adminAuth } from '@/lib/firebaseAdmin'; // Use Firebase Admin from firebaseAdmin.ts

// Helper function to verify the user token from the request
async function verifyUser(request: Request) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1]; // Extract token from Authorization header
  if (!token) {
    console.log('No token provided');
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token); // Use Firebase Admin SDK to verify token
    console.log('User ID from Firebase:', decodedToken.uid); // Log the UID from Firebase
    return decodedToken.uid; // Return the user ID
  } catch (error) {
    console.error('Error verifying Firebase token:', error); // Log any errors in token verification
    return null;
  }
}

// GET: Fetch all job applications for the authenticated user
export async function GET(request: Request) {
  const userId = await verifyUser(request); // Verify the user
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const jobs = await db.JobApplication.findAll({
      where: { userId }, // Fetch jobs belonging to the authenticated user
    });
    console.log('Fetched Jobs:', jobs); // Log the fetched jobs
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error); // Log any errors while fetching jobs
    return NextResponse.json({ message: 'Error fetching jobs' }, { status: 500 });
  }
}


// POST: Create a new job application for the authenticated user
export async function POST(request: Request) {
  const userId = await verifyUser(request); // Verify the user
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: 'Empty request body' }, { status: 400 });
    }

    // Insert the job into the database and associate it with the authenticated user
    const newJob = await db.JobApplication.create({ ...body, userId });
    console.log('Job created:', newJob); // Log the created job
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error); // Log any errors while creating a job
    return NextResponse.json({ message: 'Error creating job' }, { status: 500 });
  }
}

// PUT: Update a job application by ID if the user owns it
export async function PUT(request: Request) {
  const userId = await verifyUser(request); // Verify the user
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
    }

    console.log('Parsed body:', body); // Log the parsed request body
    console.log('User ID:', userId);
    console.log('Job ID:', id);

    // Find the job by ID
    const job = await db.JobApplication.findByPk(id);
    console.log('Job found:', job); // Log the found job

    if (!job || job.userId !== userId) {
      console.log('Job not found or user not authorized');
      return NextResponse.json({ message: 'Job not found or not authorized' }, { status: 404 });
    }

    // Update the job
    await job.update(updateData);
    console.log('Job updated:', job); // Log the updated job
    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    console.error('Error updating job:', error); // Log any errors while updating a job
    return NextResponse.json({ message: 'Error updating job' }, { status: 500 });
  }
}

// DELETE: Delete a job application by ID if the user owns it or if the user is an admin
export async function DELETE(request: Request) {
  const token = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(token);
    const firebaseUid = decodedToken.uid; // Extract the UID of the authenticated user

    // Fetch the user from the database based on Firebase UID
    const user = await db.User.findOne({ where: { firebaseUid } });

    // Ensure user exists and is either an admin or the job owner
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Parse the body to get the job ID
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
    }

    // Find the job by ID and userId to ensure ownership
    const job = await db.JobApplication.findOne({
      where: {
        id,
        userId: user.id, // Ensure the job belongs to the authenticated user or an admin
      },
    });

    if (!job) {
      return NextResponse.json({ message: 'Job not found or user not authorized' }, { status: 404 });
    }

    // Delete the job
    await job.destroy();
    console.log('Job deleted:', job); // Log the deleted job
    return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting job:', error); // Log any errors while deleting a job
    return NextResponse.json({ message: 'Error deleting job' }, { status: 500 });
  }
}


