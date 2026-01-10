import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { Trash2, User, Shield, UserPlus } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
            } catch (error) {
                alert('Failed to delete user');
            }
        }
    };

    const handleRoleUpdate = async (id, newRole) => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            try {
                await api.put(`/users/${id}/role`, { role: newRole });
                fetchUsers();
            } catch (error) {
                alert('Failed to update role');
            }
        }
    };

    if (currentUser?.role !== 'Admin') {
        return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--danger)' }}>Access Denied</h2>
            <p>You must be an Administrator to view this page.</p>
        </div>;
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">User Management</h1>
                    <p style={{ color: '#6B7280' }}>Manage system access and roles</p>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {u.avatar ? (
                                            <img src={u.avatar} alt={u.name} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                                        ) : (
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', fontWeight: 600 }}>
                                                {u.name.charAt(0)}
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 500 }}>{u.name}</span>
                                            {u.googleId && <span style={{ fontSize: '0.7rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="10" /> Linked
                                            </span>}
                                        </div>
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td>
                                    <span className="badge"
                                        style={{ background: u.role === 'Admin' ? 'var(--primary-light)' : '#F3F4F6', color: u.role === 'Admin' ? 'var(--primary)' : '#374151', gap: '4px' }}>
                                        {u.role === 'Admin' ? <Shield size={12} /> : <User size={12} />}
                                        {u.role}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        {u.role !== 'Admin' && (
                                            <button
                                                title="Promote to Admin"
                                                onClick={() => handleRoleUpdate(u._id, 'Admin')}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '4px' }}
                                            >
                                                <UserPlus size={18} />
                                            </button>
                                        )}
                                        {u.role === 'Admin' && u._id !== currentUser._id && (
                                            <button
                                                title="Demote to Staff"
                                                onClick={() => handleRoleUpdate(u._id, 'Staff')}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--warning)', padding: '4px' }}
                                            >
                                                <User size={18} />
                                            </button>
                                        )}
                                        {u._id !== currentUser._id && (
                                            <button
                                                title="Delete User"
                                                onClick={() => handleDelete(u._id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '4px' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
