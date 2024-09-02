import { Router } from "express"
import {
    createPost,
    updatePost,
    deletePost,
    getUserPosts,
    getAllPosts
} from "../controllers/post.controllers.js"

import verifyJwt from "../middlewares/auth.middleware.js"


const router = Router()
router.use(verifyJwt) //Apply verifyJWT middleware to all routes in this file

router.route("/").post(createPost)
router.route("/updatepost/:id").patch(updatePost)
router.route("/deletepost/:id").delete(deletePost)
router.route("/getalluserposts/:user_id").get(getUserPosts)
router.route("/getAllPosts").get(getAllPosts)

export default router