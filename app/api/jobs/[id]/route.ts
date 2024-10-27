import { NextRequest, NextResponse } from 'next/server';
import JobApplication from '@/models/jobapplication'; // Adjust the model import
import { adminAuth } from '@/lib/firebaseAdmin';

// GET: Fetch a job by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const jobId = parseInt(id, 10);
  console.log('Fetching job with ID:', jobId);

  if (isNaN(jobId)) {
    return NextResponse.json({ message: 'Invalid job ID' }, { status: 400 });
  }

  try {
    const job = await JobApplication.findOne({ where: { id: jobId } });

    if (!job) {
      console.error(`Job with ID ${jobId} not found.`);
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    console.log('Job found:', job);
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ message: 'Error fetching job' }, { status: 500 });
  }
}

// PUT: Update a job by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const jobId = parseInt(id, 10);
  console.log('Updating job with ID:', jobId);

  if (isNaN(jobId)) {
    return NextResponse.json({ message: 'Invalid job ID' }, { status: 400 });
  }

  try {
    const jobData = await req.json();
    console.log('Received Job Data for Update:', jobData);

    const job = await JobApplication.findOne({ where: { id: jobId } });

    if (!job) {
      console.error(`Job with ID ${jobId} not found.`);
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    await job.update(jobData);
    console.log('Job updated successfully:', job);
    return NextResponse.json({ message: 'Job updated successfully' });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ message: 'Error updating job' }, { status: 500 });
  }
}

// DELETE: Delete a job by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const jobId = parseInt(id, 10);

  console.log('Received delete request for job with ID:', jobId);

  if (isNaN(jobId)) {
    console.error('Invalid job ID:', id);
    return NextResponse.json({ message: 'Invalid job ID' }, { status: 400 });
  }

  try {
    console.log('Request Headers:', JSON.stringify(req.headers, null, 2));

    // Check for the Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('Authorization header is missing');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log('Authorization Header:', authHeader);

    // Extract Bearer token from Authorization header
    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      console.error('Token is missing in Authorization header');
      return NextResponse.json({ message: 'Unauthorized: Token missing' }, { status: 401 });
    }

    console.log('Token:', token);

    // Verify the token using Firebase Admin SDK
    
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      console.log('Decoded Token:', decodedToken);
    } catch (error) {
      console.error('Failed to verify token:', error);
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 403 });
    }

    console.log('Token verified. Proceeding to delete the job.');

    // Find the job in the database
    const job = await JobApplication.findOne({ where: { id: jobId } });
    if (!job) {
      console.error(`Job with ID ${jobId} not found.`);
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    // Attempt to delete the job
    await job.destroy();
    console.log('Job deleted successfully:', jobId);

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error); // Log the full error
    return NextResponse.json({ message: 'Error deleting job', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
