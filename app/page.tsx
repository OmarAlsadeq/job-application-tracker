'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './components/NavBar';
import { AuthContext } from '@/context/AuthContext'; // Ensure the path is correct

const HomePage = () => {
  const { user } = useContext(AuthContext); // Access the authenticated user
  const router = useRouter();

  const handleAddNewApplication = () => {
    if (user) {
      router.push('/jobs/new'); // Redirect to add new job if signed in
    } else {
      router.push('/auth/signin'); // Redirect to sign-in if not signed in
    }
  };

  const handleViewApplications = () => {
    if (user) {
      router.push('/jobs'); // Redirect to view jobs if signed in
    } else {
      router.push('/auth/signin'); // Redirect to sign-in if not signed in
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-col items-center justify-center p-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Job Application Tracker</h1>
          <p className="text-lg text-gray-600">
            Manage and track all your job applications in one place. Keep track of statuses, dates, and notes with ease.
          </p>
        </header>

        {/* Feature Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <h3 className="text-2xl font-semibold mb-2 text-gray-700">Track Applications</h3>
            <p className="text-gray-500">Add and view job applications with relevant details like company, title, and status.</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <h3 className="text-2xl font-semibold mb-2 text-gray-700">Update Status</h3>
            <p className="text-gray-500">Edit and update the status of your job applications as they progress.</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg text-center">
            <h3 className="text-2xl font-semibold mb-2 text-gray-700">Delete Applications</h3>
            <p className="text-gray-500">Easily remove applications you no longer wish to track.</p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="flex space-x-4">
          <button
            onClick={handleViewApplications}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            View Applications
          </button>
          <button
            onClick={handleAddNewApplication}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Add New Application
          </button>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-gray-500">
          <p>© {new Date().getFullYear()} Job Application Tracker</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
