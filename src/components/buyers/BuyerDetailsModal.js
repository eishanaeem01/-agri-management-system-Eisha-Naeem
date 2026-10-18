import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import avatar from '../../assets/default-avatar.svg';
import { escapeHtml, formatDate, formatNumber } from '../../utils/formatters';

export default function BuyerDetailsModal({ buyer, crop, onClose }) {
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => setZoomed(false), [buyer]);
  if (!buyer) return null;

  const cropName = crop?.name || 'Unknown crop';
  const photo = buyer.imageBase64 || avatar;

  const print = () => {
    const w = window.open('', '_blank', 'width=720,height=820');
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>Buyer record - ${escapeHtml(buyer.name)}</title>
      <style>body{font-family:Arial,sans-serif;padding:32px;color:#222}h1{color:#2e7d32;font-size:22px}
      img{width:200px;height:200px;object-fit:cover;border-radius:8px;border:1px solid #ccc}
      table{border-collapse:collapse;margin-top:16px;width:100%}td{padding:8px 10px;border-bottom:1px solid #ddd}td:first-child{font-weight:bold;width:35%}</style></head>
      <body><h1>AgriManager - Buyer record</h1><img src="${escapeHtml(photo)}" alt="Buyer photo"/>
      <table><tr><td>Full name</td><td>${escapeHtml(buyer.name)}</td></tr><tr><td>CNIC</td><td>${escapeHtml(buyer.cnic)}</td></tr>
      <tr><td>Crop</td><td>${escapeHtml(cropName)}</td></tr><tr><td>Quantity</td><td>${escapeHtml(formatNumber(buyer.quantity))} kg</td></tr>
      <tr><td>Date</td><td>${escapeHtml(formatDate(buyer.date))}</td></tr></table></body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  return (
    <Modal
      show
      title="Buyer details"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Close</button>
          <button type="button" className="btn btn-success" onClick={print}><i className="bi bi-printer me-1" />Print</button>
        </>
      }
    >
      <div className="text-center mb-3">
        <img
          src={photo}
          alt={`${buyer.name} photo`}
          className={`buyer-photo ${zoomed ? 'zoomed' : ''}`}
          onClick={() => setZoomed(!zoomed)}
          title={zoomed ? 'Click to shrink' : 'Click to enlarge'}
        />
        <div className="small text-body-secondary mt-1">Click the photo to {zoomed ? 'shrink' : 'enlarge'}</div>
      </div>
      <dl className="row mb-0">
        <dt className="col-4">Full name</dt><dd className="col-8">{buyer.name}</dd>
        <dt className="col-4">CNIC</dt><dd className="col-8">{buyer.cnic}</dd>
        <dt className="col-4">Crop</dt><dd className="col-8">{cropName}</dd>
        <dt className="col-4">Quantity</dt><dd className="col-8">{formatNumber(buyer.quantity)} kg</dd>
        <dt className="col-4">Date</dt><dd className="col-8">{formatDate(buyer.date)}</dd>
      </dl>
    </Modal>
  );
}
