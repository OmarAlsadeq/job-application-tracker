import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Adjust the path to your DB config

export async function GET() {
  try {
    // Test the connection to the database
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Optionally, perform a sample query to fetch any data
    const users = await db.User.findAll(); // Replace this with any simple query you want
    return NextResponse.json({ message: 'DB connection successful!', users }, { status: 200 });
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';

    // Check if the error is an instance of Error and extract the message
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('Unable to connect to the database:', errorMessage);
    return NextResponse.json({ message: 'DB connection failed!', error: errorMessage }, { status: 500 });
  }
}
