'use client';

import { useState, useContext } from 'react';
import Navbar from '@/app/components/NavBar';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext'; // Import AuthContext to get the authenticated user

// Define the interface for the errors object
interface Errors {
  companyName?: string;
  jobTitle?: string;
  status?: string;
  dateApplied?: string;
}

const AddJobPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [status, setStatus] = useState('');
  const [dateApplied, setDateApplied] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();
  const { user } = useContext(AuthContext); // Get the authenticated user from AuthContext

  // Form validation
  const validateForm = () => {
    const newErrors: Errors = {};

    if (!companyName) newErrors.companyName = 'Company Name is required';
    if (!jobTitle) newErrors.jobTitle = 'Job Title is required';
    if (!status) newErrors.status = 'Status is required';
    if (!dateApplied) newErrors.dateApplied = 'Date Applied is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setMessage('Please fix the errors in the form');
      return;
    }

    // Check if the user is authenticated
    if (!user) {
      setMessage('You must be signed in to add a job application.');
      return;
    }

    const jobData = {
      companyName,
      jobTitle,
      status,
      dateApplied,
      notes,
    };

    try {
      // Retrieve the user's Firebase token
      const token = await user.getIdToken();

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the Firebase token in the headers
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error('Error creating job');
      }

      setMessage('Job created successfully!');
      setTimeout(() => {
        router.push('/jobs');
      }, 1500);
    } catch (error) {
      setMessage('Error creating job');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-3xl text-black font-bold mb-6">Add New Job Application</h1>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md"
        >
          {/* Company Name */}
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className={`w-full mb-4 p-2 border ${errors.companyName ? 'border-red-500' : 'border-gray-300'} rounded text-black`}
            required
          />
          {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}

          {/* Job Title */}
          <input
            type="text"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className={`w-full mb-4 p-2 border ${errors.jobTitle ? 'border-red-500' : 'border-gray-300'} rounded text-black`}
            required
          />
          {errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle}</p>}

          {/* Status */}
          <input
            type="text"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`w-full mb-4 p-2 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded text-black`}
            required
          />
          {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}

          {/* Date Applied */}
          <input
            type="date"
            value={dateApplied}
            onChange={(e) => setDateApplied(e.target.value)}
            className={`w-full mb-4 p-2 border ${errors.dateApplied ? 'border-red-500' : 'border-gray-300'} rounded text-black`}
            required
          />
          {errors.dateApplied && <p className="text-red-500 text-sm">{errors.dateApplied}</p>}

          {/* Notes */}
          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
          />

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
          {message && <p className="text-center mt-4">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddJobPage;
