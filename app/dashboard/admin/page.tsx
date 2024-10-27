'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/NavBar';
import { AuthContext } from '@/context/AuthContext';


// Define interfaces for job and user data
interface Job {
  id: number;
  companyName: string;
  jobTitle: string;
  status: string;
  dateApplied: string; // Expecting string here
}

interface User {
  id: number;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const { user, role } = useContext(AuthContext);
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  // Redirect non-admin users to home
  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to sign-in page');
      console.log('User:', user);
      console.log('Role:', role);

      router.push('/auth/signin'); // Redirect to login if not authenticated
    } else if (user && role !== 'admin') {
      console.log('User is not an admin, redirecting to home page');
      router.push('/'); // Redirect non-admin users to home
    }
  }, [user, role, router]);

  // Fetch job applications and users for admin view
  useEffect(() => {
    // Keep the existing fetch logic in AdminDashboard
const fetchAdminData = async () => {
    try {
      // Retrieve the token from the user object
      const token = await user?.getIdToken();
      console.log('Retrieved Token:', token); // Add this line for debugging
  
      // Fetch job applications
      console.log('Fetching job applications...');
      const jobsResponse = await fetch('/api/admin/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Authorization Header:', `Bearer ${token}`);

  
      if (!jobsResponse.ok) {
        console.error(`Error fetching jobs: ${jobsResponse.statusText}`);
        throw new Error(`Error fetching jobs: ${jobsResponse.statusText}`);
      }
  
      const jobsData = await jobsResponse.json();
      console.log('Fetched Jobs Data:', jobsData);
      setJobs(jobsData);
  
      // Fetch users
      console.log('Fetching users...');
      const usersResponse = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!usersResponse.ok) {
        console.error(`Error fetching users: ${usersResponse.statusText}`);
        throw new Error(`Error fetching users: ${usersResponse.statusText}`);
      }
  
      const usersData = await usersResponse.json();
      console.log('Fetched Users Data:', usersData);
      setUsers(usersData);
    } catch (err) {
      setError('Error fetching admin data');
      console.error('Error in fetchAdminData:', err);
    }
  };
  

    if (role === 'admin') {
      console.log('User is admin, fetching admin data...');
      fetchAdminData(); // Fetch data only if admin
    }
  }, [role, user]);

  if (error) {
    console.error('Rendering error message:', error);
    return <p>{error}</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <section>
          <h2 className="text-2xl font-semibold mb-4">All Job Applications</h2>
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job.id} className="bg-white p-4 rounded shadow text-black">
                <p><strong>Company:</strong> {job.companyName}</p>
                <p><strong>Job Title:</strong> {job.jobTitle}</p>
                <p><strong>Status:</strong> {job.status}</p>
                <p><strong>Date Applied:</strong> {job.dateApplied}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">All Users</h2>
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user.id} className="bg-white p-4 rounded shadow text-black">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;