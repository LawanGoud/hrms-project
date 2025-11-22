const { sequelize, Organisation, User, Employee, Team, EmployeeTeam, Log } = require('./src/models');
const bcrypt = require('bcrypt');

async function seed() {
    try {
        await sequelize.sync({ force: true }); // Reset DB

        console.log('Database synced');

        // Create Organisation
        const org = await Organisation.create({ name: 'Acme Corp' });
        console.log('Organisation created');

        // Create Admin
        const password_hash = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            organisation_id: org.id,
            email: 'admin@acme.com',
            password_hash,
            name: 'Admin User'
        });
        console.log('Admin created: admin@acme.com / admin123');

        // Create Employees
        const emp1 = await Employee.create({
            organisation_id: org.id,
            first_name: 'Alice',
            last_name: 'Smith',
            email: 'alice@acme.com',
            phone: '123-456-7890'
        });
        const emp2 = await Employee.create({
            organisation_id: org.id,
            first_name: 'Bob',
            last_name: 'Jones',
            email: 'bob@acme.com',
            phone: '098-765-4321'
        });
        console.log('Employees created');

        // Create Teams
        const team1 = await Team.create({
            organisation_id: org.id,
            name: 'Engineering',
            description: 'Software Development Team'
        });
        const team2 = await Team.create({
            organisation_id: org.id,
            name: 'HR',
            description: 'Human Resources'
        });
        console.log('Teams created');

        // Assign
        await EmployeeTeam.create({ employee_id: emp1.id, team_id: team1.id });
        await EmployeeTeam.create({ employee_id: emp2.id, team_id: team2.id });
        console.log('Assignments created');

        // Log
        await Log.create({
            organisation_id: org.id,
            user_id: admin.id,
            action: 'seed_completed',
            meta: { message: 'Initial seed data' }
        });

        console.log('Seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
