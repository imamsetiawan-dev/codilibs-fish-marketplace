import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 5 },
  reviews: { type: Number, default: 0 },
  image: { type: String, default: '' },
  images: [{ type: String }],
  description: { type: String, default: '' },
  specification: { type: String, default: '' },
  care: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  isNewProduct: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('Product', productSchema)