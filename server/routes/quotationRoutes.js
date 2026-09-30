const express = require('express')
const quotationController = require('../controllers/quotationController')
const { requireAuth } = require('../middleware/authMiddleware')
const { validate } = require('../middleware/validate')
const { idParam, quotation } = require('../validation/schemas')

const router = express.Router()

const validateQuotationCreate = (req, res, next) => {
  if (req.body && (req.body.isUploadPayload || req.body.quotationFileName || req.body.quoteFile || req.body.attachments)) {
    return next()
  }
  return validate({ body: quotation })(req, res, next)
}

router.use(requireAuth)
const storageService = require('../services/storageService')
const tryRequire = (name) => { try { return require(name) } catch (_) { return null } }
const multer = tryRequire('multer')

if (multer) {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, storageService.getUploadsDir()),
    filename: (_req, file, cb) => {
      const ext = (file.originalname.match(/\.[^.]+$/) || [''])[0]
      const nameWithoutExt = file.originalname.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9._-]/g, '_')
      cb(null, `${Date.now()}-${nameWithoutExt}${ext}`)
    },
  })
  const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
  })

  router.post('/upload-file', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' })
    }
    const fileUrl = `/uploads/${req.file.filename}`
    return res.status(200).json({
      success: true,
      fileUrl,
      quotationFileName: req.file.originalname,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
    })
  })
}

router.get('/', quotationController.list)
router.patch('/:id/frontend-delete', validate({ params: idParam }), quotationController.frontendDelete)
router.get('/:id', validate({ params: idParam }), quotationController.getById)
router.post('/', validateQuotationCreate, quotationController.create)
router.post('/:id/approve', validate({ params: idParam }), quotationController.approve)
router.patch('/:id/approve', validate({ params: idParam }), quotationController.approve)
router.put('/:id', validate({ params: idParam, body: quotation }), quotationController.update)
router.patch('/:id', validate({ params: idParam, body: quotation }), quotationController.update)
router.delete('/:id', validate({ params: idParam }), quotationController.remove)

module.exports = router
