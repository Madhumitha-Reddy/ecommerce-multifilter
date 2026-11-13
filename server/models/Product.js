import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Electronics', 'Apparel', 'Footwear'], index: true },
  brand: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0, index: true },
  rating: { type: Number, required: true, min: 1, max: 5, index: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true, min: 0, default: 0 }
}, { timestamps: true });

productSchema.index({ category: 1, price: 1, rating: -1 });
productSchema.index({ rating: -1, createdAt: -1 });

export default mongoose.model('Product', productSchema);
