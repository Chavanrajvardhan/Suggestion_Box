import React, { useEffect, useState } from 'react'
import axios from "axios"
import Header from '../Header/Header.jsx'
import AddPost from "./AddPost.jsx"



function Home() {

  const [posts, setPosts] = useState([]);
  const [popup, setPopup] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null);


  const openCreatePostBox = () => setPopup(true);
  const closeCreatePostBox = () => setPopup(false)



  const addNewPost = (newPost) => {
    setPosts([newPost, ...posts])
  }

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/posts/getAllPosts", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          setPosts(res.data.data);
        }
      }).catch((error) => {
        console.log("error fetching posts")
      })
  }, []);


  const handlePostClick = (post) => {
    setSelectedPost(post)
  }

  const closePopup = () => {
    setSelectedPost(null);
  };


  return (
    <>
      <Header />
      <div className="bg-gray-900 p-6 text-white min-h-screen ">
        <div className="bg-red-600 p-4 rounded-md mb-6 mx-auto">
          <p className=" text-lg font-bold">Have something to say?</p>
          <p>Tell chaicode how they could make the product more useful to you.</p>
        </div>
        <div className="flex justify-between items-center mb-4 mx-auto">
          <input
            type="text"
            placeholder="Search for posts"
            className="w-full max-w-md p-2 bg-gray-800 rounded-md text-white focus:outline-none"
          />
          <button
            onClick={openCreatePostBox}
            className="ml-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md">
            Create A New Post
          </button>
          <AddPost
            isOpen={popup}
            onClose={closeCreatePostBox}
            addNewPost={addNewPost}
          />
        </div>


        <div className="space-y-4 mx-auto">
          {posts && posts.map((post) => (
            <div key={post.id} className="bg-gray-800 p-4 rounded-md"
              onClick={() => handlePostClick(post)}
            >
              <div className="flex justify-between items-center"

              >
                <div>
                  <h2 className="text-lg font-bold">{post.title}</h2>
                  <div
                    className="text-gray-300"
                    dangerouslySetInnerHTML={{ __html: post.content.slice(0, 50) + '...' }}
                  />
                  <p className="text-sm text-red-600 pt-1">{post.fullname} • {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-orange-400 text-lg font-bold">
                  <span>↑</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Popup */}
        {selectedPost && (
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
            onClick={closePopup}
          >
            <div
              className="bg-gray-700 text-white p-6 rounded-md max-w-xl w-full relative"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
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
              <p className="text-sm text-red-800  pt-2">{selectedPost.fullname} • {new Date(selectedPost.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

export default Home
