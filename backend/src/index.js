require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const teamRoutes = require('./routes/teams');
const logRoutes = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/logs', logRoutes);

app.get('/', (req, res) => {
    res.send('HRMS API is running');
});

// Sync DB and start server
sequelize.sync().then(() => {
    console.log('Database synced');
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    // Keep the process alive
    setInterval(() => { }, 1000 * 60 * 60);

    server.on('error', (err) => {
        console.error('Server error:', err);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});
