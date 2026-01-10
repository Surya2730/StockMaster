import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Link } from 'react-router-dom';
import { Package, Warehouse, Layers, AlertCircle, FileText, Download } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalWarehouses: 0,
        totalStock: 0,
        lowStockCount: 0,
        categoryData: [],
        movementData: []
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

    const handleExportStats = () => {
        const data = [
            { Metric: 'Total Products', Value: stats.totalProducts },
            { Metric: 'Total Stock', Value: stats.totalStock },
            { Metric: 'Total Warehouses', Value: stats.totalWarehouses },
            { Metric: 'Low Stock Alerts', Value: stats.lowStockCount },
        ];
        exportToExcel(data, 'Inventory_Summary_Report');
    };

    // Helper to format movement data for Bar Chart
    const formatMovementData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const labels = [];
        const stockIn = [];
        const stockOut = [];

        // Build last 6 months labels
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const m = d.getMonth() + 1;
            const y = d.getFullYear();
            labels.push(months[d.getMonth()]);

            const inEntry = stats.movementData.find(md => md._id.month === m && md._id.year === y && md._id.type === 'In');
            const outEntry = stats.movementData.find(md => md._id.month === m && md._id.year === y && md._id.type === 'Out');

            stockIn.push(inEntry ? inEntry.total : 0);
            stockOut.push(outEntry ? outEntry.total : 0);
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Stock In (+)',
                    data: stockIn,
                    backgroundColor: 'rgba(79, 70, 229, 0.6)',
                    borderRadius: 4
                },
                {
                    label: 'Stock Out (-)',
                    data: stockOut,
                    backgroundColor: 'rgba(244, 63, 94, 0.6)',
                    borderRadius: 4
                }
            ]
        };
    };

    const barData = formatMovementData();

    const doughnutData = {
        labels: stats.categoryData.length > 0 ? stats.categoryData.map(c => c.name) : ['No Data'],
        datasets: [
            {
                data: stats.categoryData.length > 0 ? stats.categoryData.map(c => c.value) : [1],
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 6 } },
        },
        scales: {
            y: { beginAtZero: true, grid: { display: false } },
            x: { grid: { display: false } }
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>Overview of your inventory performance</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleExportStats} className="btn btn-secondary">
                        <Download size={18} style={{ marginRight: '6px' }} /> Export Summary
                    </button>
                    {(user?.role === 'Admin' || user?.role === 'Manager') && (
                        <Link to="/products" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Package size={18} /> Manage Products
                        </Link>
                    )}
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
                <Link to="/inventory?filter=low" className="stat-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-label">Low Stock Alerts</div>
                            <div className="stat-value" style={{ color: '#EF4444' }}>{stats.lowStockCount}</div>
                        </div>
                        <div style={{ padding: '10px', background: '#FEF2F2', borderRadius: '8px', color: '#EF4444' }}>
                            <AlertCircle size={24} />
                        </div>
                    </div>
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Stock Movement Trends</h3>
                    <Bar options={barOptions} data={barData} />
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
