/**
 * Reset Database and Create New Admin Script
 * Run with: npx tsx scripts/reset-database.ts
 * 
 * This script:
 * 1. Clears all collections (users and products)
 * 2. Creates a new admin user with fresh credentials
 */

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://maishaprintingbd_db_user:i9FBdnD8bys5IhlG@cluster0.7tn8m2a.mongodb.net/?appName=Cluster0';

// Generate secure random password
function generateSecurePassword(): string {
  const length = 16;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

async function resetDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('maisha_printing');
    
    // Generate new admin credentials
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@maishaprintingbd.com';
    const adminPassword = process.env.ADMIN_PASSWORD || generateSecurePassword();

    console.log('\n🗑️  Clearing database collections...');
    
    // Clear users collection
    const usersCollection = db.collection('users');
    const usersCount = await usersCollection.countDocuments();
    if (usersCount > 0) {
      await usersCollection.deleteMany({});
      console.log(`   ✅ Deleted ${usersCount} user(s) from 'users' collection`);
    } else {
      console.log('   ℹ️  No users to delete');
    }

    // Clear products collection
    const productsCollection = db.collection('products');
    const productsCount = await productsCollection.countDocuments();
    if (productsCount > 0) {
      await productsCollection.deleteMany({});
      console.log(`   ✅ Deleted ${productsCount} product(s) from 'products' collection`);
    } else {
      console.log('   ℹ️  No products to delete');
    }

    console.log('\n👤 Creating new admin user...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create new admin user
    const result = await usersCollection.insertOne({
      email: adminEmail,
      password: hashedPassword,
      name: 'Administrator',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✅ Admin user created successfully!');
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 NEW ADMIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:    ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`🆔 User ID:  ${result.insertedId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Save these credentials securely!');
    console.log('⚠️  The database has been completely cleared.');
    console.log('⚠️  All previous users and products have been deleted.\n');

  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

resetDatabase();

