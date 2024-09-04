import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';
import axios from "axios";

const AddPost = ({ isOpen, onClose, addNewPost }) => {

  const [newpost, setnewPost] = useState({ title: '', content: '' });
  const [error, setError] = useState('');

  const editor = useRef(null);

  const fieldChanged = (e) => {
    setnewPost({ ...newpost, [e.target.name]: e.target.value });
  };

  const contentFieldChanged = (newContent) => {
    setnewPost({ ...newpost, content: newContent });
  };


  const createPost = async (e) => {
    try {

      e.preventDefault();
      const res = await axios.post("http://localhost:8000/api/v1/posts", newpost, { withCredentials: true })
      if (res.status == 200) {
        addNewPost(res.data.data)
        onClose();
      }
    } catch (error) {
      setError("Unauthorized request")
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="bg-gray-900 rounded-lg shadow-lg p-6 max-w-2xl w-full">
        <h3 className="text-xl font-semibold mb-4">What's on your mind?</h3>
        <form onSubmit={createPost}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-lg font-medium text-white">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter here"
              className="text-black mt-1 block w-full rounded-md pl-2 shadow-sm sm:text-sm"
              name="title"
              onChange={fieldChanged}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="block text-lg font-medium text-white">
              Post Content
            </label>
            <JoditEditor
              ref={editor}
              value={newpost.content}
              onChange={contentFieldChanged}
              className="text-black mt-1 block w-full rounded-md border border-gray-900 shadow-sm"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Post
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 ml-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddPost;
