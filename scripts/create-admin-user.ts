/**
 * Create Admin User Script
 * Run with: npx tsx scripts/create-admin-user.ts
 * 
 * This script creates the initial admin user in MongoDB
 */

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://maishaprintingbd_db_user:i9FBdnD8bys5IhlG@cluster0.7tn8m2a.mongodb.net/?appName=Cluster0';

interface AdminUser {
  email: string;
  password: string;
  name?: string;
}

async function createAdminUser() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('maisha_printing');
    const collection = db.collection('users');

    // Default admin credentials (CHANGE THESE IN PRODUCTION!)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@maishaprinting.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123'; // CHANGE THIS!

    console.log(`Creating admin user: ${adminEmail}`);

    // Check if user already exists
    const existingUser = await collection.findOne({ email: adminEmail });
    if (existingUser) {
      console.log('Admin user already exists. To reset password, delete the user first.');
      console.log('Or update the password manually in MongoDB.');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const result = await collection.insertOne({
      email: adminEmail,
      password: hashedPassword,
      name: 'Administrator',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!');
    console.log('User ID:', result.insertedId);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

createAdminUser();

