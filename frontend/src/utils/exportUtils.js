import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Export data to PDF
 * @param {Array} columns - Array of column definitions { header: string, dataKey: string }
 * @param {Array} data - Array of data objects
 * @param {string} fileName - Name of the file to be saved
 * @param {string} title - Title displayed in the PDF
 */
export const exportToPDF = (columns, data, fileName, title) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Add date
    const date = new Date().toLocaleString();
    doc.text(`Generated on: ${date}`, 14, 30);

    // AutoTable for data
    autoTable(doc, {
        startY: 35,
        head: [columns.map(col => col.header)],
        body: data.map(item => columns.map(col => {
            // Handle nested objects if dataKey is like 'product.name'
            const keys = col.dataKey.split('.');
            let value = item;
            for (const key of keys) {
                value = value ? value[key] : '';
            }
            return value;
        })),
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] }, // var(--primary)
    });

    doc.save(`${fileName}.pdf`);
};

/**
 * Export data to Excel
 * @param {Array} data - Array of data objects
 * @param {string} fileName - Name of the file to be saved
 */
export const exportToExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};
