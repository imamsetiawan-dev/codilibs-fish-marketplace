import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telepon: { type: String, default: '' },
  alamat: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true })

export default mongoose.model('User', userSchema)