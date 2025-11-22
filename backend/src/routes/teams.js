const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const { listTeams, createTeam, updateTeam, deleteTeam, assignEmployee, unassignEmployee } = require('../controllers/teamController');

router.use(authMiddleware);

router.get('/', listTeams);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);
router.post('/:teamId/assign', assignEmployee);
router.delete('/:teamId/unassign', unassignEmployee);

module.exports = router;
