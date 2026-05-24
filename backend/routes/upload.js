import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'aquashop',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB per file
})

const router = express.Router()

// Upload single image
router.post('/single', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Tidak ada file' })
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Upload multiple images (max 5)
router.post('/multiple', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Tidak ada file' })
    }
    const urls = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
    }))
    res.json(urls)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete image
router.delete('/:public_id', async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.public_id)
    res.json({ message: 'Gambar berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router