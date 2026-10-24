import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = { Healthy: '#2f8f4e', 'Needs Attention': '#e0a800', Critical: '#d6453d' };

// Doughnut chart of Healthy vs Needs Attention vs Critical
export default function CropHealthChart({ counts }) {
  const data = Object.entries(counts).map(([name, value]) => ({ name, value })).filter((d) => d.value > 0);
  return (
    <section className="panel h-100" aria-label="Crop health distribution">
      <h2 className="panel-title">Health distribution</h2>
      {data.length === 0 ? (
        <p className="text-body-secondary small">No crop data to chart.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
              {data.map((d) => <Cell key={d.name} fill={COLORS[d.name]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}
