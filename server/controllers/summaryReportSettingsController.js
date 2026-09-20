const { getMongoModel } = require('../models/mongoModels')
const { AppError } = require('../utils/appError')

const ok = (res, data) => res.json({ success: true, data })

const getSettings = async (req, res, next) => {
  try {
    const Settings = getMongoModel('summary_report_settings')
    const settings = await Settings.findOne({ userId: String(req.user.id) }).lean()
    
    // If no settings exist yet, return empty object
    ok(res, settings ? settings.config : {})
  } catch (e) {
    next(e)
  }
}

const updateSettings = async (req, res, next) => {
  try {
    const Settings = getMongoModel('summary_report_settings')
    const config = req.body

    const updated = await Settings.findOneAndUpdate(
      { userId: String(req.user.id) },
      { userId: String(req.user.id), config },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean()

    ok(res, updated.config)
  } catch (e) {
    next(e)
  }
}

module.exports = {
  getSettings,
  updateSettings,
}
