'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/NavBar';
import { AuthContext } from '@/context/AuthContext'; // Correct AuthContext import
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getAuth } from 'firebase/auth';

// Define the Job interface to match your job application's properties
interface Job {
  id: number;
  companyName: string;
  jobTitle: string;
  status: string;
  dateApplied: string;
  notes?: string; // Optional field
}

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, role } = useContext(AuthContext); // Use role from AuthContext

  // Fetch job applications when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      if (user) {
        try {
          const token = await user.getIdToken(); // Get Firebase token
          const response = await fetch('/api/jobs', {
            headers: {
              'Authorization': `Bearer ${token}`, // Pass the token in the request headers
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch jobs');
          }

          const data: Job[] = await response.json();
          setJobs(data);
        } catch (error) {
          setError('Error fetching jobs');
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchJobs();
  }, [user]);

  
  const handleDelete = async (id: number) => {
    try {
      const currentUser = getAuth().currentUser; // Use modular auth method
      if (!currentUser) {
        console.error('User is not authenticated');
        return;
      }
  
      const token = await currentUser.getIdToken(true);
      console.log('Delete Token:', token);
  
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        console.error('Delete failed with response:', response);
        throw new Error(`Failed to delete job. Status: ${response.status}`);
      }
  
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
      console.log('Job deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Error deleting job. Please try again.');
    }
  };
  
  
  

  const handleEdit = (id: number) => {
    router.push(`/jobs/edit/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-6 text-white text-center">
        <h1 className="text-3xl font-bold mb-6">Job Applications</h1>
        {jobs.length === 0 ? (
          <p>No job applications found. Please add some.</p>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job.id} className="bg-white p-4 rounded-lg shadow text-black">
                <h2 className="text-xl font-semibold">{job.companyName}</h2>
                <p>Job Title: {job.jobTitle}</p>
                <p>Status: {job.status}</p>
                <p>Date Applied: {new Date(job.dateApplied).toLocaleDateString()}</p>
                <p>Notes: {job.notes || 'No notes'}</p>

                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => handleEdit(job.id)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  {role === 'admin' && ( // Show Delete button only for admins
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
