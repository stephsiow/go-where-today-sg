const express = require("express")
const router = express.Router()

const ResponseController = require('../controllers/ResponseController')

router.get('/', ResponseController.index)
router.post('/show', ResponseController.show)
router.post('/store', ResponseController.store)

module.exports = router