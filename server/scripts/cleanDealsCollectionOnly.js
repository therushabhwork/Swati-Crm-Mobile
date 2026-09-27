const path = require('path')
const dotenv = require('dotenv')

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') })

const mongoose = require('mongoose')
const { getMongoModel } = require('../models/mongoModels')

async function cleanDealsCollectionOnly() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crm'
    console.log(`Connecting to MongoDB at: ${mongoUri}`)
    await mongoose.connect(mongoUri)

    const Deal = getMongoModel('deals')
    const Sequence = getMongoModel('sequences')

    const countBefore = await Deal.countDocuments({})
    console.log(`Before cleanup -> Deals documents: ${countBefore}`)

    const result = await Deal.deleteMany({})
    console.log(`Cleanup complete -> Removed ${result.deletedCount || 0} documents from deals collection.`)

    const countAfter = await Deal.countDocuments({})
    console.log(`After cleanup -> Deals remaining: ${countAfter}`)

    // Reset legacy sequence counter for deals
    if (Sequence) {
      await Sequence.updateOne({ name: 'deals' }, { $set: { value: 0 } }, { upsert: true })
      console.log('Sequence counter for deals reset to 0.')
    }

    await mongoose.disconnect()
    console.log('MongoDB disconnected successfully.')
    process.exit(0)
  } catch (err) {
    console.error('Failed to clean deals collection:', err)
    process.exit(1)
  }
}

cleanDealsCollectionOnly()
