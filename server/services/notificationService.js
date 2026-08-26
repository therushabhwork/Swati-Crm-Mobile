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

const notifyUsers = async ({ senderId, receiverIds, message, companyId, notificationType, entityType, entityId }) => {
  const uniqueReceiverIds = Array.from(new Set((receiverIds || []).filter(Boolean)))

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

  // Send push notifications
  try {
    const devices = await userDeviceRepository.getActiveDevicesForUsers(uniqueReceiverIds)
    const messages = []

    for (const device of devices) {
      if (!Expo.isExpoPushToken(device.pushToken)) continue

      messages.push({
        to: device.pushToken,
        sound: 'default',
        title: 'CRM',
        body: message,
        data: { notificationType, entityType, entityId },
      })
    }

    if (messages.length > 0) {
      const chunks = expo.chunkPushNotifications(messages)
      for (const chunk of chunks) {
        await expo.sendPushNotificationsAsync(chunk).catch(console.error)
      }
    }
  } catch (err) {
    console.error('Failed to send push notifications:', err)
  }

  return records
}

module.exports = {
  createLeadNotificationMessage,
  notifyUsers,
}
