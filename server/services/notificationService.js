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
  console.log('[NotificationService] Processing Notification')
  console.log(`- Sender ID: ${senderId}`)
  console.log(`- Unique Receiver IDs: ${uniqueReceiverIds.join(', ') || 'NONE'}`)
  console.log(`- Message: "${message}"`)
  console.log(`- Entity: ${entityType}/${entityId}`)
  console.log('=======================================')

  if (uniqueReceiverIds.length === 0) {
    console.warn('[NotificationService] No valid receivers. Aborting notification.')
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
    const onlineUserIds = new Set(onlineUsers.map(u => u.id))

    const onlineReceiverIds = uniqueReceiverIds.filter(id => onlineUserIds.has(id))
    const offlineReceiverIds = uniqueReceiverIds.filter(id => !onlineUserIds.has(id))

    console.log(`[NotificationService] Online Receivers (Socket): ${onlineReceiverIds.length > 0 ? onlineReceiverIds.join(', ') : 'NONE'}`)
    console.log(`[NotificationService] Offline Receivers (FCM): ${offlineReceiverIds.length > 0 ? offlineReceiverIds.join(', ') : 'NONE'}`)

    // 1. Send via Socket.IO for FOREGROUND users
    if (socketServer && onlineReceiverIds.length > 0) {
      records.forEach(record => {
        if (onlineReceiverIds.includes(record.receiverId)) {
          console.log(`[NotificationService] Emitting 'crm_notification' via Socket to user: ${record.receiverId}`)
          socketServer.emitToUser(record.receiverId, 'crm_notification', record)
        }
      })
    } else if (onlineReceiverIds.length > 0) {
      console.warn(`[NotificationService] Warning: onlineReceiverIds found, but socketServer is null/unavailable!`)
    }

    // 2. Send via Expo Push for BACKGROUND/CLOSED users
    if (offlineReceiverIds.length > 0) {
      const devices = await userDeviceRepository.getActiveDevicesForUsers(offlineReceiverIds)
      const messages = []

      console.log(`[NotificationService] Found ${devices.length} registered devices for offline users.`)

      for (const device of devices) {
        if (!Expo.isExpoPushToken(device.pushToken)) {
          console.warn(`[NotificationService] Invalid push token for user ${device.userId}: ${device.pushToken}`)
          continue
        }

        const record = records.find(r => r.receiverId === device.userId)
        
        messages.push({
          to: device.pushToken,
          sound: 'default',
          title: 'CRM',
          body: message,
          data: record || { notificationType, entityType, entityId },
        })
      }

      if (messages.length > 0) {
        console.log(`[NotificationService] Sending ${messages.length} chunked push notifications to Expo...`)
        const chunks = expo.chunkPushNotifications(messages)
        for (const chunk of chunks) {
          try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
            console.log(`[NotificationService] Expo Push Ticket Response:`, JSON.stringify(ticketChunk, null, 2))
            
            // Check for explicit errors in the ticket chunk
            ticketChunk.forEach((ticket, idx) => {
              if (ticket.status === 'error') {
                console.error(`[NotificationService] ERROR sending to ${chunk[idx].to}:`, ticket.message, ticket.details)
              }
            })
          } catch (pushErr) {
            console.error(`[NotificationService] FATAL EXPO PUSH ERROR:`, pushErr)
          }
        }
      } else {
        console.warn(`[NotificationService] No valid push tokens found for offline users. Notification dropped.`)
      }
    }
  } catch (err) {
    console.error('[NotificationService] Failed to process notifications:', err)
  }

  return records
}

module.exports = {
  createLeadNotificationMessage,
  notifyUsers,
}
