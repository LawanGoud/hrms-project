import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { Activity } from 'lucide-react';

const Dashboard = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/logs');
                setLogs(res.data);
            } catch (error) {
                console.error('Failed to fetch logs', error);
            }
        };
        fetchLogs();
    }, []);

    return (
        <Layout>
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
            </div>

            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    <Activity size={20} color="var(--primary)" />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent Activity</h3>
                </div>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {logs.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No activity yet.</p>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>User</th>
                                    <th>Details</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id}>
                                        <td>
                                            <span className="badge">{log.action.replace(/_/g, ' ')}</span>
                                        </td>
                                        <td>{log.User?.name || 'Unknown'}</td>
                                        <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            {JSON.stringify(log.meta)}
                                        </td>
                                        <td style={{ fontSize: '0.875rem' }}>
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
