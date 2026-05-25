import mongoose from 'mongoose'

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slot: {
    type: String,
    enum: ['leaderboard-top', 'rectangle-left', 'rectangle-right', 'footer'],
    required: true,
  },
  type: {
    type: String,
    enum: ['image', 'adsense', 'custom'],
    default: 'image',
  },
  imageUrl: { type: String, default: '' },
  linkUrl: { type: String, default: '' },
  adsenseCode: { type: String, default: '' },
  customCode: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Ad', adSchema)