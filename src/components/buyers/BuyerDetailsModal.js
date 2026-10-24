import React from 'react';
import ModalShell from '../common/ModalShell';
import { formatDate, formatNumber } from '../../utils/formatters';
import { printHtml, esc } from '../../utils/reportExport';

// Full buyer record with enlarged photo and a print option
export default function BuyerDetailsModal({ buyer, crop, onClose }) {
  if (!buyer) return null;
  const print = () =>
    printHtml(`Buyer - ${buyer.name}`, `
      <h1>Buyer record</h1>
      <img src="${buyer.imageBase64}" alt="Buyer photo" />
      <table><tbody>
        <tr><th>Full name</th><td>${esc(buyer.name)}</td></tr>
        <tr><th>CNIC</th><td>${esc(buyer.cnic)}</td></tr>
        <tr><th>Crop</th><td>${esc(crop?.name || '-')}</td></tr>
        <tr><th>Quantity</th><td>${esc(buyer.quantity)} kg</td></tr>
        <tr><th>Date</th><td>${esc(formatDate(buyer.date))}</td></tr>
      </tbody></table>`);

  return (
    <ModalShell
      show
      title="Buyer details"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-outline-secondary" onClick={print}><i className="bi bi-printer me-1" />Print</button>
          <button className="btn btn-success" onClick={onClose}>Close</button>
        </>
      }
    >
      <div className="text-center mb-3"><img src={buyer.imageBase64} alt={buyer.name} className="buyer-photo-large" /></div>
      <dl className="row mb-0">
        <dt className="col-4">Full name</dt><dd className="col-8">{buyer.name}</dd>
        <dt className="col-4">CNIC</dt><dd className="col-8">{buyer.cnic}</dd>
        <dt className="col-4">Crop</dt><dd className="col-8">{crop?.name || 'Deleted crop'}</dd>
        <dt className="col-4">Quantity</dt><dd className="col-8">{formatNumber(buyer.quantity)} kg</dd>
        <dt className="col-4">Date</dt><dd className="col-8">{formatDate(buyer.date)}</dd>
      </dl>
    </ModalShell>
  );
}
