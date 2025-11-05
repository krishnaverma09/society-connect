require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Sample users data
const users = [
  {
    name: 'Admin One',
    email: 'admin@site.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Resident One',
    email: 'resident@site.com',
    password: 'resident123',
    role: 'resident',
    apartment: 'A-101',
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully\n');

    // Clear existing users
    console.log('🗑️  Clearing existing users...');
    await User.deleteMany({});
    console.log('✅ Existing users cleared\n');

    // Get salt rounds from environment or use default
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

    // Hash passwords and create users
    console.log('👥 Creating sample users...');
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    // Insert users into database
    const createdUsers = await User.insertMany(hashedUsers);

    // Display success message
    console.log('✅ Users created successfully!\n');
    console.log('📋 Created Users:');
    createdUsers.forEach((user) => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Admin:');
    console.log('     Email: admin@site.com');
    console.log('     Password: admin123');
    console.log('   Resident:');
    console.log('     Email: resident@site.com');
    console.log('     Password: resident123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seed function
seedDatabase();
