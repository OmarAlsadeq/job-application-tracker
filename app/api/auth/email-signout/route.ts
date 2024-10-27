import { NextResponse } from 'next/server';
import { getAuth, signOut } from 'firebase/auth';

export async function POST() {
  try {
    const auth = getAuth();
    await signOut(auth);

    return NextResponse.json({ message: 'Signed out successfully' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 400 });
    }
  }
}
