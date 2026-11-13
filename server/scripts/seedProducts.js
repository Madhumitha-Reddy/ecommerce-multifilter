import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';

const catalog = {
  Electronics: {
    brands: ['boAt', 'Sony', 'Samsung', 'JBL', 'Noise'],
    products: ['Studio Wireless Headphones', 'AMOLED Smart Watch', 'Portable Bluetooth Speaker', '1080p Webcam', 'Noise Cancelling Earbuds', 'Mechanical Keyboard', '4K Action Camera', '65W Fast Charger', 'USB-C Hub', 'Fitness Tracker', 'Mirrorless Camera', 'Smart LED Desk Lamp', 'Gaming Mouse', 'Power Bank 20000mAh', '4K Streaming Stick', 'Wireless Charging Pad', 'Ultrabook Laptop Stand', 'Premium Soundbar', 'Tablet with Stylus', 'Wi-Fi 6 Router'],
    images: ['photo-1498049794561-7780e7231661', 'photo-1505740420928-5e560c06d30e', 'photo-1523275335684-37898b6baf30', 'photo-1511707171634-5f897ff02aa9', 'photo-1517336714731-489689fd1ca8'], base: 799, step: 1199
  },
  Apparel: {
    brands: ['FabIndia', 'Levi’s', 'H&M', 'Roadster', 'W for Woman'],
    products: ['Classic Cotton Crew T-Shirt', 'Relaxed Fit Denim Jacket', 'Linen Blend Shirt', 'Everyday Chino Trousers', 'Floral Midi Dress', 'Lightweight Puffer Jacket', 'Organic Cotton Hoodie', 'High-Rise Straight Jeans', 'Striped Polo Shirt', 'Pleated Office Trousers', 'Handloom Cotton Kurta', 'Ribbed Knit Cardigan', 'Casual Bomber Jacket', 'Printed Summer Dress', 'Oxford Button-Down Shirt', 'Soft Fleece Sweatshirt', 'Tailored Blazer', 'Cotton Lounge Set', 'Textured Overshirt', 'Classic Denim Shorts'],
    images: ['photo-1483985988355-763728e1935b', 'photo-1529139574466-a303027c1d8', 'photo-1434389677669-e08b4cac3105', 'photo-1490481651871-ab68de25d43d', 'photo-1489987707025-afc232f7ea0f'], base: 699, step: 449
  },
  Footwear: {
    brands: ['Nike', 'Adidas', 'Puma', 'New Balance', 'Campus'],
    products: ['Everyday Running Shoes', 'Classic Leather Sneakers', 'Trail Performance Trainers', 'Lightweight Walking Shoes', 'Retro Court Sneakers', 'Cushioned Training Shoes', 'Slip-On Canvas Sneakers', 'Waterproof Hiking Boots', 'Minimalist Knit Runners', 'High-Top Street Sneakers', 'Cross-Training Shoes', 'Comfort Foam Slides', 'City Commute Loafers', 'Breathable Gym Trainers', 'Leather Derby Shoes', 'Outdoor Trekking Sandals', 'Heritage Suede Sneakers', 'Road Running Shoes', 'Classic Court Trainers', 'All-Terrain Sports Shoes'],
    images: ['photo-1542291026-7eec264c27ff', 'photo-1543163521-1bf539c55dd2', 'photo-1460353581641-37baddab0fa2', 'photo-1600185365483-26d7a4cc7519', 'photo-1552346154-21d32810aba3'], base: 1199, step: 639
  }
};

const imageParams = 'auto=format&fit=crop&w=900&q=85';
const products = Object.entries(catalog).flatMap(([category, data], categoryIndex) => data.products.map((name, index) => ({
  name: `${data.brands[(index + categoryIndex) % data.brands.length]} ${name}`,
  description: `A dependable ${name.toLowerCase()} designed for everyday comfort, thoughtful details, and lasting performance.`,
  category,
  brand: data.brands[(index + categoryIndex) % data.brands.length],
  price: Math.round((data.base + index * data.step + ((index * 317) % 1900)) / 10) * 10,
  rating: [4.2, 3.8, 4.7, 4.0, 3.4, 4.5, 5.0, 2.9, 4.3, 3.6, 4.8, 1.9, 4.1, 3.2, 4.6, 2.4, 3.9, 4.9, 3.0, 4.4][(index * 3 + categoryIndex) % 20],
  image: `https://images.unsplash.com/${data.images[index % data.images.length]}?${imageParams}`,
  stock: (index * 7 + categoryIndex * 5) % 42 + 1
})));

try {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products across ${Object.keys(catalog).length} categories.`);
} catch (error) {
  console.error(`Product seeding failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
