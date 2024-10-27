'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/app/components/NavBar'; // Adjust the path if needed
import { AuthContext } from '@/context/AuthContext'; // Ensure this context contains user info

const EditJobPage = () => {
  const { user, role } = useContext(AuthContext); // Get user and role from the context
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [status, setStatus] = useState('');
  const [dateApplied, setDateApplied] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams(); // Get the job ID from the URL

  const { id } = params; // Destructure ID from URL params

  // Role-based access control: Only allow access to admins
  useEffect(() => {
    if (user === undefined || role === undefined) {
      return; // If user/role is not loaded yet, return early
    }
    if (!user) {
      router.push('/auth/signin'); // Redirect to login if not authenticated
    } else if (role !== 'admin') {
      router.push('/'); // Redirect non-admin users to home
    }
  }, [user, role, router]);

  // Fetch job details on page load
  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setError('Job ID not found in the URL.');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching job with ID:', id);
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) {
          console.error(`Failed to fetch job details, status: ${response.status}`);
          throw new Error('Failed to fetch job details');
        }
        const data = await response.json();
        setCompanyName(data.companyName);
        setJobTitle(data.jobTitle);
        setStatus(data.status);
        setDateApplied(data.dateApplied);
        setNotes(data.notes || '');
      } catch (error) {
        setError('Error fetching job details');
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
      
    };

    if (id) {
      fetchJob(); // Fetch job if ID is present
    }
  }, [id]);

  const handleSubmit = async () => {
    const confirmUpdate = window.confirm('Are you sure you want to update this job?');
    if (!confirmUpdate) return;

    if (!companyName || !jobTitle || !status || !dateApplied) {
      setMessage('Please fill out all required fields');
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
      const token = await user?.getIdToken();

      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      setMessage('Job updated successfully!');
      setTimeout(() => {
        router.push('/jobs'); // Redirect back to job listings after a delay
      }, 1500);
    } catch (error) {
      setMessage('Error updating job');
      console.error('Error:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Include the Navbar */}
      <Navbar />
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Edit Job Application</h1>
        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
            required
          />
          <input
            type="text"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
            required
          />
          <input
            type="text"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
            required
          />
          <input
            type="date"
            value={dateApplied}
            onChange={(e) => setDateApplied(e.target.value)}
            className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
            required
          />
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

export default EditJobPage;
