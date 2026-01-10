import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (error) {
            alert('Registration Failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/dashboard');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            alert('Google Register Failed: ' + errorMsg);
            console.error('Google Register Error:', error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <div style={{ background: '#ECFDF5', padding: '12px', borderRadius: '50%' }}>
                        <UserPlus size={32} color="#10B981" />
                    </div>
                </div>
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join StockMaster today</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#10B981' }}>
                        Create Account
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', borderTop: '1px solid #E5E7EB', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p style={{ marginBottom: '1rem', color: '#6B7280', fontSize: '0.9rem' }}>Or register with</p>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        useOneTap
                    />

                    <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#6B7280' }}>
                        Already have an account? <Link to="/login" style={{ color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
