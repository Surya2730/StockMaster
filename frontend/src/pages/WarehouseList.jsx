import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Warehouse, Plus, MapPin } from 'lucide-react';

const WarehouseList = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const { data } = await api.get('/warehouses');
            setWarehouses(data);
        } catch (error) {
            console.error("Failed to fetch warehouses", error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/warehouses', { name, address });
            setWarehouses([...warehouses, data]);
            setName('');
            setAddress('');
        } catch (error) {
            alert('Error creating warehouse');
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Warehouses</h1>
                    <p style={{ color: '#6B7280' }}>Manage storage locations and facilities</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Add New Warehouse
                </h3>
                <form onSubmit={handleCreate} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label className="form-label">Warehouse Name</label>
                        <input
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Central Hub"
                            required
                        />
                    </div>
                    <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                        <label className="form-label">Address</label>
                        <input
                            className="form-input"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g. 123 Industry Ave"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: 'auto', marginTop: '1.8rem' }}>
                        Add Warehouse
                    </button>
                </form>
            </div>

            <div className="dashboard-grid">
                {warehouses.map(w => (
                    <div key={w._id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ background: '#EEF2FF', padding: '10px', borderRadius: '8px', color: '#4F46E5' }}>
                                <Warehouse size={24} />
                            </div>
                        </div>
                        <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '0.5rem', textTransform: 'none' }}>{w.name}</h3>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            <MapPin size={14} /> {w.address || 'No address provided'}
                        </p>
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Manager: <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{w.manager?.name || 'Unassigned'}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WarehouseList;
