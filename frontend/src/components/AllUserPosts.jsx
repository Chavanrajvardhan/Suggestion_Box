import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import axios from 'axios';


function AllUserPosts() {
    const [userPosts, setUserPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);


    const location = useLocation();
    const userId = location.state?.userId;

    useEffect(() => {
        try {
            if (userId) {
                axios
                    .get(` http://localhost:8000/api/v1/posts/getalluserposts/${userId}`, {
                        withCredentials: true,
                    })
                    .then((res) => {
                        if (res.status === 200) {
                            setUserPosts(res.data.data);
                        }
                    }).catch((error) => {
                        console.log("error fetching posts")
                    })
            }

        } catch (error) {
            console.log(console.log(error))
        }
    }, []);


    const handlePostClick = (post) => {
        setSelectedPost(post);
    };

    const closePopup = () => {
        setSelectedPost(null);
    };


    const deletePost = async (postId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/v1/posts/deletepost/${postId}`, { withCredentials: true });
            if (response.status === 200) {
                 setUserPosts(userPosts.filter(post => post.id !== postId));
                if (selectedPost && selectedPost.id === postId) {
                    closePopup();
                }
            }
        } catch (error) {
            console.log("Error deleting post:", error);
        }
    };

    return (
        <>
            <div className="space-y-4 mx-auto">
                {userPosts && userPosts.map((post) => (
                    <div key={post.id} className="bg-gray-800 p-4 rounded-sm "
                        onClick={() => handlePostClick(post)}>
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className=" text-gray-300 text-lg font-bold">{post.title}</h2>
                                <div
                                    className="text-gray-300"
                                    dangerouslySetInnerHTML={{ __html: post.content.slice(0, 100) + '...' }}
                                />
                                <div className="flex items-center pt-2">
                                    <img
                                        src={post.avatar}
                                        alt={`${post.fullname}'s avatar`}
                                        className="w-10 h-10 rounded-full mr-4"
                                    />
                                    <p className="text-sm text-red-600">{post.fullname} • {new Date(post.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-orange-400 text-lg font-bold pr-2 ">
                                <MdDelete
                                    className='text-2xl cursor-pointer'
                                    onClick={() => deletePost(post.id)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {selectedPost && (
                <div
                    className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
                    onClick={closePopup}
                >
                    <div
                        className="bg-gray-700 text-white p-6 rounded-md max-w-xl w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={closePopup}
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
                        <div
                            className="mt-4"
                            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                        />
                        <div className="flex items-center pt-2">
                            <img
                                src={selectedPost.avatar}
                                alt={`${selectedPost.fullname}'s avatar`}
                                className="w-10 h-10 rounded-full mr-4"
                            />
                            <p className="text-sm text-red-600">{selectedPost.fullname} • {new Date(selectedPost.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AllUserPosts;
