/**
 * Script to set up MongoDB indexes for optimal query performance
 * Run with: tsx scripts/setup-indexes.ts
 */

import { getProductsCollection, getUsersCollection, getOrdersCollection } from '../src/lib/mongodb';

async function setupIndexes() {
  try {
    console.log('Setting up MongoDB indexes...');

    // Setup products collection indexes
    const productsCollection = await getProductsCollection();
    if (productsCollection) {
      // Index on slug for fast lookups
      await productsCollection.createIndex({ slug: 1 }, { unique: true });
      console.log('✓ Created index on products.slug');

      // Index on order for fast sorting
      await productsCollection.createIndex({ order: 1 });
      console.log('✓ Created index on products.order');

      // Index on category for filtering
      await productsCollection.createIndex({ category: 1 });
      console.log('✓ Created index on products.category');

      // Index on featured for filtering featured products
      await productsCollection.createIndex({ featured: 1 });
      console.log('✓ Created index on products.featured');

      // Compound index for common queries (order + createdAt)
      await productsCollection.createIndex({ order: 1, createdAt: -1 });
      console.log('✓ Created compound index on products.order + createdAt');

      console.log('✓ Products collection indexes set up successfully');
    } else {
      console.log('⚠ Products collection not available (MongoDB not configured)');
    }

    // Setup users collection indexes
    const usersCollection = await getUsersCollection();
    if (usersCollection) {
      // Index on email for fast lookups
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      console.log('✓ Created index on users.email');

      console.log('✓ Users collection indexes set up successfully');
    } else {
      console.log('⚠ Users collection not available (MongoDB not configured)');
    }

    // Setup orders collection indexes
    const ordersCollection = await getOrdersCollection();
    if (ordersCollection) {
      // Index on orderNumber for fast lookups
      await ordersCollection.createIndex({ orderNumber: 1 }, { unique: true });
      console.log('✓ Created index on orders.orderNumber');

      // Index on status for filtering
      await ordersCollection.createIndex({ status: 1 });
      console.log('✓ Created index on orders.status');

      // Index on paymentStatus for filtering
      await ordersCollection.createIndex({ paymentStatus: 1 });
      console.log('✓ Created index on orders.paymentStatus');

      // Index on customer phone for searching
      await ordersCollection.createIndex({ 'customer.phone': 1 });
      console.log('✓ Created index on orders.customer.phone');

      // Index on customer email for searching
      await ordersCollection.createIndex({ 'customer.email': 1 });
      console.log('✓ Created index on orders.customer.email');

      // Index on createdAt for sorting
      await ordersCollection.createIndex({ createdAt: -1 });
      console.log('✓ Created index on orders.createdAt');

      // Compound indexes for common queries
      await ordersCollection.createIndex({ status: 1, createdAt: -1 });
      console.log('✓ Created compound index on orders.status + createdAt');

      await ordersCollection.createIndex({ paymentStatus: 1, status: 1 });
      console.log('✓ Created compound index on orders.paymentStatus + status');

      console.log('✓ Orders collection indexes set up successfully');
    } else {
      console.log('⚠ Orders collection not available (MongoDB not configured)');
    }

    console.log('\n✅ All indexes set up successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up indexes:', error);
    process.exit(1);
  }
}

setupIndexes();

