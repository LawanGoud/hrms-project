import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import { Plus, Edit2, Trash2, UserPlus, X } from 'lucide-react';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [assignData, setAssignData] = useState({ employeeId: '' });

    const fetchTeams = async () => {
        try {
            const res = await api.get('/teams');
            setTeams(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/employees');
            setEmployees(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTeams();
        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentTeam) {
                await api.put(`/teams/${currentTeam.id}`, formData);
            } else {
                await api.post('/teams', formData);
            }
            setIsModalOpen(false);
            fetchTeams();
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/teams/${id}`);
                fetchTeams();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/teams/${currentTeam.id}/assign`, { employeeId: assignData.employeeId });
            setIsAssignModalOpen(false);
            fetchTeams();
        } catch (error) {
            alert(error.response?.data?.message || 'Assignment failed');
        }
    };

    const handleUnassign = async (teamId, employeeId) => {
        if (window.confirm('Remove employee from team?')) {
            try {
                await api.delete(`/teams/${teamId}/unassign`, { data: { employeeId } });
                fetchTeams();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const openEdit = (team) => {
        setCurrentTeam(team);
        setFormData({ name: team.name, description: team.description });
        setIsModalOpen(true);
    };

    const openAssign = (team) => {
        setCurrentTeam(team);
        setAssignData({ employeeId: '' });
        setIsAssignModalOpen(true);
    };

    const resetForm = () => {
        setCurrentTeam(null);
        setFormData({ name: '', description: '' });
    };

    return (
        <Layout>
            <div className="page-header">
                <h1 className="page-title">Teams</h1>
                <button className="btn btn-primary" onClick={() => { resetForm(); setIsModalOpen(true); }}>
                    <Plus size={16} style={{ marginRight: '0.5rem' }} />
                    Create Team
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {teams.map(team => (
                    <div key={team.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{team.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{team.description}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-secondary" style={{ padding: '0.25rem' }} onClick={() => openEdit(team)}>
                                    <Edit2 size={14} />
                                </button>
                                <button className="btn btn-danger" style={{ padding: '0.25rem' }} onClick={() => handleDelete(team.id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span className="label" style={{ marginBottom: 0 }}>Members ({team.Employees?.length || 0})</span>
                                <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }} onClick={() => openAssign(team)}>
                                    <UserPlus size={14} style={{ marginRight: '0.25rem' }} /> Add
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {team.Employees?.map(emp => (
                                    <span key={emp.id} className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        {emp.first_name} {emp.last_name}
                                        <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleUnassign(team.id, emp.id)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentTeam ? 'Edit Team' : 'Create Team'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Team Name</label>
                        <input className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="label">Description</label>
                        <textarea className="input" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save</button>
                </form>
            </Modal>

            <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title={`Assign to ${currentTeam?.name}`}>
                <form onSubmit={handleAssign}>
                    <div className="form-group">
                        <label className="label">Select Employee</label>
                        <select className="input" value={assignData.employeeId} onChange={e => setAssignData({ employeeId: e.target.value })} required>
                            <option value="">Select...</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Assign</button>
                </form>
            </Modal>
        </Layout>
    );
};

export default Teams;
