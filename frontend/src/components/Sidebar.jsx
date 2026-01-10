import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, Package, Warehouse, ClipboardList, History, LogOut, Users } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="sidebar-logo">StockMaster</span>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <Package size={20} />
                    <span>Products</span>
                </NavLink>
                <NavLink to="/warehouses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <Warehouse size={20} />
                    <span>Warehouses</span>
                </NavLink>
                <NavLink to="/inventory" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <ClipboardList size={20} />
                    <span>Stock Balance</span>
                </NavLink>
                <NavLink to="/inventory/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <History size={20} />
                    <span>History</span>
                </NavLink>

                {user.role === 'Admin' && (
                    <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        <Users size={20} />
                        <span>Users</span>
                    </NavLink>
                )}
            </nav>

            <div className="sidebar-footer">
                <div className="user-snippet">
                    <div className="user-avatar">
                        {user.name.charAt(0)}
                    </div>
                    <div className="user-details">
                        <h4>{user.name}</h4>
                        <span>{user.role}</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn-logout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
