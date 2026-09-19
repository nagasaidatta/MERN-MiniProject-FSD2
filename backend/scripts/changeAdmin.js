/**
 * Utility script to safely update Administrator credentials (Email, Password, User ID, Name)
 * Usage:
 *   node scripts/changeAdmin.js <newEmail> <newPassword> [newUserId] [newName]
 *
 * Example:
 *   node scripts/changeAdmin.js admin@mygov.in MyNewPass@2026
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const User = require('../models/User');

const changeAdmin = async () => {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('\n❌ Missing required arguments.');
    console.log('Usage:');
    console.log('  node scripts/changeAdmin.js <newEmail> <newPassword> [newUserId] [newName]\n');
    console.log('Example:');
    console.log('  node scripts/changeAdmin.js admin@customgov.in MySecretPass@123\n');
    process.exit(1);
  }

  const [newEmail, newPassword, newUserId, newName] = args;

  if (newPassword.length < 6) {
    console.error('❌ Password must be at least 6 characters.');
    process.exit(1);
  }

  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not configured in backend/.env');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas.');

    // Find current administrator account
    let admin = await User.findOne({ role: 'admin' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (admin) {
      admin.email = newEmail.toLowerCase().trim();
      admin.password = hashedPassword;
      if (newUserId) admin.userId = newUserId.trim();
      if (newName) admin.name = newName.trim();
      await admin.save();
      console.log('✅ Administrator credentials updated successfully:');
    } else {
      admin = await User.create({
        userId: newUserId ? newUserId.trim() : 'USR-ADMIN-01',
        name: newName ? newName.trim() : 'Official Administrator',
        email: newEmail.toLowerCase().trim(),
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ New Administrator account created:');
    }

    console.log(`   • User ID:  ${admin.userId}`);
    console.log(`   • Name:     ${admin.name}`);
    console.log(`   • Email/ID: ${admin.email}`);
    console.log(`   • Role:     ${admin.role}`);
    console.log(`   • Password: (encrypted with bcrypt)\n`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to update administrator:', err.message);
    process.exit(1);
  }
};

changeAdmin();
