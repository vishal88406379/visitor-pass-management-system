/**
 * Database Seed Script
 * Creates sample users and data for testing
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { hashPassword } = require('../utils/passwordUtils');
const User = require('../models/User');
const Visitor = require('../models/Visitor');
const Appointment = require('../models/Appointment');
const Pass = require('../models/Pass');
const CheckLog = require('../models/CheckLog');

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('\nPlease ensure you have a .env file in the backend directory with MONGODB_URI set.');
      console.log('\nOptions to fix this:');
      console.log('1. Use MongoDB Atlas (recommended):');
      console.log('   - Visit https://www.mongodb.com/cloud/atlas/register');
      console.log('   - Create a free account and cluster');
      console.log('   - Get your connection string and add it to backend/.env');
      console.log('   - Example: MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/visitor-pass-management?retryWrites=true&w=majority');
      console.log('\n2. Use local MongoDB:');
      console.log('   - Install MongoDB locally');
      console.log('   - Start MongoDB service');
      console.log('   - Ensure backend/.env has: MONGODB_URI=mongodb://localhost:27017/visitor-pass-management');
      console.log('\n3. Use Docker (quick):');
      console.log('   - Run: docker run -d -p 27017:27017 --name mongodb mongo:latest');
      console.log('   - Ensure backend/.env has: MONGODB_URI=mongodb://localhost:27017/visitor-pass-management');
      process.exit(1);
    }

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Visitor.deleteMany({});
    await Appointment.deleteMany({});
    await Pass.deleteMany({});
    await CheckLog.deleteMany({});
    console.log('Cleared existing data');

    // Hash password
    const password = await hashPassword('password123');

    // Create users
    const admin = await User.create({
      email: 'admin@example.com',
      password,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '+1234567890',
      department: 'Administration',
    });

    const security = await User.create({
      email: 'security@example.com',
      password,
      firstName: 'Security',
      lastName: 'Guard',
      role: 'security',
      phone: '+1234567891',
      department: 'Security',
    });

    const employee = await User.create({
      email: 'employee@example.com',
      password,
      firstName: 'John',
      lastName: 'Doe',
      role: 'employee',
      phone: '+1234567892',
      department: 'Engineering',
    });

    console.log('Created users');

    // Create visitors
    const visitor1 = await Visitor.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567893',
      company: 'Tech Corp',
      purpose: 'Business Meeting',
      createdBy: security._id,
    });

    const visitor2 = await Visitor.create({
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1234567894',
      company: 'Design Studio',
      purpose: 'Interview',
      createdBy: security._id,
    });

    console.log('Created visitors');

    // Create appointments
    await Appointment.create({
      visitor: visitor1._id,
      host: employee._id,
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      scheduledTime: '10:00 AM',
      purpose: 'Discuss project requirements',
      status: 'pending',
      location: 'Conference Room A',
    });

    await Appointment.create({
      visitor: visitor2._id,
      host: employee._id,
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      scheduledTime: '2:00 PM',
      purpose: 'Technical interview',
      status: 'approved',
      location: 'Meeting Room 3',
      approvedBy: employee._id,
      approvedAt: new Date(),
    });

    console.log('Created appointments');

    // Create passes
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const pass1 = await Pass.create({
      passNumber: 'PASS-001',
      visitor: visitor1._id,
      appointment: (await Appointment.findOne({ visitor: visitor1._id }))._id,
      validFrom: new Date(),
      validUntil: tomorrow,
      issuedBy: security._id,
      qrCode: 'PASS-001',
      qrCodeImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACCCAMAAADQNkiAAAAA1BMVEW10NBjBBbqAAAAH0lEQVRo3u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBLcQ8AAa0jZQAAAABJRU5ErkJggg=='
    });
    
    console.log('Created passes');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:');
    console.log('  Email: admin@example.com');
    console.log('  Password: password123');
    console.log('\nSecurity:');
    console.log('  Email: security@example.com');
    console.log('  Password: password123');
    console.log('\nEmployee:');
    console.log('  Email: employee@example.com');
    console.log('  Password: password123');
    console.log('\nVisitor:');
    console.log('  Email: jane.smith@example.com');
    console.log('  Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
