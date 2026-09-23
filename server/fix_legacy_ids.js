const mongoose = require('mongoose');
const { getNextLegacyId } = require('./models/mongoModels');

async function fixLegacyIds() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/crm');
    console.log('Connected to DB');

    const db = mongoose.connection.db;
    const leadsCollection = db.collection('leads');

    // Find documents that were imported but missing legacyId
    const docs = await leadsCollection.find({ legacyId: { $exists: false } }).toArray();

    console.log(`Found ${docs.length} imported records missing legacyId.`);

    let updatedCount = 0;
    for (const doc of docs) {
      const legacyId = await getNextLegacyId('leads');

      // Also migrate formData keys if they have old keys
      const formData = doc.formData || {};
      if (formData.name) {
        formData.accountName = formData.name;
        delete formData.name;
      }
      if (formData.phone) {
        formData.mobile = formData.phone;
        delete formData.phone;
      }
      
      await leadsCollection.updateOne(
        { _id: doc._id },
        { 
          $set: { 
            id: legacyId,
            legacyId: legacyId,
            formData: formData
          } 
        }
      );
      updatedCount++;
    }

    console.log(`Successfully migrated ${updatedCount} records to use legacyId and fixed formData keys.`);
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixLegacyIds();
