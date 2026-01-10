import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Package, Warehouse, Layers, AlertCircle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalWarehouses: 0,
        totalStock: 0,
        lowStockCount: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/inventory/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    const barData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Stock Movement (In)',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(79, 70, 229, 0.6)',
            },
            {
                label: 'Stock Movement (Out)',
                data: [8, 15, 5, 2, 8, 10],
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
            },
        ],
    };

    const doughnutData = {
        labels: ['Electronics', 'Furniture', 'Stationery'],
        datasets: [
            {
                data: [50, 30, 20],
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>Overview of your inventory performance</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary">Export Report</button>
                    <button className="btn btn-primary">
                        <Package size={18} /> Add Product
                    </button>
                </div>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-label">Total Products</div>
                            <div className="stat-value">{stats.totalProducts}</div>
                        </div>
                        <div style={{ padding: '10px', background: '#EEF2FF', borderRadius: '8px', color: '#4F46E5' }}>
                            <Package size={24} />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-label">Total Stock</div>
                            <div className="stat-value">{stats.totalStock}</div>
                        </div>
                        <div style={{ padding: '10px', background: '#ECFDF5', borderRadius: '8px', color: '#10B981' }}>
                            <Layers size={24} />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-label">Warehouses</div>
                            <div className="stat-value">{stats.totalWarehouses}</div>
                        </div>
                        <div style={{ padding: '10px', background: '#FFFBEB', borderRadius: '8px', color: '#F59E0B' }}>
                            <Warehouse size={24} />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-label">Low Stock Alerts</div>
                            <div className="stat-value" style={{ color: '#EF4444' }}>{stats.lowStockCount}</div>
                        </div>
                        <div style={{ padding: '10px', background: '#FEF2F2', borderRadius: '8px', color: '#EF4444' }}>
                            <AlertCircle size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Stock Movement Trends</h3>
                    <Bar options={{ responsive: true, plugins: { legend: { position: 'top' } } }} data={barData} />
                </div>
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Stock by Category</h3>
                    <div style={{ padding: '1rem' }}>
                        <Doughnut data={doughnutData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
