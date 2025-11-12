/**
 * Script to clean up products and services from MongoDB Atlas
 * This will delete ALL products from the database
 * Run with: tsx scripts/cleanup-products.ts
 * 
 * WARNING: This action cannot be undone!
 */

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://maishaprintingbd_db_user:i9FBdnD8bys5IhlG@cluster0.7tn8m2a.mongodb.net/?appName=Cluster0';

async function cleanupProducts() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('⚠️  WARNING: This will delete ALL products from the database!');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    
    // Wait 5 seconds for user to cancel
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('maisha_printing');
    const collection = db.collection('products');

    // Count existing products
    const countBefore = await collection.countDocuments({});
    console.log(`📊 Found ${countBefore} product(s) in the database.`);

    if (countBefore === 0) {
      console.log('✅ Database is already empty. Nothing to clean up.');
      await client.close();
      process.exit(0);
    }

    // Delete all products
    console.log('🗑️  Deleting all products...');
    const result = await collection.deleteMany({});
    
    console.log(`✅ Successfully deleted ${result.deletedCount} product(s).`);
    
    // Verify deletion
    const countAfter = await collection.countDocuments({});
    if (countAfter === 0) {
      console.log('✅ Database cleanup completed successfully!');
      console.log('✅ All products have been removed from MongoDB Atlas.');
    } else {
      console.warn(`⚠️  Warning: ${countAfter} product(s) still remain in the database.`);
    }

    await client.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning up products:', error);
    await client.close();
    process.exit(1);
  }
}

// Run the cleanup
cleanupProducts();

