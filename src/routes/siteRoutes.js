const express = require('express')
const router = express.Router()
const siteController= require("../app/controllers/siteController")

//views of admin page
router.get("/admin", siteController.adminpage)

//login post
router.post("/login", siteController.login)

//register post
router.post("/register", siteController.register)

//logout
router.get('/logout', siteController.logout)

//home
router.get('/', siteController.index)

module.exports = router