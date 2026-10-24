import { downloadFile } from './exportCsv';

// sections: [{ title, columns: [..], rows: [[..]] }]
const q = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const sectionsToCsv = (heading, sections) => {
  const lines = [q(heading), ''];
  sections.forEach((s) => {
    lines.push(q(s.title));
    lines.push(s.columns.map(q).join(','));
    s.rows.forEach((r) => lines.push(r.map(q).join(',')));
    lines.push('');
  });
  return lines.join('\n');
};

export const exportSectionsCsv = (filename, heading, sections) =>
  downloadFile(filename, sectionsToCsv(heading, sections));

export const exportSectionsPdf = async (filename, heading, sections) => {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(heading, 14, 18);
  let y = 26;
  sections.forEach((s) => {
    doc.setFontSize(12);
    doc.text(s.title, 14, y);
    autoTable(doc, { startY: y + 3, head: [s.columns], body: s.rows, styles: { fontSize: 9 }, headStyles: { fillColor: [47, 93, 58] } });
    y = doc.lastAutoTable.finalY + 12;
    if (y > 270) { doc.addPage(); y = 20; }
  });
  doc.save(filename);
};

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const printHtml = (title, bodyHtml) => {
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) return;
  w.document.write(`<html><head><title>${esc(title)}</title><style>
    body{font-family:Arial,sans-serif;padding:24px;color:#222} h1{font-size:20px;color:#2f5d3a}
    h2{font-size:15px;margin-top:22px} table{border-collapse:collapse;width:100%;font-size:12px}
    th,td{border:1px solid #ccc;padding:6px;text-align:left} th{background:#e9f0e4}
    img{max-width:240px;border-radius:8px;border:1px solid #ccc}
  </style></head><body>${bodyHtml}</body></html>`);
  w.document.close();
  w.focus();
  w.print();
};

export const printSections = (heading, sections) => {
  const body = sections.map((s) =>
    `<h2>${esc(s.title)}</h2><table><thead><tr>${s.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${
      s.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${s.columns.length}">No records</td></tr>`
    }</tbody></table>`).join('');
  printHtml(heading, `<h1>${esc(heading)}</h1>${body}`);
};

export { esc };
