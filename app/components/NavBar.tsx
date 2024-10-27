import Link from 'next/link';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext'; // Adjust the path based on your setup
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation'; // For navigation after logout
import { auth } from '@/lib/firebase'; // Import your Firebase auth instance

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user using Firebase Auth
      router.push('/'); // Redirect to the home page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-lg">
            Home
          </Link>
        </div>

        <div className="flex-grow"></div> {/* This pushes the sign-in/logout to the right */}

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Show these links only if user is authenticated */}
              <Link href="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              <Link href="/jobs" className="hover:text-gray-300">
                Jobs
              </Link>
              <Link href="/profile" className="hover:text-gray-300">
                Profile
              </Link>

              <button onClick={handleLogout} className="bg-red-500 px-3 py-2 rounded hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            <div className="relative">
              {/* Button to toggle the sign-in dropdown */}
              <button
                onClick={toggleDropdown}
                className="bg-blue-500 px-3 py-2 rounded hover:bg-blue-700"
              >
                Sign In
              </button>

              {/* Sign-in options dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                  <ul>
                    <li className="px-4 py-2 hover:bg-gray-200">
                      <Link href="/auth/email-signin">Email Sign In</Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200">
                      <Link href="/auth/signin">Google Sign In</Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
