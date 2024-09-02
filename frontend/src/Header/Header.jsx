import axios from 'axios';
import React from 'react'
import { useState } from 'react';
// import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


function Header() {

  // const authStatus = useSelector((state) => state.auth.staus)
  const navigate = useNavigate()

  
  const logout = async () => {
    const url = "http://localhost:8000/api/v1/users/logout";
    
    try {
      const res = await axios.post(url, {}, { withCredentials: true });

      if (res.status === 200) {
        // Clear tokens or user data if needed
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');

        // Navigate to the home page or login page
        navigate("/");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      // Handle errors appropriately
    }
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center border-solid border-2 border-sky-500  ">

      <div className="flex items-center space-x-4">
        <img
          src="https://via.placeholder.com/40" // Replace with your logo image source
          alt="logo"
          className="w-10 h-10 rounded-full"
        />
        <span className="flex text-lg font-bold">chaicode</span>
        <div className='flex items-center  mt-2'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-1 sm:w-5 sm:h-5 text-background-accent dark:text-foreground"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>
          <button className="pt text-lg">
            Feedback</button>
        </div>
      </div>
      <div className="flex items-center space-x-6 ">
        <div className="relative">
          <button
            className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"
            onClick={toggleDropdown}
          >
            <span className="text-sm font-bold">R</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <ul className="text-sm">
                <li className="hover:bg-gray-700 p-2 cursor-pointer">My Profile</li>
                <li className="hover:bg-gray-700 p-2 cursor-pointer"
                onClick={logout}
                >Sign out</li>
              </ul>
            </div>
          )}
        </div>
      </div>

    </header>
  );
}

export default Header
