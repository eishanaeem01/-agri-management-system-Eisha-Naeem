import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

// Revenue vs expense per crop, plus net profit / loss
export default function ProfitLossChart({ rows }) {
  return (
    <section className="panel h-100" aria-label="Profit and loss by crop">
      <h2 className="panel-title">Revenue vs expense by crop</h2>
      {rows.length === 0 ? (
        <p className="text-body-secondary small">No crops to chart yet.</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="#2f8f4e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#d6453d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <ul className="list-unstyled small mt-3 mb-0 row">
            {rows.map((r) => (
              <li key={r.cropId} className="col-6 col-md-4 d-flex justify-content-between pe-3">
                <span>{r.name}</span>
                <strong className={r.profit >= 0 ? 'text-success' : 'text-danger'}>{r.profit >= 0 ? 'Profit ' : 'Loss '}{formatCurrency(Math.abs(r.profit))}</strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
