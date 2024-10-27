'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/app/components/NavBar';
import { getAuth } from "firebase/auth";

interface JobApplication {
  id: number;
  companyName: string;
  jobTitle: string;
  status: string;
  dateApplied: Date;
  notes?: string; // Optional field
}

const DashboardPage = () => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [interviews, setInterviews] = useState(0);
  const [pendingOffers, setPendingOffers] = useState(0);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Function to fetch the Firebase token
  useEffect(() => {
    const fetchToken = async () => {
      const auth = getAuth();
      try {
        const idToken = await auth.currentUser?.getIdToken(true);
        if (idToken) {
          setToken(idToken);
        } else {
          setError("No user is signed in");
        }
      } catch (err) {
        console.error("Error fetching Firebase token:", err);
        setError("Error fetching Firebase token");
      }
    };
    fetchToken();
    
  }, []);

  // Fetch job applications using the Firebase token
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return; // Only fetch data if token is available

      try {
        const response = await fetch('/api/jobs', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Firebase token in the headers
          },
        });

        const data = await response.json();
        if (Array.isArray(data)) {
          setJobApplications(data);
          setTotalApplications(data.length);
          setInterviews(data.filter((job) => job.status === 'interview').length);
          setPendingOffers(data.filter((job) => job.status === 'offer').length);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError('Error fetching job applications');
        console.error('Error:', error);
      }
    };

    if (token) {
      fetchData(); // Fetch job applications only when token is set
    }
  }, [token]);
  console.log('Received token:', token);


  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4 text-red-800">Welcome to your Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* Job Application Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold text-gray-800">Total Applications</h2>
          <p className="text-4xl mt-2 text-gray-900">{totalApplications}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold text-gray-800">Interviews</h2>
          <p className="text-4xl mt-2 text-gray-900">{interviews}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold text-gray-800">Pending Offers</h2>
          <p className="text-4xl mt-2 text-gray-900">{pendingOffers}</p>
        </div>
      </section>

      {/* Recent Applications */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-red-800">Recent Applications</h2>
        <div className="space-y-4">
          {jobApplications.length === 0 ? (
            <p>No recent applications found.</p>
          ) : (
            jobApplications.slice(0, 5).map((job) => (
              <div key={job.id} className="bg-white p-4 rounded-lg shadow-lg flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {job.jobTitle} at {job.companyName}
                  </h3>
                  <p className="text-gray-600">Applied on {new Date(job.dateApplied).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
