import connectDB from "../db/db.js"
import asyncHandler from "../utils/asyncHander.js";

const createPost = asyncHandler(async (req, res) => {
    //get data from frontend 
    //validate data 
    //saved it in datbase 
    //if not throw error 

    const db = await connectDB()
    let { title, content } = req.body;

    content = content.replace(/<\/?[^>]+(>|$)/g, "");

    console.log(content)
    if (!(title && content)) {
        console.log(true)
        return res.status(400).json({
            status: 400,
            success: false,
            message: "title and content required"
        })
    }

    const [rows] = await db.query(
        "INSERT INTO posts (owner, title, content) values (?, ?, ?)", //inser query dosnt return required data
        [req.user.id, title, content]
    )

    if (!rows || rows.affectedRows === 0) {
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Somthing went wrong while creating post"
        })
    }

    const [post] = await db.query(
        "SELECT * FROM posts WHERE id = ?", [rows.insertId]
    )

    if (!post) {
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Error while fetching data"
        })
    }

    return res.status(200).json({
        status: 200,
        success: true,
        data: post[0],
        message: "Post created successfully",
    })
})

const updatePost = asyncHandler(async (req, res) => {
    //get data from frontend 
    //validate 
    //query to database using post id
    //throw error 
    //update filed in database 

    const db = await connectDB()
    const { title, content } = req.body;
    const { id } = req.params

    if (!(id && title && content)) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "All fields are required",
        });
    }

    // Perform the update
    const [result] = await db.query(
        "UPDATE posts SET title = ?, content = ? WHERE id = ?",
        [title, content, id]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "Post not found or no changes made",
        });
    }

    // Fetch the updated post
    const [updatedPost] = await db.query(
        "SELECT * FROM posts WHERE id = ?",
        [id]
    );

    if (!updatedPost || updatedPost.length === 0) {
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Error while fetching updated post",
        });
    }

    // Return the updated post data
    return res.status(200).json({
        status: 200,
        success: true,
        data: updatedPost[0],
        message: "Post updated successfully",
    });
})

const deletePost = asyncHandler(async (req, res) => {
    //get post id from frontend 
    //query to data base 


    const db = await connectDB()
    const { id } = req.params
    console.log(id)

    if (!id) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Invalid post id"
        })
    }

    await db.query(
        "DELETE  FROM posts WHERE id = ?", [id]
    )

    return res.status(200).json({
        status: 200,
        success: true,
        message: "Post deleted successfully"
    });
})

const getUserPosts = asyncHandler(async (req, res) => {

    const db = await connectDB();

    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Invalid user id"
        })
    }

    const [posts] = await db.query(
        "SELECT * FROM posts WHERE owner = ?", [user_id]
    )

    if (!posts.length === 0) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "No posts found for this user",
        })
    }

    return res.status(200).json({
        status: 200,
        success: true,
        data: posts,
        message: "all user post fetched successfully"
    })
})


const getAllPosts = asyncHandler(async (req, res) => {
    const db = await connectDB();

    const [posts] = await db.query(
        `SELECT 
        posts.id,
        posts.owner, 
        posts.title, 
        posts.content, 
        posts.createdAt,
        users.username, 
        users.fullname, 
        users.email 
     FROM 
        posts 
     INNER JOIN 
        users 
     ON 
        posts.owner = users.id
        
     ORDER BY
        posts.createdAt DESC`
    );

    if (posts.length === 0) {
        return res.status(404).json({
            status: 404,
            success: false,
            message: "No posts found",
        });
    }

    return res.status(200).json({
        status: 200,
        success: true,
        data: posts,
        message: "All posts fetched successfully",
    });
})

export {
    createPost,
    updatePost,
    deletePost,
    getUserPosts,
    getAllPosts
}