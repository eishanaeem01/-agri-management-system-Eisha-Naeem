import { todayISO } from './formatters';

export const CNIC_REGEX = /^\d{5}-\d{7}-\d$/;
export const MAX_IMAGE_BYTES = 1024 * 1024; // 1 MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

// Name: required, letters and spaces only, minimum 3 characters.
export function validateName(name) {
  const v = String(name || '').trim();
  if (!v) return 'Full name is required.';
  if (!/^[A-Za-z ]+$/.test(v)) return 'Name can contain letters and spaces only.';
  if (v.length < 3) return 'Name must be at least 3 characters.';
  return '';
}

export function isDuplicateCnic(cnic, buyers = [], ignoreId = null) {
  return buyers.some((b) => b.cnic === cnic && b.id !== ignoreId);
}

// CNIC: required, 13 digits formatted as 12345-1234567-1, no duplicates.
export function validateCnic(cnic, buyers = [], ignoreId = null) {
  const v = String(cnic || '').trim();
  if (!v) return 'CNIC is required.';
  if (!CNIC_REGEX.test(v)) return 'CNIC must be 13 digits in the format 12345-1234567-1.';
  if (isDuplicateCnic(v, buyers, ignoreId)) return 'A buyer with this CNIC already exists.';
  return '';
}

// Image (File object): required, JPG or PNG only, max 1 MB.
export function validateImage(file) {
  if (!file) return 'Photo is required.';
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'Only JPG or PNG images are allowed.';
  if (file.size > MAX_IMAGE_BYTES) return 'Image must be 1 MB or smaller.';
  return '';
}

// Quantity must be > 0 and cannot exceed the available stock.
export function validateQuantity(qty, available) {
  if (qty === '' || qty === null || qty === undefined) return 'Quantity is required.';
  const n = Number(qty);
  if (!Number.isFinite(n) || n <= 0) return 'Quantity must be a number greater than 0.';
  if (available <= 0) return 'This crop is out of stock.';
  if (n > available) return `Only ${available} kg available in stock.`;
  return '';
}

export function validateSaleDate(date) {
  if (!date) return 'Date is required.';
  if (date > todayISO()) return 'Date cannot be in the future.';
  return '';
}

export function validateCrop(v, minQty = 0) {
  const e = {};
  const name = String(v.name || '').trim();
  e.name = !name ? 'Crop name is required.' : name.length < 2 ? 'Crop name must be at least 2 characters.' : '';
  e.field = !String(v.field || '').trim() ? 'Field name is required.' : '';
  e.plantingDate = !v.plantingDate ? 'Planting date is required.' : '';
  e.cuttingDate = !v.cuttingDate
    ? 'Cutting date is required.'
    : v.plantingDate && v.cuttingDate <= v.plantingDate
    ? 'Cutting date must be after the planting date.'
    : '';
  const s = Number(v.healthScore);
  e.healthScore =
    v.healthScore === '' || v.healthScore == null
      ? 'Health score is required.'
      : !Number.isFinite(s) || s < 0 || s > 100
      ? 'Health score must be between 0 and 100.'
      : '';
  const q = Number(v.harvestQty);
  e.harvestQty =
    v.harvestQty === '' || v.harvestQty == null
      ? 'Expected quantity is required.'
      : !Number.isFinite(q) || q <= 0
      ? 'Quantity must be greater than 0.'
      : q < minQty
      ? `Quantity cannot be below the ${minQty} kg already sold.`
      : '';
  return e;
}

export function validateOrder(v) {
  const e = {};
  e.cropId = v.cropId ? '' : 'Please select a crop.';
  const q = Number(v.quantity);
  e.quantity = v.quantity === '' || v.quantity == null ? 'Quantity is required.' : !Number.isFinite(q) || q <= 0 ? 'Quantity must be greater than 0.' : '';
  e.orderDate = v.orderDate ? '' : 'Order date is required.';
  e.status = v.status ? '' : 'Status is required.';
  return e;
}

export const hasErrors = (errors) => Object.values(errors).some(Boolean);
