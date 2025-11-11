/**
 * Verify Admin Credentials Script
 * Run with: npx tsx scripts/verify-admin-credentials.ts
 * 
 * This script verifies if admin credentials are correct in MongoDB
 */

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://maishaprintingbd_db_user:i9FBdnD8bys5IhlG@cluster0.7tn8m2a.mongodb.net/?appName=Cluster0';

// Credentials to verify
const TEST_EMAIL = 'admin@maishaprintingbd.com';
const TEST_PASSWORD = 'MaishaAdmin@2024!';

async function verifyCredentials() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('maisha_printing');
    const collection = db.collection('users');

    console.log('🔍 Searching for user:', TEST_EMAIL);
    console.log('─────────────────────────────────────────\n');

    // Find user by email
    const user = await collection.findOne({ email: TEST_EMAIL });

    if (!user) {
      console.log('❌ USER NOT FOUND');
      console.log(`   Email "${TEST_EMAIL}" does not exist in the database.\n`);
      
      // Check what users exist
      const allUsers = await collection.find({}).toArray();
      console.log('📋 Existing users in database:');
      if (allUsers.length === 0) {
        console.log('   No users found in database.');
      } else {
        allUsers.forEach((u: any) => {
          console.log(`   - ${u.email} (Role: ${u.role || 'N/A'})`);
        });
      }
      console.log('\n💡 To create the admin user, run:');
      console.log(`   ADMIN_EMAIL=${TEST_EMAIL} ADMIN_PASSWORD="${TEST_PASSWORD}" npm run create-admin`);
      return;
    }

    console.log('✅ USER FOUND');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   Role: ${user.role || 'N/A'}`);
    console.log(`   User ID: ${user._id}`);
    console.log(`   Has Password: ${user.password ? 'Yes' : 'No'}\n`);

    if (!user.password) {
      console.log('❌ PASSWORD CHECK FAILED');
      console.log('   User exists but has no password set.\n');
      console.log('💡 To set the password, run:');
      console.log(`   ADMIN_EMAIL=${TEST_EMAIL} ADMIN_PASSWORD="${TEST_PASSWORD}" npm run create-admin`);
      return;
    }

    // Verify password
    console.log('🔐 Verifying password...');
    const isValid = await bcrypt.compare(TEST_PASSWORD, user.password);

    if (isValid) {
      console.log('✅ PASSWORD VERIFICATION SUCCESSFUL');
      console.log('   The credentials are CORRECT!\n');
      console.log('📝 Summary:');
      console.log(`   Email: ${TEST_EMAIL}`);
      console.log(`   Password: ${TEST_PASSWORD} (verified)`);
      console.log(`   Status: ✅ VALID CREDENTIALS\n`);
    } else {
      console.log('❌ PASSWORD VERIFICATION FAILED');
      console.log('   The password does not match.\n');
      console.log('💡 Possible reasons:');
      console.log('   1. Wrong password provided');
      console.log('   2. Password was changed in database');
      console.log('   3. Password hash is corrupted\n');
      console.log('💡 To reset the password, run:');
      console.log(`   ADMIN_EMAIL=${TEST_EMAIL} ADMIN_PASSWORD="${TEST_PASSWORD}" npm run create-admin`);
      console.log('   (This will update the existing user)\n');
    }

    // Test with alternative credentials
    console.log('─────────────────────────────────────────');
    console.log('🧪 Testing alternative credentials:\n');
    
    const altEmail = 'admin@maishaprinting.com';
    const altPassword = 'Admin@123';
    
    const altUser = await collection.findOne({ email: altEmail });
    if (altUser && altUser.password) {
      const altIsValid = await bcrypt.compare(altPassword, altUser.password);
      console.log(`   ${altEmail}: ${altIsValid ? '✅ Valid' : '❌ Invalid'}`);
    } else {
      console.log(`   ${altEmail}: ❌ User not found`);
    }

  } catch (error) {
    console.error('❌ Error verifying credentials:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n📡 Database connection closed');
  }
}

verifyCredentials();

