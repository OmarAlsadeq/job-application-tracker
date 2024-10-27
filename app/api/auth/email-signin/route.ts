import { NextResponse } from 'next/server';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return NextResponse.json({ uid: user.uid, email: user.email }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 400 });
    }
  }
}
