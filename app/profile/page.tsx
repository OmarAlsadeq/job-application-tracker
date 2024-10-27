'use client';

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext'; // Adjust the path if needed
import { updateProfile } from 'firebase/auth'; // Import Firebase updateProfile function
import { auth, storage } from '@/lib/firebase'; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage functions
import Navbar from '@/app/components/NavBar'; // Import the Navbar component

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePic, setProfilePic] = useState<File | null>(null); // Store the profile picture
  const [photoURL, setPhotoURL] = useState(user?.photoURL || ''); // Store the photoURL
  const [token, setToken] = useState<string | null>(null); // State to store the token

  useEffect(() => {
    // Set the photoURL from the user object if it exists
    if (user?.photoURL) {
      setPhotoURL(user.photoURL);
    }

    // Get Firebase token on component mount
    const getToken = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const idToken = await currentUser.getIdToken(true);
          setToken(idToken); // Store the token in the state
          console.log("Firebase Token:", idToken);
        }
      } catch (error) {
        console.error('Error getting Firebase token:', error);
      }
    };

    getToken(); // Call the function to fetch token
  }, [user]);

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      let updatedPhotoURL = photoURL;

      // Upload the profile picture to Firebase Storage if a new one is selected
      if (profilePic) {
        const storageRef = ref(storage, `profile-pictures/${auth.currentUser?.uid}`);
        const snapshot = await uploadBytes(storageRef, profilePic);
        updatedPhotoURL = await getDownloadURL(snapshot.ref);
      }

      if (auth.currentUser) {
        // Update the user's profile information in Firebase
        await updateProfile(auth.currentUser, {
          displayName: displayName,
          photoURL: updatedPhotoURL, // Update photoURL if a new picture is uploaded
        });

        console.log('Profile updated successfully');
      }
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <Navbar /> {/* Added the Navbar component here */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-black">Your Profile</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          {editing ? (
            <div>
              <label className="block mb-2 text-black">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border rounded p-2 w-full mb-4"
              />

              <label className="block mb-2 text-black">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded p-2 w-full mb-4"
                disabled
              />

              {/* Profile Picture Upload */}
              <label className="block mb-2 text-black">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
                className="border rounded p-2 w-full mb-4"
              />

              {/* Save Button */}
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          ) : (
            <div>
              {/* Display Profile Picture */}
              {photoURL && <img src={photoURL} alt="Profile" className="w-32 h-32 rounded-full mb-4" />}

              <p className="text-black">
                <strong>Display Name:</strong> {user.displayName}
              </p>
              <p className="text-black">
                <strong>Email:</strong> {user.email}
              </p>

              {/* Edit Button */}
              <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
