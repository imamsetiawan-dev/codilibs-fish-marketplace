import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: {
    nama: String,
    telepon: String,
    email: { type: String, default: '' },
    alamat: String,
    kota: String,
    provinsi: String,
    kodePos: String,
    catatan: String,
  },
  items: [{
    id: String,
    name: String,
    price: Number,
    qty: Number,
    image: String,
  }],
  pengiriman: {
    label: String,
    harga: Number,
    estimasi: String,
  },
  subtotal: { type: Number, required: true },
  ongkir: { type: Number, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed', 'expired'],
    default: 'pending'
  },
  snapToken: { type: String },
  midtransOrderId: { type: String },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)