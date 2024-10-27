'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase'; // Firebase setup in your lib/firebase.ts
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React from 'react';

const EmailSignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // Make a request to add the user to your MySQL database
      const { user } = userCredential;
      const token = await user.getIdToken(); // Get the token for authentication
  
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          firebaseUid: user.uid,
          role: 'user', // or 'admin', depending on your requirements
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add user to MySQL database');
      }
  
      router.push('/auth/signin'); // Redirect to the sign-in page after sign-up
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unknown error occurred');
      }
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl text-black mb-6">Sign Up</h1>
      <form onSubmit={handleSignUp} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-black">Email</label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 text-black">Password</label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-gray-300 rounded text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</button>
      </form>
    </div>
  );
};

export default EmailSignupPage;
