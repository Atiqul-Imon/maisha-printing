/**
 * Database Seeding Script
 * Run with: npx tsx scripts/seed-database.ts
 */

import { MongoClient } from 'mongodb';
import { getAllProducts } from '../src/data/products';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://maishaprintingbd_db_user:i9FBdnD8bys5IhlG@cluster0.7tn8m2a.mongodb.net/?appName=Cluster0';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('maisha_printing');
    const collection = db.collection('products');

    // Check if products already exist
    const existingProducts = await collection.countDocuments();
    if (existingProducts > 0) {
      console.log(`Database already has ${existingProducts} products. Skipping seed.`);
      console.log('To re-seed, delete existing products first.');
      return;
    }

    // Get initial products from local data
    const products = getAllProducts();

    // Insert products
    const result = await collection.insertMany(
      products.map((product) => ({
        ...product,
        _id: undefined, // Let MongoDB generate IDs
      }))
    );

    console.log(`Successfully seeded ${result.insertedCount} products!`);
    console.log('Products:', result.insertedIds);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

seedDatabase();

