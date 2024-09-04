import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [data, setData] = useState({
        username: "",
        fullname: "",
        email: "",
        password: "",
        avatar: null
    });

    const handleChange = ({ currentTarget: input }) => {
        if (input.type === "file") {
            setData({ ...data, avatar: input.files[0] });
        } else {
            setData({ ...data, [input.name]: input.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("fullname", data.fullname);
            formData.append("email", data.email);
            formData.append("password", data.password);
            if (data.avatar) {
                formData.append("avatar", data.avatar);
            }
    
            const response = await axios.post("http://localhost:8000/api/v1/users/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
    
            if (response.status === 200) {
                navigate("/");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data.message);
            }
        }
    };
    

    return (
        <div className="max-w-md mx-auto my-8 p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-white">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={data.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="fullname" className="block text-sm font-medium text-white">Full Name</label>
                    <input
                        type="text"
                        name="fullname"
                        value={data.fullname}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        required
                    />
                </div>
                <div className="mb-6">
                <label htmlFor="avatar" className="block text-sm font-medium text-white">Avatar</label>
                <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChange}
                    className="mt-1 block w-full text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
            </div>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
                    Register
                </button>
                <div className='flex my-2'>
                    <p className='text-blue-400'>Have an account?</p>
                    <Link
                        className='mx-4 text-blue-800 hover:text-blue-300'
                        to={"/"}
                    >
                        Login 
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default Signup;

