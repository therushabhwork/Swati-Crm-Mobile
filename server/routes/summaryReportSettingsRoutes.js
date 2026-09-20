const express = require('express')
const { requireAuth } = require('../middleware/authMiddleware')
const controller = require('../controllers/summaryReportSettingsController')

const router = express.Router()

router.use(requireAuth)
router.get('/', controller.getSettings)
router.put('/', controller.updateSettings)

module.exports = router
