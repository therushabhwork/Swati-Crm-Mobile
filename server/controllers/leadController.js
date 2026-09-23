const leadService = require('../services/leadService')

const listLeads = async (req, res, next) => {
  try {
    const leads = await leadService.listLeads(req.user, req.query || {})
    res.json({
      success: true,
      data: leads,
    })
  } catch (error) {
    next(error)
  }
}

const getLeadById = async (req, res, next) => {
  try {
    const lead = await leadService.getLeadById(req.user, req.params.id)
    res.json({
      success: true,
      data: lead,
    })
  } catch (error) {
    next(error)
  }
}

const createLead = async (req, res, next) => {
  try {
    const lead = await leadService.createLead(req.user, req.body || {})
    res.status(201).json({
      success: true,
      data: lead,
    })
  } catch (error) {
    next(error)
  }
}

const updateLead = async (req, res, next) => {
  try {
    const lead = await leadService.updateLead(req.user, req.params.id, req.body || {})
    res.json({
      success: true,
      data: lead,
    })
  } catch (error) {
    next(error)
  }
}

const deleteLead = async (req, res, next) => {
  try {
    const removed = await leadService.deleteLead(req.user, req.params.id)
    res.json({
      success: true,
      data: removed,
    })
  } catch (error) {
    next(error)
  }
}

const frontendDeleteLead = async (req, res, next) => {
  try {
    const removed = await leadService.frontendDeleteLead(req.user, req.params.id)
    res.json({
      success: true,
      data: removed,
    })
  } catch (error) {
    next(error)
  }
}

const convertLeadToDeal = async (req, res, next) => {
  try {
    const result = await leadService.convertLeadToDeal(req.user, req.params.id)
    res.status(201).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const bulkAddRemark = async (req, res, next) => {
  try {
    const result = await leadService.bulkAddRemark(req.user, req.body || {})
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const bulkReassign = async (req, res, next) => {
  try {
    const result = await leadService.bulkReassign(req.user, req.body || {})
    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const importDirect = async (req, res, next) => {
  try {
    const { getMongoModel } = require('../models/mongoModels')
    const Lead = getMongoModel('leads')

    const records = req.body || []
    if (!Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Invalid records format' })
    }

    const ownerUserId = req.user.id || req.user._id
    const ownerCode = req.user.ownerCode || req.user.owner_code
    const companyId = req.user.companyId || 'default'

    const { getNextLegacyId } = require('../models/mongoModels')

    const inserts = await Promise.all(records.map(async (record) => {
      // 1. Create a shallow copy so we can safely delete keys
      const sanitizedRecord = { ...record }

      // 2. Strip out all internal/database fields that could cause duplicate key (500) errors
      delete sanitizedRecord._id
      delete sanitizedRecord.id
      delete sanitizedRecord.legacyId
      delete sanitizedRecord.__v
      delete sanitizedRecord.createdAt
      delete sanitizedRecord.updatedAt

      const nextLegacyId = await getNextLegacyId('leads')

      // 3. Strictly map the raw data directly into the DB and inject only ownership
      return {
        ...sanitizedRecord,
        id: nextLegacyId,
        legacyId: nextLegacyId,
        companyId,
        ownerUserId,
        ownerCode,
        createdBy: ownerUserId,
        status: sanitizedRecord.status || 'new',
        formData: sanitizedRecord // Inject fields into formData so mapLeadRow reads them correctly
        // Purposely leaving accountNo out if they mapped it from excel, we don't care
      }
    }))

    if (inserts.length > 0) {
      await Lead.insertMany(inserts)
    }

    res.json({
      success: true,
      message: `Successfully imported ${inserts.length} accounts.`,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  frontendDeleteLead,
  convertLeadToDeal,
  bulkAddRemark,
  bulkReassign,
  importDirect,
}
