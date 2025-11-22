import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '' });

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/employees');
            setEmployees(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentEmployee) {
                await api.put(`/employees/${currentEmployee.id}`, formData);
            } else {
                await api.post('/employees', formData);
            }
            setIsModalOpen(false);
            fetchEmployees();
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/employees/${id}`);
                fetchEmployees();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const openEdit = (employee) => {
        setCurrentEmployee(employee);
        setFormData({
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            phone: employee.phone
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setCurrentEmployee(null);
        setFormData({ first_name: '', last_name: '', email: '', phone: '' });
    };

    return (
        <Layout>
            <div className="page-header">
                <h1 className="page-title">Employees</h1>
                <button className="btn btn-primary" onClick={() => { resetForm(); setIsModalOpen(true); }}>
                    <Plus size={16} style={{ marginRight: '0.5rem' }} />
                    Add Employee
                </button>
            </div>

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Teams</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id}>
                                <td>{emp.first_name} {emp.last_name}</td>
                                <td>{emp.email}</td>
                                <td>{emp.phone}</td>
                                <td>
                                    {emp.Teams && emp.Teams.map(t => (
                                        <span key={t.id} className="badge" style={{ marginRight: '0.25rem' }}>{t.name}</span>
                                    ))}
                                </td>
                                <td>
                                    <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', marginRight: '0.5rem' }} onClick={() => openEdit(emp)}>
                                        <Edit2 size={14} />
                                    </button>
                                    <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(emp.id)}>
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentEmployee ? 'Edit Employee' : 'Add Employee'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">First Name</label>
                        <input className="input" value={formData.first_name} onChange={e => setFormData({ ...formData, first_name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="label">Last Name</label>
                        <input className="input" value={formData.last_name} onChange={e => setFormData({ ...formData, last_name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="label">Email</label>
                        <input className="input" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label className="label">Phone</label>
                        <input className="input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save</button>
                </form>
            </Modal>
        </Layout>
    );
};

export default Employees;
