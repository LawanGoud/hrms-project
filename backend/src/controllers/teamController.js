const { Team, Employee, EmployeeTeam, Log } = require('../models');

exports.listTeams = async (req, res) => {
    try {
        const teams = await Team.findAll({
            where: { organisation_id: req.user.orgId },
            include: [{ model: Employee, through: { attributes: [] } }]
        });
        res.json(teams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createTeam = async (req, res) => {
    try {
        const { name, description } = req.body;
        const team = await Team.create({
            name,
            description,
            organisation_id: req.user.orgId
        });

        await Log.create({
            organisation_id: req.user.orgId,
            user_id: req.user.userId,
            action: 'team_created',
            meta: { teamId: team.id, name }
        });

        res.status(201).json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const team = await Team.findOne({ where: { id, organisation_id: req.user.orgId } });
        if (!team) return res.status(404).json({ message: 'Team not found' });

        await team.update({ name, description });

        await Log.create({
            organisation_id: req.user.orgId,
            user_id: req.user.userId,
            action: 'team_updated',
            meta: { teamId: id }
        });

        res.json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findOne({ where: { id, organisation_id: req.user.orgId } });
        if (!team) return res.status(404).json({ message: 'Team not found' });

        await team.destroy();

        await Log.create({
            organisation_id: req.user.orgId,
            user_id: req.user.userId,
            action: 'team_deleted',
            meta: { teamId: id }
        });

        res.json({ message: 'Team deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.assignEmployee = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { employeeId } = req.body;

        const team = await Team.findOne({ where: { id: teamId, organisation_id: req.user.orgId } });
        if (!team) return res.status(404).json({ message: 'Team not found' });

        const employee = await Employee.findOne({ where: { id: employeeId, organisation_id: req.user.orgId } });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        // Check if already assigned
        const exists = await EmployeeTeam.findOne({ where: { team_id: teamId, employee_id: employeeId } });
        if (exists) return res.status(400).json({ message: 'Employee already in team' });

        await EmployeeTeam.create({ team_id: teamId, employee_id: employeeId });

        await Log.create({
            organisation_id: req.user.orgId,
            user_id: req.user.userId,
            action: 'assigned_employee_to_team',
            meta: { employeeId, teamId }
        });

        res.json({ message: 'Assigned successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.unassignEmployee = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { employeeId } = req.body; // Or query param? User said DELETE /api/teams/:teamId/unassign, body is implied or param. Usually DELETE has no body, but some allow. I'll assume body for consistency with assign, or I can use query param. The prompt says "DELETE /api/teams/:teamId/unassign — remove assignment". I'll check if I should use body.
        // Ideally DELETE should be /api/teams/:teamId/employees/:employeeId
        // But I will stick to the prompt's "remove assignment". I'll accept body.

        const team = await Team.findOne({ where: { id: teamId, organisation_id: req.user.orgId } });
        if (!team) return res.status(404).json({ message: 'Team not found' });

        const assignment = await EmployeeTeam.findOne({ where: { team_id: teamId, employee_id: employeeId } });
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        await assignment.destroy();

        await Log.create({
            organisation_id: req.user.orgId,
            user_id: req.user.userId,
            action: 'unassigned_employee_from_team',
            meta: { employeeId, teamId }
        });

        res.json({ message: 'Unassigned successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
