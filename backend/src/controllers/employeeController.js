const { Employee, Log, Team } = require('../models');

exports.listEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            where: { organisation_id: req.user.orgId },
            include: [{ model: Team, through: { attributes: [] } }] // Include teams
        });
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const { first_name, last_name, email, phone } = req.body;
        const employee = await Employee.create({
            first_name,
            last_name,
            email,
            phone,
            organisation_id: req.user.orgId
        });

        await Log.create({
            organisation_id: req.user.orgId,
            user_id: req.user.userId,
            action: 'employee_created',
            meta: { employeeId: employee.id, name: `${first_name} ${last_name}` }
        });

        res.status(201).json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, phone } = req.body;

        const employee = await Employee.findOne({ where: { id, organisation_id: req.user.orgId } });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        await employee.update({ first_name, last_name, email, phone });

        await Log.create({
            organisation_id: req.user.orgId,
            user_id: req.user.userId,
            action: 'employee_updated',
            meta: { employeeId: id }
        });

        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findOne({ where: { id, organisation_id: req.user.orgId } });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        await employee.destroy();

        await Log.create({
            organisation_id: req.user.orgId,
            user_id: req.user.userId,
            action: 'employee_deleted',
            meta: { employeeId: id }
        });

        res.json({ message: 'Employee deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
