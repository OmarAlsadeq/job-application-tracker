import { NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Optional: You can also return a token if needed for client-side auth
    const token = await user.getIdToken();

    return NextResponse.json({ uid: user.uid, email: user.email, token }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Sign-up error:", error.message); // Add logging
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: 'An unknown error occurred' }, { status: 400 });
    }
  }
}
