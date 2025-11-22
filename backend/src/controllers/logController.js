const { Log, User } = require('../models');

exports.listLogs = async (req, res) => {
    try {
        const logs = await Log.findAll({
            where: { organisation_id: req.user.orgId },
            include: [{ model: User, attributes: ['name', 'email'] }],
            order: [['timestamp', 'DESC']]
        });
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
