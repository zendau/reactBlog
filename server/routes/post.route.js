const Router = require('express').Router
const PostController = require('../controllers/post.controller')
const router = new Router()

const authMiddleware = require("../middlewares/auth.middleware")

router.post("/create", PostController.create)
router.post("/edit", PostController.edit)
router.get("/delete/:id", PostController.delete)
router.get("/get/:id", PostController.getOne)
router.get("/getUserPosts/", PostController.getUserPosts)
router.get("/getAllPosts", PostController.getAllPosts)
router.get("/getLimitPosts", PostController.getLimitPosts)


module.exports = router