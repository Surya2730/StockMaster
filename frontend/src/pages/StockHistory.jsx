import { useEffect, useState } from 'react';
import api from '../api/axios';
import { History, ArrowLeft, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

const StockHistory = () => {
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get(`/inventory/history?pageNumber=${page}`);
                setHistory(data.history);
                setPages(data.pages);
                setPage(data.page);
            } catch (error) {
                console.error("Failed to fetch history", error);
            }
        };
        fetchHistory();
    }, [page]);

    const handleExportPDF = () => {
        const columns = [
            { header: 'Date', dataKey: 'createdAt' },
            { header: 'Type', dataKey: 'type' },
            { header: 'Product', dataKey: 'product.name' },
            { header: 'SKU', dataKey: 'product.sku' },
            { header: 'Warehouse', dataKey: 'warehouse.name' },
            { header: 'Change', dataKey: 'quantity' },
            { header: 'User', dataKey: 'performedBy.name' }
        ];
        // Format dates before export
        const formattedData = history.map(h => ({
            ...h,
            createdAt: new Date(h.createdAt).toLocaleString()
        }));
        exportToPDF(columns, formattedData, 'Stock_History_Report', 'Inventory Transaction History');
    };

    const handleExportExcel = () => {
        const excelData = history.map(h => ({
            Date: new Date(h.createdAt).toLocaleString(),
            Type: h.type,
            Product: h.product?.name,
            SKU: h.product?.sku,
            Warehouse: h.warehouse?.name,
            Change: h.quantity,
            User: h.performedBy?.name
        }));
        exportToExcel(excelData, 'Stock_History_Report');
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Link to="/inventory" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                            <ArrowLeft size={16} style={{ marginRight: '4px' }} /> Back to Stock
                        </Link>
                    </div>
                    <h1 className="page-title">Transaction History</h1>
                    <p style={{ color: '#6B7280' }}>Audit trail of all stock movements</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={handleExportPDF} className="btn btn-secondary">
                        <FileText size={18} /> <span className="hide-mobile">PDF Report</span>
                    </button>
                    <button onClick={handleExportExcel} className="btn btn-secondary">
                        <Download size={18} /> <span className="hide-mobile">Excel Sheet</span>
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Time & Date</th>
                            <th>Event Type</th>
                            <th>Product / SKU</th>
                            <th>Warehouse</th>
                            <th>Change</th>
                            <th>Performed By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((entry) => (
                            <tr key={entry._id}>
                                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    {new Date(entry.createdAt).toLocaleString()}
                                </td>
                                <td>
                                    <span className="badge" style={{
                                        backgroundColor: entry.quantity > 0 ? 'var(--success-bg)' : 'var(--danger-bg)',
                                        color: entry.quantity > 0 ? 'var(--success)' : 'var(--danger)',
                                        gap: '4px'
                                    }}>
                                        {entry.quantity > 0 ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                        {entry.type}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 500 }}>{entry.product?.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{entry.product?.sku}</div>
                                </td>
                                <td>{entry.warehouse?.name}</td>
                                <td style={{ fontWeight: 700, color: entry.quantity > 0 ? 'var(--success)' : 'var(--danger)' }}>
                                    {entry.quantity > 0 ? '+' : ''}{entry.quantity}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600 }}>
                                            {entry.performedBy?.name.charAt(0)}
                                        </div>
                                        <span>{entry.performedBy?.name}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem', width: '40px', height: '40px' }}
                >
                    <ChevronLeft size={20} />
                </button>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Page <strong>{page}</strong> of {pages}
                </span>
                <button
                    disabled={page === pages}
                    onClick={() => setPage(page + 1)}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem', width: '40px', height: '40px' }}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default StockHistory;
