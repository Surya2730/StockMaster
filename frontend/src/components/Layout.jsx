import { useContext } from 'react';
import Sidebar from './Sidebar';
import AuthContext from '../context/AuthContext';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="app-layout">
            {user && <Sidebar />}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
