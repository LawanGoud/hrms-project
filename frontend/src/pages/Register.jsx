import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hexagon } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        orgName: '',
        adminName: '',
        email: '',
        password: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.orgName, formData.adminName, formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError('Registration failed. Try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
                    <Hexagon size={48} />
                </div>
                <h2 className="auth-title">Create Organisation</h2>
                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Organisation Name</label>
                        <input
                            name="orgName"
                            className="input"
                            value={formData.orgName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">Admin Name</label>
                        <input
                            name="adminName"
                            className="input"
                            value={formData.adminName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Get Started
                    </button>
                </form>
                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
