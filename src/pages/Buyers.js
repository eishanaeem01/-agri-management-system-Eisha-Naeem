import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import ConfirmModal from '../components/common/ConfirmModal';
import BuyerForm from '../components/buyers/BuyerForm';
import BuyerTable from '../components/buyers/BuyerTable';
import BuyerDetailsModal from '../components/buyers/BuyerDetailsModal';
import { useApp } from '../context/AppContext';
import { exportCsv } from '../utils/exportCsv';
import { formatDate } from '../utils/formatters';

export default function Buyers() {
  const { crops, buyers, cropsById, stock, addBuyer, updateBuyer, deleteBuyer, notify } = useApp();
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const submit = (data) => {
    if (editing) {
      updateBuyer(editing.id, data);
      setEditing(null);
    } else {
      addBuyer(data);
    }
  };

  const exportBuyers = (rows) => {
    exportCsv(
      rows,
      [
        { label: 'Full name', key: 'name' },
        { label: 'CNIC', key: 'cnic' },
        { label: 'Crop', value: (b) => cropsById[b.cropId]?.name || 'Unknown crop' },
        { label: 'Quantity (kg)', key: 'quantity' },
        { label: 'Date', value: (b) => formatDate(b.date) },
      ],
      'buyers.csv'
    );
    notify('Buyers exported to CSV.');
  };

  return (
    <>
      <PageHeader title="Buyers" subtitle="Record who each crop was sold to. Stock updates after every sale." />

      <BuyerForm
        key={editing ? editing.id : 'new'}
        crops={crops}
        buyers={buyers}
        stock={stock}
        editing={editing}
        onSubmit={submit}
        onCancel={() => setEditing(null)}
      />

      <BuyerTable
        buyers={buyers}
        cropsById={cropsById}
        onView={setViewing}
        onEdit={(b) => { setEditing(b); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onDelete={setToDelete}
        onExport={exportBuyers}
      />

      <BuyerDetailsModal buyer={viewing} crop={viewing ? cropsById[viewing.cropId] : null} onClose={() => setViewing(null)} />
      <ConfirmModal
        show={!!toDelete}
        title="Delete buyer"
        message={toDelete ? `Delete the record for ${toDelete.name}? The ${toDelete.quantity} kg will return to stock.` : ''}
        onConfirm={() => {
          if (editing && editing.id === toDelete.id) setEditing(null);
          deleteBuyer(toDelete.id);
          setToDelete(null);
        }}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
