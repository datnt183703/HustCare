const express = require('express')
const router = express.Router()
const feedbackController= require("../app/controllers/feedbackController")

//feedback system
router.get("/", feedbackController.system)

//feedback post
router.post("/", feedbackController.addfeedback)

module.exports = router