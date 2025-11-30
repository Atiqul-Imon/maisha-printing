/**
 * Seed Products Database Script
 * Run with: npx tsx scripts/seed-products.ts
 * 
 * This script populates MongoDB with dummy products/services
 * including prices and all required fields
 */

import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://maishaprintingbd_db_user:i9FBdnD8bys5IhlG@cluster0.7tn8m2a.mongodb.net/?appName=Cluster0';

interface ProductSeed {
  title: string;
  shortDescription: string;
  longDescription: string;
  category: 'service' | 'product';
  subcategory?: string;
  slug: string;
  price?: number;
  currency?: string;
  featured: boolean;
  images: Array<{ url: string; alt: string }>;
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

const dummyProducts: ProductSeed[] = [
  {
    title: 'T-Shirt Printing',
    shortDescription: 'High-quality custom t-shirt printing for businesses and events.',
    longDescription: 'We offer professional t-shirt printing services with various printing methods including screen printing, DTG (Direct to Garment), and heat transfer. Perfect for corporate events, team uniforms, promotional campaigns, and personal use. We use premium quality fabrics and eco-friendly inks to ensure durability and vibrant colors.',
    category: 'service',
    subcategory: 'Apparel',
    slug: 't-shirt-printing',
    price: 250,
    currency: 'BDT',
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        alt: 'Custom printed t-shirts'
      },
      {
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
        alt: 'T-shirt printing process'
      }
    ],
    order: 1,
    metaTitle: 'T-Shirt Printing Services in Bangladesh',
    metaDescription: 'Professional t-shirt printing services with custom designs. Fast turnaround and competitive prices.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'Visiting Card Printing',
    shortDescription: 'Premium business card printing with various finishes and designs.',
    longDescription: 'Create professional business cards that make a lasting impression. We offer matte, glossy, and textured finishes with options for rounded corners, embossing, and foil stamping. Available in standard and custom sizes. Perfect for networking and professional branding.',
    category: 'service',
    subcategory: 'Business Cards',
    slug: 'visiting-card-printing',
    price: 500,
    currency: 'BDT',
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1531496730074-4c1a2345a369?w=800',
        alt: 'Professional business cards'
      },
      {
        url: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=800',
        alt: 'Business card design options'
      }
    ],
    order: 2,
    metaTitle: 'Visiting Card Printing Services',
    metaDescription: 'Premium business card printing with custom designs and finishes.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'ID Card Printing',
    shortDescription: 'Durable and professional ID card printing for organizations.',
    longDescription: 'We produce high-quality ID cards for schools, offices, events, and organizations. Our ID cards feature PVC material for durability, include barcode/QR code options, and can be customized with photos, logos, and security features. Fast production with same-day service available.',
    category: 'service',
    subcategory: 'Identification',
    slug: 'id-card-printing',
    price: 30,
    currency: 'BDT',
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        alt: 'Professional ID cards'
      }
    ],
    order: 3,
    metaTitle: 'ID Card Printing Services',
    metaDescription: 'Professional ID card printing with PVC material and customization options.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'Flyer & Brochure Printing',
    shortDescription: 'Eye-catching flyers and brochures for marketing campaigns.',
    longDescription: 'Design and print high-quality flyers and brochures for your marketing needs. We offer various paper types, sizes, and finishes including glossy, matte, and textured. Perfect for events, promotions, product launches, and business information. We can handle small to large print runs with competitive pricing.',
    category: 'service',
    subcategory: 'Marketing Materials',
    slug: 'flyer-brochure-printing',
    price: 2,
    currency: 'BDT',
    featured: true,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: 'Printed flyers and brochures'
      },
      {
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800',
        alt: 'Brochure design samples'
      },
      {
        url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
        alt: 'Marketing flyers'
      }
    ],
    order: 4,
    metaTitle: 'Flyer and Brochure Printing Services',
    metaDescription: 'Professional flyer and brochure printing for marketing campaigns.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'Calendar Printing',
    shortDescription: 'Custom calendar printing for businesses and personal use.',
    longDescription: 'Create beautiful custom calendars with your photos, designs, or branding. Available in wall calendars, desk calendars, and pocket calendars. We offer various sizes and paper types. Perfect for corporate gifts, promotional items, or personal use. High-quality printing ensures your images look stunning all year round.',
    category: 'service',
    subcategory: 'Calendars',
    slug: 'calendar-printing',
    price: 150,
    currency: 'BDT',
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        alt: 'Custom printed calendars'
      },
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        alt: 'Desk calendar printing'
      }
    ],
    order: 5,
    metaTitle: 'Calendar Printing Services',
    metaDescription: 'Custom calendar printing with your photos and designs.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'Sticker Printing',
    shortDescription: 'Custom sticker printing in various shapes, sizes, and finishes.',
    longDescription: 'We produce high-quality custom stickers for branding, packaging, promotions, and personal use. Available in vinyl, paper, and waterproof materials. Options include die-cut shapes, clear stickers, and various finishes. Perfect for product labeling, vehicle branding, and promotional campaigns.',
    category: 'service',
    subcategory: 'Labels & Stickers',
    slug: 'sticker-printing',
    price: 1,
    currency: 'BDT',
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800',
        alt: 'Custom printed stickers'
      },
      {
        url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800',
        alt: 'Sticker printing samples'
      }
    ],
    order: 6,
    metaTitle: 'Sticker Printing Services',
    metaDescription: 'Custom sticker printing with various materials and finishes.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'Glass Printing',
    shortDescription: 'Premium glass printing for signage and decorative purposes.',
    longDescription: 'Professional glass printing services for storefronts, offices, and homes. We offer frosted glass, full-color printing, and UV-resistant inks for outdoor use. Perfect for office partitions, shop windows, and decorative glass panels. Durable and long-lasting results.',
    category: 'service',
    subcategory: 'Signage',
    slug: 'glass-printing',
    price: 800,
    currency: 'BDT',
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        alt: 'Printed glass signage'
      },
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: 'Glass printing samples'
      }
    ],
    order: 7,
    metaTitle: 'Glass Printing Services',
    metaDescription: 'Professional glass printing for signage and decoration.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'Ribbon Printing',
    shortDescription: 'Custom ribbon printing for events and packaging.',
    longDescription: 'We offer custom ribbon printing for gift wrapping, events, ceremonies, and promotional purposes. Available in various widths, colors, and materials. Perfect for weddings, corporate events, and retail packaging. High-quality printing ensures your message or logo looks crisp and professional.',
    category: 'service',
    subcategory: 'Packaging',
    slug: 'ribbon-printing',
    price: 50,
    currency: 'BDT',
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
        alt: 'Custom printed ribbons'
      }
    ],
    order: 8,
    metaTitle: 'Ribbon Printing Services',
    metaDescription: 'Custom ribbon printing for events and packaging.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'Poster Printing',
    shortDescription: 'Large format poster printing for events and advertising.',
    longDescription: 'We produce high-quality posters in various sizes for events, advertising, and decoration. Available in matte, glossy, and canvas finishes. Perfect for concerts, exhibitions, retail displays, and home decoration. Fast turnaround with competitive pricing for both small and large quantities.',
    category: 'service',
    subcategory: 'Large Format',
    slug: 'poster-printing',
    price: 100,
    currency: 'BDT',
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        alt: 'Printed posters'
      },
      {
        url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
        alt: 'Poster printing samples'
      }
    ],
    order: 9,
    metaTitle: 'Poster Printing Services',
    metaDescription: 'Large format poster printing for events and advertising.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'Banner Printing',
    shortDescription: 'Durable banner printing for outdoor and indoor use.',
    longDescription: 'Professional banner printing services for events, promotions, and advertising. We use weather-resistant materials for outdoor banners and offer various sizes and mounting options. Perfect for grand openings, sales events, trade shows, and political campaigns. High-quality printing ensures your message is clear and impactful.',
    category: 'service',
    subcategory: 'Large Format',
    slug: 'banner-printing',
    price: 300,
    currency: 'BDT',
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
        alt: 'Printed banners'
      },
      {
        url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        alt: 'Banner printing samples'
      }
    ],
    order: 10,
    metaTitle: 'Banner Printing Services',
    metaDescription: 'Professional banner printing for outdoor and indoor use.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seedProducts() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('maisha_printing');
    const collection = db.collection('products');

    // Check if products already exist
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  Database already has ${existingCount} products.`);
      console.log('   Options:');
      console.log('   1. Delete existing products first (run: npm run cleanup-products)');
      console.log('   2. Continue to add new products (duplicates may be created)');
      console.log('\n   Continuing to add products...\n');
    }

    // Insert products
    const result = await collection.insertMany(dummyProducts);

    console.log(`\n✅ Successfully seeded ${result.insertedCount} products!`);
    console.log('\n📦 Products added:');
    dummyProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} - ${product.price ? `৳${product.price}` : 'Contact for pricing'}`);
    });

    // Display summary
    const totalCount = await collection.countDocuments();
    const withPrice = await collection.countDocuments({ price: { $exists: true, $ne: null } });
    const featured = await collection.countDocuments({ featured: true });
    
    console.log('\n📊 Database Summary:');
    console.log(`   Total Products: ${totalCount}`);
    console.log(`   Products with Price: ${withPrice}`);
    console.log(`   Featured Products: ${featured}`);
    console.log('\n✨ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

seedProducts();

