import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';

export default function Login() {

    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post("http://localhost:8000/api/v1/users/login", data, { withCredentials: true }); // Use 'response' instead of 'res'
    
            if (response.status === 200) {
                const refreshToken = response.data.data.refreshToken;
                const accessToken = response.data.data.accessToken;
    
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('accessToken', accessToken);
    
                navigate("/home");
            } else {
                setError(response.data.error); 
            }
    
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log(error.response.data);
                setError(error.response.data.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    };
    

    return (
        <div className="max-w-md mx-auto my-8 p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className=" text-white flex flex-col items-center justify-item-center text-2xl font-semibold mb-4">
                <img className="w-20 rounded-full " src="https://img.freepik.com/free-vector/chatbot-chat-message-vectorart_78370-4104.jpg?t=st=1715248404~exp=1715252004~hmac=11c4fef525ee14e2d7d7d111008f864a206e952151e5c95374e131581aa1a079&w=740" alt="" />
                Login</h2>
            <form
                onSubmit={handleSubmit}
            >
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white">Email</label>

                    <input
                        placeholder='email'
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" required />

                </div>

                <div className="mb-6">
                    <label htmlFor="password"
                        className="block text-sm font-medium text-white">Password</label>

                    <input type="password"
                        name="password"
                        placeholder='password'
                        value={data.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" required />
                </div>

                <div className="flex items-center justify-between">
                    <button type="submit"

                        className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">Login</button>
                </div>
                {error && <p className="text-red-600 mt-2">{error}</p>}
                <div className='flex my-2'>
                    <p className='text-blue-400'>New to Here?</p>
                    <Link
                        className='mx-4 text-blue-800 hover:text-blue-300'
                        to={"/signup"}
                    >
                        Sign Up
                    </Link>
                </div>
            </form >
        </div >

    );
}


