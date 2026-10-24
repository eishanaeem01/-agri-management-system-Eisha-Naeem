export const CNIC_REGEX = /^\d{5}-\d{7}-\d$/;
export const MAX_IMAGE_BYTES = 1024 * 1024; // 1 MB

export const validateName = (v) => {
  const n = (v || '').trim();
  if (!n) return 'Full name is required';
  if (!/^[A-Za-z ]+$/.test(n)) return 'Name can contain letters and spaces only';
  if (n.length < 3) return 'Name must be at least 3 characters';
  return '';
};

export const validateCnic = (v, existing = [], ignoreId = null) => {
  if (!v) return 'CNIC is required';
  if (!CNIC_REGEX.test(v)) return 'CNIC must be 13 digits in the format 12345-1234567-1';
  if (existing.some((b) => b.cnic === v && b.id !== ignoreId)) return 'This CNIC is already registered';
  return '';
};

// accepts a File object (before reading) - returns an error string or ''
export const validateImage = (file) => {
  if (!file) return 'Photo is required';
  if (!['image/jpeg', 'image/png'].includes(file.type)) return 'Only JPG or PNG images are allowed';
  if (file.size > MAX_IMAGE_BYTES) return 'Image must be 1 MB or smaller';
  return '';
};

export const validateQuantity = (qty, available) => {
  if (qty === '' || qty === null || qty === undefined) return 'Quantity is required';
  const n = Number(qty);
  if (Number.isNaN(n) || n <= 0) return 'Quantity must be greater than 0';
  if (available !== undefined && n > available) return `Only ${available} kg available in stock`;
  return '';
};

export const validateLogin = ({ username, password }) => {
  const errors = {};
  if (!username || !username.trim()) errors.username = 'Username is required';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
};

// Whole buyer record - shared by BuyerForm (live) and the saveBuyer thunk (final check)
export const validateBuyer = (b, { buyers = [], available } = {}) => {
  const errors = {};
  const name = validateName(b.name);
  if (name) errors.name = name;
  const cnic = validateCnic(b.cnic, buyers, b.id);
  if (cnic) errors.cnic = cnic;
  if (!b.imageBase64) errors.image = 'Photo is required';
  if (!b.cropId) errors.cropId = 'Select a crop';
  const q = validateQuantity(b.quantity, b.cropId ? available : undefined);
  if (q) errors.quantity = q;
  if (!b.date) errors.date = 'Date is required';
  return errors;
};

export const required = (v, label) => (v === '' || v === null || v === undefined || (typeof v === 'string' && !v.trim()) ? `${label} is required` : '');
export const positiveNumber = (v, label) => {
  if (v === '' || v === null || v === undefined) return `${label} is required`;
  return Number(v) > 0 ? '' : `${label} must be greater than 0`;
};
