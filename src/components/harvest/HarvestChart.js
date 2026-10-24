import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { monthLabel } from '../../utils/formatters';

// Harvest vs sales (bars) and orders over time (line), grouped by month
export default function HarvestChart({ series }) {
  const data = series.map((s) => ({ ...s, label: monthLabel(s.month) }));
  return (
    <section className="panel h-100" aria-label="Harvest versus sales chart">
      <h2 className="panel-title">Harvest vs sales and orders (kg per month)</h2>
      {data.length === 0 ? (
        <p className="text-body-secondary small">No data to chart yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="harvest" name="Harvest" fill="#2f8f4e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sold" name="Sold" fill="#d9a441" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="orders" name="Orders" stroke="#3a6f8f" strokeWidth={2} dot />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
