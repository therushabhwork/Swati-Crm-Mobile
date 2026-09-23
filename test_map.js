const { mapLeadRow } = require('./server/repositories/leadRepository');

const record = {
  _id: "123",
  id: "123",
  legacyId: "123",
  formData: {
    name: "Bhugan Infracon Pvt Ltd",
    accountDate: "16-08-2024",
    phone: "12345"
  }
};

const mapped = mapLeadRow(record);
console.log(mapped.name);
console.log(mapped.phone);
