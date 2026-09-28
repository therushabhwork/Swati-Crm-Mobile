const { getMongoModel, getNextLegacyId } = require('../models/mongoModels')
const { AppError } = require('../utils/appError')
const leadRepository = require('../repositories/leadRepository')
const { assertRecordAccess, isPrivilegedRole, toNumberOrNull } = require('../security/accessScope')

const Remark = getMongoModel('remarks')
const RemarkReminder = getMongoModel('remark_reminders')
const User = getMongoModel('users')
const Deal = getMongoModel('deals')
const AuditLog = getMongoModel('audit_log')

const byLegacyId = (id) => {
  const numericId = toNumberOrNull(id)
  if (numericId === null) return { _id: null }
  return {
    $or: [
      { legacyId: numericId },
      { id: numericId },
    ],
  }
}
const toNumber = toNumberOrNull

const normalizeText = (value) => String(value || '').trim()
const normalizeNameKey = (value) => normalizeText(value).toLowerCase().replace(/\s+/g, ' ')

const normalizeReminderUserRefs = (reminder = {}) => {
  const refs = []
  const addRef = (ref) => {
    if (!ref) return
    if (typeof ref === 'object') {
      const id = normalizeText(ref.id ?? ref.legacyId ?? ref.value)
      const name = normalizeText(ref.name || ref.ownerDisplayName || ref.label || ref.username || ref.email)
      const ownerCode = normalizeText(ref.ownerCode || ref.owner_code)
      if (id || name || ownerCode) {
        refs.push({
          id,
          name,
          ownerCode,
          username: normalizeText(ref.username),
          email: normalizeText(ref.email),
        })
      }
      return
    }

    const id = normalizeText(ref)
    if (id) refs.push({ id, name: '', ownerCode: '', username: '', email: '' })
  }

  if (Array.isArray(reminder.assignedUsers)) {
    reminder.assignedUsers.forEach(addRef)
  }

  if (Array.isArray(reminder.assignedUserIds)) {
    reminder.assignedUserIds.forEach((id) => {
      if (!refs.some((ref) => ref.id === normalizeText(id))) addRef(id)
    })
  }

  addRef(reminder.assignedTo)

  const seen = new Set()
  return refs.filter((ref) => {
    const key = ref.ownerCode ? `code:${ref.ownerCode}` : ref.id ? `id:${ref.id}` : `name:${normalizeNameKey(ref.name)}`
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const mapReminder = (reminder) => {
  if (!reminder) return null
  return {
    ...reminder,
    id: reminder.legacyId ?? reminder.id,
    accountId: reminder.accountId,
    account_id: reminder.accountId,
    remark_id: reminder.remarkId,
    remarkId: reminder.remarkId,
    reminder_date: reminder.reminderDate,
    reminder_time: reminder.reminderTime,
    assigned_to: reminder.assignedTo,
    assignedOwnerName: reminder.assignedOwnerName,
    assigned_owner_name: reminder.assignedOwnerName,
    assignedOwnerCode: reminder.assignedOwnerCode,
    assigned_owner_code: reminder.assignedOwnerCode,
    reminder_note: reminder.reminderNote,
    is_completed: Boolean(reminder.isCompleted),
    company_id: reminder.companyId,
    owner_user_id: reminder.ownerUserId,
    created_at: reminder.createdAt,
    updated_at: reminder.updatedAt,
  }
}

const mapRemark = async (remark) => {
  if (!remark) return null
  const createdBy = remark.createdBy ?? remark.created_by
  const user = createdBy ? await User.findOne(byLegacyId(createdBy)).lean() : null

  return {
    ...remark,
    id: remark.legacyId ?? remark.id,
    account_id: remark.accountId,
    accountId: remark.accountId,
    account_name: remark.accountName || '',
    accountName: remark.accountName || '',
    deal_id: remark.dealId,
    dealId: remark.dealId,
    deal_name: remark.dealName || '',
    dealName: remark.dealName || '',
    related_entity_type: remark.relatedEntityType || (remark.dealId ? 'deal' : 'account'),
    relatedEntityType: remark.relatedEntityType || (remark.dealId ? 'deal' : 'account'),
    created_by: createdBy,
    createdBy,
    created_by_name: remark.createdByName || user?.name || user?.username || '',
    createdByName: remark.createdByName || user?.name || user?.username || '',
    created_by_email: remark.createdByEmail || user?.email || '',
    createdByEmail: remark.createdByEmail || user?.email || '',
    account_owner_id: remark.accountOwnerId || null,
    accountOwnerId: remark.accountOwnerId || null,
    account_owner_name: remark.accountOwnerName || '',
    accountOwnerName: remark.accountOwnerName || '',
    account_owner_email: remark.accountOwnerEmail || '',
    accountOwnerEmail: remark.accountOwnerEmail || '',
    deal_owner_id: remark.dealOwnerId || null,
    dealOwnerId: remark.dealOwnerId || null,
    deal_owner_name: remark.dealOwnerName || '',
    dealOwnerName: remark.dealOwnerName || '',
    deal_owner_email: remark.dealOwnerEmail || '',
    dealOwnerEmail: remark.dealOwnerEmail || '',
    account_created_by_id: remark.accountCreatedById || null,
    accountCreatedById: remark.accountCreatedById || null,
    account_created_by_name: remark.accountCreatedByName || '',
    accountCreatedByName: remark.accountCreatedByName || '',
    account_created_by_email: remark.accountCreatedByEmail || '',
    accountCreatedByEmail: remark.accountCreatedByEmail || '',
    deal_created_by_id: remark.dealCreatedById || null,
    dealCreatedById: remark.dealCreatedById || null,
    deal_created_by_name: remark.dealCreatedByName || '',
    dealCreatedByName: remark.dealCreatedByName || '',
    deal_created_by_email: remark.dealCreatedByEmail || '',
    dealCreatedByEmail: remark.dealCreatedByEmail || '',
    company_id: remark.companyId,
    companyId: remark.companyId,
    owner_user_id: remark.ownerUserId,
    ownerUserId: remark.ownerUserId,
    project_id: remark.projectId,
    workflow_id: remark.workflowId,
    assignment_mode: remark.assignmentMode,
    assigned_user_ids: remark.assignedUserIds || [],
    assigned_user_types: remark.assignedUserTypes || [],
    assigned_user_groups: remark.assignedUserGroups || [],
    created_at: remark.createdAt,
    updated_at: remark.updatedAt,
  }
}

class RemarkService {
  async findUserByRef(userId, userCode, userNameStr) {
    const numericId = toNumber(userId)
    if (numericId !== null) {
      const found = await User.findOne(byLegacyId(numericId)).lean()
      if (found) return found
    }
    const cleanCode = normalizeText(userCode)
    if (cleanCode) {
      const found = await User.findOne({ $or: [{ ownerCode: cleanCode }, { owner_code: cleanCode }, { legacyId: toNumber(cleanCode) }] }).lean()
      if (found) return found
    }
    const cleanName = normalizeNameKey(userNameStr)
    if (cleanName) {
      const escapedName = cleanName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const found = await User.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${escapedName}$`, 'i') } },
          { username: { $regex: new RegExp(`^${escapedName}$`, 'i') } },
          { email: { $regex: new RegExp(`^${escapedName}$`, 'i') } },
        ]
      }).lean()
      if (found) return found
    }
    return null
  }

  async getAccessibleLead(accountId, actor) {
    const lead = leadRepository.findLeadByIdForActor
      ? await leadRepository.findLeadByIdForActor(accountId, actor, { companyWide: isPrivilegedRole(actor?.role) })
      : await leadRepository.findLeadById(accountId)

    if (!lead) {
      throw new AppError('Account not found or not accessible', 404)
    }

    return lead
  }

  async getRemarkById(remarkId, actor) {
    const remark = await mapRemark(await Remark.findOne({
      ...byLegacyId(remarkId),
      companyId: actor.companyId || 1,
    }).lean())

    if (!remark) {
      throw new AppError('Remark not found', 404)
    }

    assertRecordAccess(actor, remark, 'remark')
    return remark
  }

  async getReminderById(reminderId, actor) {
    const reminder = mapReminder(await RemarkReminder.findOne({
      ...byLegacyId(reminderId),
      companyId: actor.companyId || 1,
    }).lean())

    if (!reminder) {
      throw new AppError('Reminder not found', 404)
    }

    assertRecordAccess(actor, reminder, 'remark reminder')
    return reminder
  }

  formatReminderNote(reminder = {}) {
    const detailLines = [
      reminder.actionType ? `Action: ${reminder.actionType}` : '',
      reminder.priority ? `Priority: ${reminder.priority}` : '',
      reminder.status ? `Status: ${reminder.status}` : '',
      reminder.followupType ? `Followup Type: ${reminder.followupType}` : '',
    ].filter(Boolean)
    const note = String(reminder.note || '').trim()
    if (detailLines.length === 0) return note
    return note ? `${detailLines.join('\n')}\n\n${note}` : detailLines.join('\n')
  }

  normalizeAssignment(assignment = {}) {
    const allowedModes = new Set(['user', 'type', 'group'])
    const mode = allowedModes.has(assignment.mode) ? assignment.mode : null
    const normalizeList = (value) => (
      Array.isArray(value)
        ? Array.from(new Set(value.map((entry) => String(entry || '').trim()).filter(Boolean)))
        : []
    )

    return {
      mode,
      userIds: normalizeList(assignment.userIds || assignment.selectedUserIds || assignment.expandedUserIds),
      userTypes: normalizeList(assignment.userTypes || assignment.selectedUserTypes),
      userGroups: normalizeList(assignment.userGroups || assignment.selectedUserGroups),
    }
  }

  async createRemark(remarkData) {
    const { actor, accountId, dealId, category = 'general', content, createdBy, reminder } = remarkData
    const assignment = this.normalizeAssignment(remarkData.assignment)
    if (!actor || (!accountId && !dealId) || !content) {
      throw new AppError('Account ID or Deal ID and content are required', 400)
    }

    let lead = null
    let dealRecord = null
    let resolvedAccountId = accountId

    if (dealId) {
      dealRecord = await Deal.findOne(byLegacyId(dealId)).lean()
      if (dealRecord && !resolvedAccountId && dealRecord.accountId) {
        resolvedAccountId = dealRecord.accountId
      }
    }

    if (resolvedAccountId) {
      try {
        lead = await this.getAccessibleLead(resolvedAccountId, actor)
      } catch (_err) {
        // If lead fetch fails for deal remark, proceed with deal record
      }
    }

    if (dealRecord && !lead) {
      const LeadModel = getMongoModel('leads')
      const searchNo = dealRecord.customerNumber || dealRecord.data?.customerNumber || dealRecord.customerCode
      const searchName = dealRecord.customerName || dealRecord.data?.customerName || dealRecord.customer
      let matchedLead = null
      if (searchNo) {
        matchedLead = await LeadModel.findOne({
          $or: [
            { legacyId: toNumber(searchNo) },
            { accountNo: searchNo },
            { accountNumber: searchNo },
            { 'formData.accountNo': searchNo }
          ]
        }).lean()
      }
      if (!matchedLead && searchName) {
        matchedLead = await LeadModel.findOne({
          $or: [
            { customerName: searchName },
            { accountName: searchName },
            { 'formData.accountName': searchName }
          ]
        }).lean()
      }
      if (matchedLead) {
        lead = matchedLead
        resolvedAccountId = matchedLead.legacyId || matchedLead.id
      }
    }

    // 1. Account Details Resolution (from lead if available)
    let accountOwnerId = null
    let accountOwnerName = ''
    let accountOwnerEmail = ''
    let accountCreatedById = null
    let accountCreatedByName = ''
    let accountCreatedByEmail = ''
    let resolvedAccountName = ''

    if (lead) {
      const lFormData = lead.formData && typeof lead.formData === 'object' ? lead.formData : {}

      resolvedAccountName = lead.accountName || lFormData.accountName || lead.customerName || lead.company || lead.name || ''

      const leadOwnerNameStr = lead.ownerName || lead.accountOwner || lFormData.accountOwner || lFormData.accountOwnerName || ''
      const leadOwnerUserId = lead.assignedTo || lead.ownerUserId || lead.ownerId || lFormData.ownerId || lead.assignedUserId
      const leadOwnerCode = lead.ownerCode || lead.accountOwnerCode || lFormData.ownerCode || lFormData.accountOwnerCode

      const accountOwnerUser = await this.findUserByRef(null, null, leadOwnerNameStr) || await this.findUserByRef(leadOwnerUserId, leadOwnerCode, null)

      accountOwnerName = leadOwnerNameStr || accountOwnerUser?.name || accountOwnerUser?.username || ''
      accountOwnerEmail = accountOwnerUser?.email || lead.userEmail || lead.createdUserBy || lFormData.userEmail || lFormData.createdUserBy || ''
      accountOwnerId = accountOwnerUser?.legacyId || accountOwnerUser?.id || leadOwnerUserId || null

      const leadCreatedByNameStr = lead.createdByUserName || lFormData.createdByUserName || lead.addedBy || lead.createdByName || ''
      const leadCreatedByUserId = lead.createdByUserId || lead.createdBy || lFormData.createdByUserId

      const accountCreatorUser = await this.findUserByRef(null, null, leadCreatedByNameStr) || await this.findUserByRef(leadCreatedByUserId, null, null)

      accountCreatedByName = leadCreatedByNameStr || accountCreatorUser?.name || accountCreatorUser?.username || ''
      accountCreatedByEmail = accountCreatorUser?.email || lead.createdUserBy || lead.userEmail || lFormData.createdUserBy || lFormData.userEmail || ''
      accountCreatedById = accountCreatorUser?.legacyId || accountCreatorUser?.id || leadCreatedByUserId || null
    } else if (dealRecord) {
      resolvedAccountName = dealRecord.accountName || dealRecord.customerName || dealRecord.data?.accountName || dealRecord.data?.customerName || ''
    }

    // 2. Deal Details Resolution (from dealRecord ONLY if dealRecord / dealId is present)
    let dealOwnerId = null
    let dealOwnerName = ''
    let dealOwnerEmail = ''
    let dealCreatedById = null
    let dealCreatedByName = ''
    let dealCreatedByEmail = ''
    let resolvedDealName = ''

    if (dealRecord) {
      const dData = dealRecord.data && typeof dealRecord.data === 'object' ? dealRecord.data : {}

      resolvedDealName = dData.title || dData.name || dData.projectName || dealRecord.projectName || dealRecord.title || dealRecord.dealName || ''

      const dealOwnerNameStr = dData.dealOwner || dData.ownerName || dData.assignedUserName || dealRecord.dealOwner || dealRecord.ownerName || ''
      const dealOwnerUserId = dData.assignedTo || dData.ownerUserId || dealRecord.ownerUserId || dealRecord.assignedTo

      const dealOwnerUser = await this.findUserByRef(null, null, dealOwnerNameStr) || await this.findUserByRef(dealOwnerUserId, null, null)

      dealOwnerName = dealOwnerNameStr || dealOwnerUser?.name || dealOwnerUser?.username || ''
      dealOwnerEmail = dealOwnerUser?.email || ''
      dealOwnerId = dealOwnerUser?.legacyId || dealOwnerUser?.id || dealOwnerUserId || null

      const dealCreatedByNameStr = dData.createdByName || dData.addedBy || dealRecord.createdByName || dealRecord.addedBy || ''
      const dealCreatedByUserId = dData.createdBy || dealRecord.createdBy

      const dealCreatorUser = await this.findUserByRef(null, null, dealCreatedByNameStr) || await this.findUserByRef(dealCreatedByUserId, null, null)

      dealCreatedByName = dealCreatedByNameStr || dealCreatorUser?.name || dealCreatorUser?.username || ''
      dealCreatedByEmail = dealCreatorUser?.email || ''
      dealCreatedById = dealCreatorUser?.legacyId || dealCreatorUser?.id || dealCreatedByUserId || null
    }

    // 3. Resolve Remark Creator (Logged-in User adding the remark)
    const remarkCreatorUserId = createdBy || actor?.id
    const remarkCreatorUser = await this.findUserByRef(remarkCreatorUserId, actor?.ownerCode, actor?.name)
    const resolvedRemarkCreatedByName = remarkCreatorUser?.name || remarkCreatorUser?.username || actor?.name || ''
    const resolvedRemarkCreatedByEmail = remarkCreatorUser?.email || actor?.email || ''

    const legacyId = await getNextLegacyId('remarks')
    const companyId = actor.companyId || dealRecord?.companyId || lead?.companyId || 1
    const now = new Date()

    const remark = await Remark.create({
      legacyId,
      accountId: resolvedAccountId ? toNumber(resolvedAccountId) : null,
      accountName: resolvedAccountName,
      dealId: dealId ? toNumber(dealId) : null,
      dealName: resolvedDealName,
      relatedEntityType: dealId ? 'deal' : 'account',
      category,
      content,
      createdBy: toNumber(remarkCreatorUserId),
      createdByName: resolvedRemarkCreatedByName,
      createdByEmail: resolvedRemarkCreatedByEmail,

      // Account Owner & Creator
      accountOwnerId: accountOwnerId ? toNumber(accountOwnerId) : null,
      accountOwnerName,
      accountOwnerEmail,
      accountCreatedById: accountCreatedById ? toNumber(accountCreatedById) : null,
      accountCreatedByName,
      accountCreatedByEmail,

      // Deal Owner & Creator (Strictly null / empty when dealId is null)
      dealOwnerId: dealOwnerId ? toNumber(dealOwnerId) : null,
      dealOwnerName,
      dealOwnerEmail,
      dealCreatedById: dealCreatedById ? toNumber(dealCreatedById) : null,
      dealCreatedByName,
      dealCreatedByEmail,

      companyId,
      ownerUserId: actor.id,
      projectId: dealRecord?.projectId || lead?.projectId || null,
      workflowId: remarkData.workflowId || dealRecord?.workflowId || lead?.workflowId || null,
      assignmentMode: assignment.mode,
      assignedUserIds: assignment.userIds,
      assignedUserTypes: assignment.userTypes,
      assignedUserGroups: assignment.userGroups,
      createdAt: now,
      updatedAt: now,
    })

    const reminderUserRefs = reminder ? normalizeReminderUserRefs(reminder) : []

    if (reminder && reminder.date && reminder.time && reminderUserRefs.length > 0) {
      const numericUserIds = Array.from(new Set(reminderUserRefs.map((ref) => toNumber(ref.id)).filter((entry) => entry !== null)))
      const ownerCodes = Array.from(new Set(reminderUserRefs.map((ref) => ref.ownerCode).filter(Boolean)))
      const assignedUserFilters = []
      if (numericUserIds.length > 0) {
        assignedUserFilters.push({ legacyId: { $in: numericUserIds } }, { id: { $in: numericUserIds } })
      }
      if (ownerCodes.length > 0) {
        assignedUserFilters.push({ ownerCode: { $in: ownerCodes } }, { owner_code: { $in: ownerCodes } })
      }

      const assignedUsers = assignedUserFilters.length > 0
        ? await User.find({ $or: assignedUserFilters }).lean()
        : []
      const assignedUserById = new Map(assignedUsers.map((user) => [toNumber(user.legacyId || user.id), user]))
      const assignedUserByOwnerCode = new Map(assignedUsers.flatMap((user) => {
        const code = normalizeText(user.ownerCode || user.owner_code)
        return code ? [[code, user]] : []
      }))
      const assignedUserByName = new Map(assignedUsers.flatMap((user) => {
        const names = [user.name, user.username, user.email].map(normalizeNameKey).filter(Boolean)
        return names.map((name) => [name, user])
      }))

      for (const reminderUserRef of reminderUserRefs) {
        const numericRefId = toNumber(reminderUserRef.id)
        const assignedUser = (
          (numericRefId !== null ? assignedUserById.get(numericRefId) : null)
          || (reminderUserRef.ownerCode ? assignedUserByOwnerCode.get(reminderUserRef.ownerCode) : null)
          || assignedUserByName.get(normalizeNameKey(reminderUserRef.name))
          || null
        )
        const assignedUserId = toNumber(assignedUser?.legacyId || assignedUser?.id)
          ?? numericRefId
          ?? reminderUserRef.id
          ?? reminderUserRef.ownerCode
          ?? reminderUserRef.name
        const assignedOwnerName = assignedUser?.name || reminderUserRef.name || reminderUserRef.username || reminderUserRef.email || ''
        const assignedOwnerCode = assignedUser?.ownerCode || assignedUser?.owner_code || reminderUserRef.ownerCode || null

        await RemarkReminder.create({
          legacyId: await getNextLegacyId('remark_reminders'),
          remarkId: legacyId,
          accountId: toNumber(accountId),
          reminderDate: reminder.date,
          reminderTime: reminder.time,
          assignedTo: assignedUserId,
          assignedOwnerName,
          assignedOwnerCode,
          reminderNote: this.formatReminderNote(reminder),
          closeOldReminders: Boolean(reminder.closeOldReminders),
          isCompleted: false,
          createdBy,
          companyId,
          ownerUserId: assignedUserId,
          projectId: lead.projectId || null,
          workflowId: remarkData.workflowId || lead.workflowId || null,
          createdAt: now,
          updatedAt: now,
        })
      }
    }

    await this.logAudit({
      actorId: createdBy,
      companyId,
      action: 'CREATE',
      entityType: 'remark',
      entityId: String(legacyId),
      changes: { content, category, assignment },
    })

    return mapRemark(remark.toObject())
  }

  canSeeReminder(actor, reminder) {
    if (!actor) return false
    if (isPrivilegedRole(actor.role)) return true
    const actorId = toNumber(actor.id)
    return (
      reminder.ownerUserId === actorId
      || reminder.assignedTo === actorId
      || reminder.createdBy === actorId
    )
  }

  async listRemarkReminders(actor) {
    const companyId = actor.companyId || 1
    const baseFilter = { companyId }

    if (!isPrivilegedRole(actor.role)) {
      const actorId = toNumber(actor.id)
      baseFilter.$or = [
        { assignedTo: actorId },
        { ownerUserId: actorId },
        { createdBy: actorId },
      ]
    }

    const records = await RemarkReminder
      .find(baseFilter)
      .sort({ reminderDate: 1, reminderTime: 1, legacyId: 1 })
      .lean()

    const remarkIds = Array.from(new Set(records.map((record) => toNumber(record.remarkId)).filter(Boolean)))
    const remarks = remarkIds.length
      ? await Remark.find({ legacyId: { $in: remarkIds }, companyId }).lean()
      : []
    const remarkById = new Map(remarks.map((remark) => [toNumber(remark.legacyId), remark]))

    return records
      .filter((record) => this.canSeeReminder(actor, record))
      .map((record) => {
        const remark = remarkById.get(toNumber(record.remarkId)) || null
        const mapped = mapReminder(record)
        const accountId = mapped.accountId || remark?.accountId || ''
        return {
          ...mapped,
          accountId,
          account_id: accountId,
          remarkContent: remark?.content || '',
          category: remark?.category || '',
          assignmentMode: remark?.assignmentMode || '',
          assignedUserIds: remark?.assignedUserIds || [],
          assignedUserTypes: remark?.assignedUserTypes || [],
          assignedUserGroups: remark?.assignedUserGroups || [],
        }
      })
  }

  async getRemarksByAccount(accountId, actor) {
    await this.getAccessibleLead(accountId, actor)
    const remarks = await Remark
      .find({ accountId: toNumber(accountId), companyId: actor.companyId || 1 })
      .sort({ createdAt: -1, legacyId: -1 })
      .lean()

    const mappedRemarks = []
    for (const remark of remarks) {
      const mappedRemark = await mapRemark(remark)
      const reminders = await RemarkReminder.find({ remarkId: mappedRemark.id, companyId: actor.companyId || 1 }).lean()
      mappedRemarks.push({
        ...mappedRemark,
        reminders: reminders.map(mapReminder),
      })
    }

    return mappedRemarks
  }

  async updateRemark(remarkId, updateData) {
    const { actor, content, category, createdBy } = updateData
    await this.getRemarkById(remarkId, actor)
    const updates = { updatedAt: new Date() }
    if (content !== undefined) updates.content = content
    if (category !== undefined) updates.category = category

    const updatedRemark = await Remark.findOneAndUpdate(
      { ...byLegacyId(remarkId), companyId: actor.companyId || 1 },
      { $set: updates },
      { new: true }
    ).lean()

    if (!updatedRemark) {
      throw new AppError('Remark not found', 404)
    }

    await this.logAudit({
      actorId: createdBy,
      companyId: actor.companyId || 1,
      action: 'UPDATE',
      entityType: 'remark',
      entityId: String(remarkId),
      changes: { content, category },
    })

    return mapRemark(updatedRemark)
  }

  async deleteRemark(remarkId, actor) {
    await this.getRemarkById(remarkId, actor)
    await RemarkReminder.deleteMany({ remarkId: toNumber(remarkId), companyId: actor.companyId || 1 })
    await Remark.deleteOne({ ...byLegacyId(remarkId), companyId: actor.companyId || 1 })
    await this.logAudit({
      actorId: actor.id,
      companyId: actor.companyId || 1,
      action: 'DELETE',
      entityType: 'remark',
      entityId: String(remarkId),
    })
    return { success: true, message: 'Remark deleted successfully' }
  }

  async createReminder(reminderId, updateData) {
    const { actor, isCompleted, reminderDate, reminderTime, reminderNote } = updateData
    await this.getReminderById(reminderId, actor)
    const updates = { updatedAt: new Date() }
    if (isCompleted !== undefined) updates.isCompleted = Boolean(isCompleted)
    if (reminderDate !== undefined) updates.reminderDate = reminderDate
    if (reminderTime !== undefined) updates.reminderTime = reminderTime
    if (reminderNote !== undefined) updates.reminderNote = reminderNote

    const updatedReminder = await RemarkReminder.findOneAndUpdate(
      { ...byLegacyId(reminderId), companyId: actor.companyId || 1 },
      { $set: updates },
      { new: true }
    ).lean()

    if (!updatedReminder) {
      throw new AppError('Reminder not found', 404)
    }

    return mapReminder(updatedReminder)
  }

  async logAudit(auditData) {
    const { actorId, companyId, action, entityType, entityId, changes } = auditData
    try {
      await AuditLog.create({
        legacyId: await getNextLegacyId('audit_log'),
        actorId,
        companyId: companyId || 1,
        action,
        entityType,
        entityId,
        changes: changes || {},
        createdAt: new Date(),
      })
    } catch (_error) {
      // Audit logging should never block user-facing CRM actions.
    }
  }

  async getAllRemarks(actor, query = {}) {
    const companyId = actor?.companyId || 1
    const baseFilter = { companyId }

    const records = await Remark
      .find(baseFilter)
      .sort({ createdAt: -1, legacyId: -1 })
      .limit(200)
      .lean()

    const visibleRecords = records.filter((remark) => this.canSeeRemark(actor, remark))
    const mapped = []
    for (const remark of visibleRecords) {
      mapped.push(await mapRemark(remark))
    }
    return mapped
  }

  canSeeRemark(actor, remark) {
    if (!actor) return false
    if (isPrivilegedRole(actor.role)) return true
    return (
      remark.ownerUserId === actor.id
      || remark.createdBy === actor.id
      || !remark.assignmentMode
      || (Array.isArray(remark.assignedUserIds) && remark.assignedUserIds.includes(String(actor.id)))
    )
  }

  async getRemarksHistory(accountId, limit = 50, offset = 0, actor = null) {
    await this.getAccessibleLead(accountId, actor)
    const baseFilter = { accountId: toNumber(accountId), companyId: actor.companyId || 1 }
    const records = await Remark
      .find(baseFilter)
      .sort({ createdAt: -1, legacyId: -1 })
      .skip(Math.max(0, Number(offset) || 0))
      .limit(Math.max(1, Number(limit) || 50))
      .lean()

    const visibleRecords = records.filter((remark) => this.canSeeRemark(actor, remark))
    const remarks = []
    for (const remark of visibleRecords) {
      remarks.push(await mapRemark(remark))
    }

    return {
      remarks,
      total: await Remark.countDocuments(baseFilter),
    }
  }

  async getRemarksByDeal(dealId, limit = 50, offset = 0, actor = null) {
    const baseFilter = { dealId: toNumber(dealId), companyId: actor?.companyId || 1 }
    const records = await Remark
      .find(baseFilter)
      .sort({ createdAt: -1, legacyId: -1 })
      .skip(Math.max(0, Number(offset) || 0))
      .limit(Math.max(1, Number(limit) || 50))
      .lean()

    const visibleRecords = records.filter((remark) => this.canSeeRemark(actor, remark))
    const remarks = []
    for (const remark of visibleRecords) {
      remarks.push(await mapRemark(remark))
    }

    return {
      remarks,
      total: await Remark.countDocuments(baseFilter),
    }
  }
}

module.exports = new RemarkService()
