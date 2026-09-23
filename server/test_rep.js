const leadRepository = require('./repositories/leadRepository');
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/crm');
  const leads = await leadRepository.listAll();
  const bhugan = leads.find(l => 
    l.name === 'Bhugan Infracon Pvt Ltd' || 
    (l.formData && l.formData.name === 'Bhugan Infracon Pvt Ltd') || 
    l.accountName === 'Bhugan Infracon Pvt Ltd' || 
    l.customerName === 'Bhugan Infracon Pvt Ltd'
  );
  console.log(JSON.stringify(bhugan, null, 2));
  process.exit(0);
}
test();
