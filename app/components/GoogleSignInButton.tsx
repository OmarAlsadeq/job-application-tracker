'use client';

import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase'; // Ensure the correct path for Firebase config
import { useRouter } from 'next/navigation';

const GoogleSignInButton = () => {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('User:', result.user);
      // Redirect to dashboard after successful sign-in
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;
