import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Layers, Search, ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const StockBalance = () => {
    const [stocks, setStocks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const { data } = await api.get('/inventory/stock');
                setStocks(data);
            } catch (error) {
                console.error("Failed to fetch stock", error);
            }
        };
        fetchStock();
    }, []);

    const filteredStocks = stocks.filter(s =>
        s.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.product?.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Current Stock Balance</h1>
                    <p style={{ color: '#6B7280' }}>Real-time inventory levels across all locations</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/inventory/history" className="btn btn-secondary">
                        <ArrowRightLeft size={18} /> View History
                    </Link>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem', padding: '1rem 1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input
                        type="text"
                        className="form-input"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="Search stock by product or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>SKU</th>
                            <th>Warehouse</th>
                            <th>Location</th>
                            <th style={{ textAlign: 'right' }}>Current Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStocks.map((stock) => (
                            <tr key={stock._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ padding: '6px', background: 'var(--primary-light)', borderRadius: '6px', color: 'var(--primary)' }}>
                                            <Layers size={16} />
                                        </div>
                                        <span style={{ fontWeight: 500 }}>{stock.product?.name}</span>
                                    </div>
                                </td>
                                <td>{stock.product?.sku}</td>
                                <td>{stock.warehouse?.name}</td>
                                <td>{stock.location?.name || <span style={{ color: '#9CA3AF' }}>N/A</span>}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <span style={{
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        color: stock.quantity <= (stock.product?.reorderLevel || 0) ? 'var(--danger)' : 'var(--text-main)'
                                    }}>
                                        {stock.quantity}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {filteredStocks.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                    No stock data found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockBalance;
