import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { CiUser } from "react-icons/ci";
import { useNavigate } from 'react-router-dom'


function Header() {

  // const authStatus = useSelector((state) => state.auth.staus)
  const navigate = useNavigate()

  const [userData, setUserData] = useState('');

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
    }
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const handleClick = async () => {
    const url = "http://localhost:8000/api/v1/users/getCurrentUser"

    const getUserInfo = await axios.get(url, { withCredentials: true });
    setUserData(getUserInfo.data.data)
  }



  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center border-solid border-2 border-sky-500  ">
      <div className="flex items-center space-x-4">
        <span className="flex text-lg font-bold">chaicode</span>
      </div>
      <div className="flex items-center space-x-6 ">
        <div className="relative">
          <button
            className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"
            onClick={toggleDropdown}
          >
            <span className="text-sm font-bold"
              onClick={handleClick}
            >
             <CiUser />
            </span>
          </button>



          {isDropdownOpen && (
            <div className="flex justify-center items-center absolute right-0  w-56 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <ul className="text-sm">
                <div className='flex flex-col justify-center items-center p-2'>
                  <img
                    src={userData.avatar}
                    alt={`${userData.fullname}'s avatar`}
                    className="w-12 h-12 rounded-full"
                  />
                  <li className="p-2">
                    <div className='flex flex-col justify-center items-center'>
                      <div className="font-semibold text-lg">{userData.username}</div>
                      <div className="text-gray-400">{userData.fullname}</div>
                      <div className="text-gray-400">{userData.email}</div>
                    </div>
                  </li>
                </div>
                <li
                  className="hover:bg-gray-700 p-2 cursor-pointer text-center rounded-md"
                  onClick={logout}
                >
                  Sign out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

    </header>
  );
}

export default Header
