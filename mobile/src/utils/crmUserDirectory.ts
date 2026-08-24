export const toSlug = (value: string) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const stripOwnerCodePrefix = (value: string) => String(value || '')
  .trim()
  .replace(/^\d{4,}\s*-\s*/u, '');

export const normalizeCrmUserName = (value: string) => stripOwnerCodePrefix(value)
  .trim()
  .toLowerCase()
  .replace(/\s+/g, ' ');

const CRM_DIRECTORY_USERS = [
  { ownerCode: '1001', name: 'Atish Shah', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: [] },
  { ownerCode: '1002', name: 'Hasmukh Chauhan', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: [] },
  { ownerCode: '1003', name: 'Jagruti Parmar', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: ['Jagurti Parmar'] },
  { ownerCode: '1004', name: 'Jay Pandya', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: [] },
  { ownerCode: '1005', name: 'Kanubhai Shah', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: ['Kanu Shah'] },
  { ownerCode: '1006', name: 'Keval V Shah', role: 'admin', userGroup: 'Back Office', userType: 'Manager', aliases: [] },
  { ownerCode: '1017', name: 'Kuldeep Nayi', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: [] },
  { ownerCode: '1007', name: 'Krunal Patel', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: ['Krunal patel'] },
  { ownerCode: '1008', name: 'Monali Pataliya', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: [] },
  { ownerCode: '1015', name: 'Naim Vhora', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: ['Naim Vohra', 'Naim Vora'] },
  { ownerCode: '1009', name: 'Nita Bhavsar', role: 'admin', userGroup: 'Back Office', userType: 'Manager', aliases: [] },
  { ownerCode: '1016', name: 'Prasenjit Sahana', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: [] },
  { ownerCode: '1010', name: 'Rajeshree Parmar', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: [] },
  { ownerCode: '1011', name: 'Samir Jha', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: [] },
  { ownerCode: '1012', name: 'Support Swati', role: 'user', userGroup: 'Field Staff', userType: 'Support Executive', aliases: [] },
  { ownerCode: '1013', name: 'Tajammul Solkar', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: ['Tajamul Rafique Solkar', 'Tajamul Solkar'] },
  { ownerCode: '1014', name: 'Vaibhavi Patel', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: [] },
  { ownerCode: '1018', name: 'Bhavesh Prajapati', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: [] },
  { ownerCode: '1019', name: 'Samir Seth', role: 'user', userGroup: 'Back Office', userType: 'Sales Executive', aliases: [] },
];

export const CRM_OWNER_DIRECTORY = CRM_DIRECTORY_USERS.map((user) => ({
  ...user,
  ownerDisplayName: user.name,
}));

const CRM_OWNER_RECORDS_BY_CODE = new Map(
  CRM_OWNER_DIRECTORY.map((user) => [user.ownerCode, user])
);

const CRM_OWNER_RECORDS_BY_NAME = new Map(
  CRM_OWNER_DIRECTORY.flatMap((user) => {
    const entries: [string, any][] = [
      [normalizeCrmUserName(user.name), user]
    ];
    user.aliases.forEach((alias) => {
      entries.push([normalizeCrmUserName(alias), user]);
    });
    return entries;
  })
);

export const getCrmOwnerRecord = (value: string) => {
  const trimmedValue = String(value || '').trim();
  if (!trimmedValue) {
    return null;
  }

  return CRM_OWNER_RECORDS_BY_CODE.get(trimmedValue)
    || CRM_OWNER_RECORDS_BY_NAME.get(normalizeCrmUserName(trimmedValue))
    || null;
};

export const getCanonicalCrmUserName = (value: string) => getCrmOwnerRecord(value)?.name || '';

export const getCrmOwnerCode = (value: string) => getCrmOwnerRecord(value)?.ownerCode || '';

export const getCrmOwnerDisplay = (value: string, fallbackValue = '') => {
  const ownerRecord = getCrmOwnerRecord(value);
  if (ownerRecord) {
    return ownerRecord.ownerDisplayName;
  }

  const fallbackRecord = getCrmOwnerRecord(fallbackValue);
  if (fallbackRecord) {
    return fallbackRecord.ownerDisplayName;
  }

  const resolvedValue = String(value || fallbackValue || '').trim();
  return resolvedValue;
};

export const isSameCrmOwner = (leftValue: string, rightValue: string) => {
  const leftRecord = getCrmOwnerRecord(leftValue);
  const rightRecord = getCrmOwnerRecord(rightValue);
  if (leftRecord && rightRecord) {
    return leftRecord.ownerCode === rightRecord.ownerCode;
  }

  const leftNormalizedValue = normalizeCrmUserName(leftValue);
  const rightNormalizedValue = normalizeCrmUserName(rightValue);

  return Boolean(leftNormalizedValue) && leftNormalizedValue === rightNormalizedValue;
};
