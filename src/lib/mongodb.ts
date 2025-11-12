/**
 * MongoDB Connection Utility
 */

import { MongoClient, Db } from 'mongodb';

const getUri = (): string | null => {
  return process.env.MONGODB_URI || null;
};

// MongoDB connection options for better performance and reliability
const options = {
  maxPoolSize: 10, // Maximum number of connections in the connection pool
  minPoolSize: 2, // Minimum number of connections in the connection pool
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
  serverSelectionTimeoutMS: 5000, // How long to try selecting a server
  socketTimeoutMS: 45000, // How long to wait for a socket connection
  connectTimeoutMS: 10000, // How long to wait for initial connection
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> | null {
  const uri = getUri();
  if (!uri) {
    return null;
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    return globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

clientPromise = getClientPromise();

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

/**
 * Get database instance
 */
export async function getDatabase(): Promise<Db | null> {
  const promise = getClientPromise();
  if (!promise) {
    return null;
  }
  const client = await promise;
  return client.db('maisha_printing');
}

/**
 * Get products collection
 * Returns null if MongoDB is not configured
 */
export async function getProductsCollection() {
  const db = await getDatabase();
  if (!db) {
    return null;
  }
  return db.collection('products');
}

/**
 * Get users collection
 * Returns null if MongoDB is not configured
 */
export async function getUsersCollection() {
  const db = await getDatabase();
  if (!db) {
    return null;
  }
  return db.collection('users');
}

