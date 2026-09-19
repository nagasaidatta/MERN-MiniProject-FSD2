require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Scheme = require('../models/Scheme');
const Application = require('../models/Application');

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in backend/.env');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas for seeding.');

    // Clear existing collections
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Scheme.deleteMany({});
    await Application.deleteMany({});

    // Hash default passwords
    const adminPassword = await bcrypt.hash('Admin@12345', 10);
    const citizenPassword = await bcrypt.hash('Citizen@12345', 10);

    // 1. Seed Users (1 Admin, 3 Citizens)
    const users = [
      {
        userId: 'USR-ADMIN-01',
        name: 'Official Administrator',
        email: 'admin@govportal.in',
        password: adminPassword,
        role: 'admin'
      },
      {
        userId: 'USR-CITIZEN-01',
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        password: citizenPassword,
        role: 'citizen'
      },
      {
        userId: 'USR-CITIZEN-02',
        name: 'Rahul Verma',
        email: 'rahul.verma@example.com',
        password: citizenPassword,
        role: 'citizen'
      },
      {
        userId: 'USR-CITIZEN-03',
        name: 'Anita Desai',
        email: 'anita.desai@example.com',
        password: citizenPassword,
        role: 'citizen'
      }
    ];

    await User.insertMany(users);
    console.log('👤 Seeded 4 Users (1 Admin, 3 Citizens)');

    // 2. Seed Government Schemes
    const schemes = [
      {
        schemeId: 'SCH-101',
        schemeName: 'National Higher Education Merit Scholarship',
        schemeCategory: 'Students',
        eligibility: 'Undergraduate or Postgraduate students with family annual income < ₹2,50,000 and min. 75% marks in previous qualifying exam.',
        benefitAmount: '₹50,000 per academic year',
        lastDate: '2026-12-31',
        schemeStatus: 'Active'
      },
      {
        schemeId: 'SCH-102',
        schemeName: 'PM Kisan Small Farmer Income Support',
        schemeCategory: 'Farmers',
        eligibility: 'Small and marginal landholder farmer families with cultivable landholding up to 2 hectares.',
        benefitAmount: '₹6,000 annually in three installments',
        lastDate: '2026-11-30',
        schemeStatus: 'Active'
      },
      {
        schemeId: 'SCH-103',
        schemeName: 'Senior Citizen Unified Health Shield',
        schemeCategory: 'Senior Citizens',
        eligibility: 'Citizens aged 60 years and above not covered under commercial health insurance policies.',
        benefitAmount: '₹5,00,000 cashless hospitalization cover / family / year',
        lastDate: '2026-10-15',
        schemeStatus: 'Active'
      },
      {
        schemeId: 'SCH-104',
        schemeName: 'Women Micro-Enterprise Startup Grant',
        schemeCategory: 'Women',
        eligibility: 'Women entrepreneurs starting individual or Self-Help Group micro-business initiatives.',
        benefitAmount: '₹1,00,000 one-time direct capital grant',
        lastDate: '2026-12-15',
        schemeStatus: 'Active'
      },
      {
        schemeId: 'SCH-105',
        schemeName: 'EWS Urban Housing Subsidy Initiative',
        schemeCategory: 'Economically Weaker Sections',
        eligibility: 'Economically Weaker Section families with annual household income up to ₹3,00,000 without pucca house.',
        benefitAmount: '₹2,67,000 interest subsidy on home construction loan',
        lastDate: '2026-10-31',
        schemeStatus: 'Active'
      },
      {
        schemeId: 'SCH-106',
        schemeName: 'Vocational Youth Skill Apprenticeship Allowance',
        schemeCategory: 'Students',
        eligibility: 'Unemployed diploma or ITI graduates between 18 and 28 years enrolled in recognized technical apprenticeship.',
        benefitAmount: '₹8,500 monthly stipend for 12 months',
        lastDate: '2026-11-20',
        schemeStatus: 'Active'
      },
      {
        schemeId: 'SCH-107',
        schemeName: 'Solar Agriculture Pump Subsidy Scheme',
        schemeCategory: 'Farmers',
        eligibility: 'Farmers having valid agricultural electricity connection or un-electrified diesel pump.',
        benefitAmount: 'Up to 60% direct subsidy on standalone solar pumps',
        lastDate: '2026-09-30',
        schemeStatus: 'Active'
      },
      {
        schemeId: 'SCH-108',
        schemeName: 'Widow & Destitute Women Livelihood Pension',
        schemeCategory: 'Women',
        eligibility: 'Widows and destitute women aged 18 to 59 years living below poverty line without economic support.',
        benefitAmount: '₹3,000 monthly direct bank transfer',
        lastDate: '2026-12-31',
        schemeStatus: 'Active'
      }
    ];

    await Scheme.insertMany(schemes);
    console.log('📜 Seeded 8 Government Schemes across 5 diverse categories');

    // 3. Seed Applications with diverse statuses
    const applications = [
      {
        applicationId: 'APP-2024-001',
        citizenId: 'USR-CITIZEN-01',
        schemeId: 'SCH-101',
        applicationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        applicationStatus: 'Approved'
      },
      {
        applicationId: 'APP-2024-002',
        citizenId: 'USR-CITIZEN-01',
        schemeId: 'SCH-104',
        applicationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        applicationStatus: 'Pending'
      },
      {
        applicationId: 'APP-2024-003',
        citizenId: 'USR-CITIZEN-02',
        schemeId: 'SCH-102',
        applicationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        applicationStatus: 'Approved'
      },
      {
        applicationId: 'APP-2024-004',
        citizenId: 'USR-CITIZEN-02',
        schemeId: 'SCH-107',
        applicationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        applicationStatus: 'Pending'
      },
      {
        applicationId: 'APP-2024-005',
        citizenId: 'USR-CITIZEN-02',
        schemeId: 'SCH-105',
        applicationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        applicationStatus: 'Rejected'
      },
      {
        applicationId: 'APP-2024-006',
        citizenId: 'USR-CITIZEN-03',
        schemeId: 'SCH-103',
        applicationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        applicationStatus: 'Approved'
      },
      {
        applicationId: 'APP-2024-007',
        citizenId: 'USR-CITIZEN-03',
        schemeId: 'SCH-108',
        applicationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        applicationStatus: 'Pending'
      }
    ];

    await Application.insertMany(applications);
    console.log('📝 Seeded 7 Sample Applications across Pending, Approved, and Rejected statuses');

    console.log('\n=============================================');
    console.log('🎉 Seed Database Complete!');
    console.log('---------------------------------------------');
    console.log('ADMIN DEMO CREDENTIALS:');
    console.log('  Email:    admin@govportal.in');
    console.log('  Password: Admin@12345');
    console.log('---------------------------------------------');
    console.log('CITIZEN DEMO CREDENTIALS:');
    console.log('  Email:    priya.sharma@example.com');
    console.log('  Password: Citizen@12345');
    console.log('  (Other: rahul.verma@example.com, anita.desai@example.com)');
    console.log('=============================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
