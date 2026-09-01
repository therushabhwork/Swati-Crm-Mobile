const notificationRepository = require('../repositories/notificationRepository')

const createLeadNotificationMessage = ({ actorName, recordName, action }) => {
  if (action === 'created') {
    return `${actorName} created ${recordName}.`
  }

  return `${actorName} updated ${recordName}.`
}

const { Expo } = require('expo-server-sdk')
const expo = new Expo()
const userDeviceRepository = require('../repositories/userDeviceRepository')
const userRepository = require('../repositories/userRepository')

const notifyUsers = async ({ senderId, receiverIds, message, companyId, notificationType, entityType, entityId }) => {
  const uniqueReceiverIds = Array.from(new Set((receiverIds || []).filter(Boolean)))
  
  console.log('\n=======================================')
  console.log('[NOTIFICATION] Activity triggered')
  console.log(`[NOTIFICATION] Sender ID: ${senderId}`)
  console.log(`[NOTIFICATION] Receivers: [${uniqueReceiverIds.join(', ')}]`)
  console.log(`[NOTIFICATION] Message: "${message}"`)
  console.log(`[NOTIFICATION] Entity: ${entityType}/${entityId}`)
  console.log('=======================================')

  if (uniqueReceiverIds.length === 0) {
    console.warn('[NOTIFICATION] No valid receivers. Aborting notification.')
    return []
  }

  const records = await Promise.all(
    uniqueReceiverIds.map((receiverId) =>
        notificationRepository.createNotification({
          senderId,
          receiverId,
          message,
          companyId,
          notificationType,
          entityType,
          entityId,
        }))
  )

  try {
    const socketServer = require('../socket/socketServer').getSocketServer()
    const onlineUsers = await userRepository.listOnlineUsers()
    
    // Normalize IDs to strings for robust Set matching
    const onlineUserIds = new Set(onlineUsers.map(u => String(u.id)))
    const onlineReceiverIds = uniqueReceiverIds.map(String).filter(id => onlineUserIds.has(id))

    // 1. Send via WebSocket (UNCHANGED for existing web/mobile realtime mechanism)
    if (socketServer && onlineReceiverIds.length > 0) {
      records.forEach(record => {
        if (onlineReceiverIds.includes(String(record.receiverId))) {
          console.log(`[NOTIFICATION] Emitting 'crm_notification' via Socket to user: ${record.receiverId}`)
          socketServer.emitToUser(record.receiverId, 'crm_notification', record)
        }
      })
    }

    // 2. Mobile OS Push (Expo Push Service) sent UNCONDITIONALLY
    // Convert receiver IDs to numbers because the mobile app registers the device token with a numeric legacyId!
    const resolvedNumericIds = []
    for (const rid of uniqueReceiverIds) {
      const num = Number(rid)
      if (!isNaN(num)) {
        resolvedNumericIds.push(num)
      } else if (typeof rid === 'string' && rid.length === 24) {
        // It's a Mongoose ObjectId. We must translate it to the legacyId!
        try {
          const userRec = await userRepository.findRawUserById(rid)
          if (userRec && userRec.id) {
            resolvedNumericIds.push(Number(userRec.id))
          }
        } catch (e) {
          console.warn(`[NOTIFICATION] Failed to resolve legacyId for user ${rid}`)
        }
      }
    }
    
    const devices = await userDeviceRepository.getActiveDevicesForUsers(resolvedNumericIds)
    const messages = []

    console.log(`[NOTIFICATION] Mobile devices found: ${devices.length}`)

    for (const device of devices) {
      if (!Expo.isExpoPushToken(device.pushToken)) {
        console.warn(`[NOTIFICATION] Invalid push token for user ${device.userId}: ${device.pushToken}`)
        continue
      }

      console.log(`[NOTIFICATION] Platform: ${device.platform || 'android'}`)
      console.log(`[NOTIFICATION] Push token found for user ${device.userId}: yes`)
      console.log(`[NOTIFICATION] Token: ${device.pushToken.slice(0, 18)}...`)

      const record = records.find(r => String(r.receiverId) === String(device.userId))
      
      messages.push({
        to: device.pushToken,
        sound: 'default',
        title: 'New Activity',
        body: message,
        data: record || { notificationType, entityType, entityId },
        channelId: 'default', // Ensures it uses the Android channel we create
      })
    }

    if (messages.length > 0) {
      console.log(`[NOTIFICATION] Sending ${messages.length} mobile push notification(s)`)
      const chunks = expo.chunkPushNotifications(messages)
      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
          console.log(`[NOTIFICATION] Expo ticket:`)
          console.log(JSON.stringify(ticketChunk, null, 2))
          
          // Check for explicit errors in the ticket chunk
          ticketChunk.forEach((ticket, idx) => {
            if (ticket.status === 'error') {
              console.error(`[NOTIFICATION] ERROR sending to ${chunk[idx].to.slice(0, 18)}...:`, ticket.message, ticket.details)
            }
          })
        } catch (pushErr) {
          console.error(`[NOTIFICATION] FATAL EXPO PUSH ERROR:`, pushErr)
        }
      }
    } else {
      console.warn(`[NOTIFICATION] No valid push tokens found for receivers. Mobile Push dropped.`)
    }
    
  } catch (err) {
    console.error('[NOTIFICATION] Failed to process notifications:', err)
  }

  return records
}

module.exports = {
  createLeadNotificationMessage,
  notifyUsers,
}
