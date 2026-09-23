const mongoose = require('mongoose');

async function revertLegacyIds() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/crm');
    console.log('Connected to DB');

    const db = mongoose.connection.db;
    const leadsCollection = db.collection('leads');

    // Find documents that we recently imported
    // For safety, we find those with accountCategory: 'MARKETING-SWATI' as they are all from the 59
    const docs = await leadsCollection.find({ 'formData.accountCategory': 'MARKETING-SWATI' }).toArray();

    console.log(`Found ${docs.length} imported records to revert keys.`);

    let updatedCount = 0;
    for (const doc of docs) {
      const formData = doc.formData || {};
      
      let modified = false;
      if (formData.accountName) {
        formData.name = formData.accountName;
        delete formData.accountName;
        modified = true;
      }
      if (formData.mobile) {
        formData.phone = formData.mobile;
        delete formData.mobile;
        modified = true;
      }
      
      if (modified) {
        await leadsCollection.updateOne(
          { _id: doc._id },
          { 
            $set: { 
              formData: formData
            } 
          }
        );
        updatedCount++;
      }
    }

    console.log(`Successfully reverted ${updatedCount} records back to name and phone in formData.`);
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

revertLegacyIds();
