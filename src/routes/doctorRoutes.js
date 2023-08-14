const express = require('express')
const router = express.Router()
const doctorController= require('../app/controllers/doctorController')

router.get('/schedule', doctorController.schedule)

//post schedule
router.post('/schedule', doctorController.book)

//list of doctor 
router.get('/', doctorController.info)

module.exports = router