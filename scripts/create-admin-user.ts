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

    // Default admin credentials (from ADMIN_CREDENTIALS.md)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@maishaprintingbd.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'MaishaAdmin@2024!';

    console.log(`Creating/updating admin user: ${adminEmail}`);

    // Check if user already exists
    const existingUser = await collection.findOne({ email: adminEmail });
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (existingUser) {
      console.log('⚠️  Admin user already exists. Updating password...');
      // Update existing user
      await collection.updateOne(
        { email: adminEmail },
        {
          $set: {
            password: hashedPassword,
            name: 'Administrator',
            role: 'admin',
            updatedAt: new Date(),
          },
        }
      );
      console.log('✅ Admin user password updated!');
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n⚠️  Password has been updated for existing user.');
      console.log('User ID:', existingUser._id);
    } else {
      // Create new admin user
      const result = await collection.insertOne({
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Admin user created!');
      
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n⚠️  IMPORTANT: Change the default password after first login!');
      console.log('User ID:', result.insertedId);
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed');
  }
}

createAdminUser();

