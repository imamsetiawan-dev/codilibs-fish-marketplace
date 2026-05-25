import express from 'express'
import Ad from '../models/Ad.js'

const router = express.Router()

// GET semua ads aktif (untuk frontend)
router.get('/', async (req, res) => {
  try {
    const { slot } = req.query
    const query = { isActive: true }
    if (slot) query.slot = slot
    const ads = await Ad.find(query)
    res.json(ads)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET semua ads (untuk admin)
router.get('/all', async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 })
    res.json(ads)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST tambah ads
router.post('/', async (req, res) => {
  try {
    const ad = new Ad(req.body)
    await ad.save()
    res.status(201).json(ad)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update ads
router.put('/:id', async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    )
    if (!ad) return res.status(404).json({ error: 'Ads tidak ditemukan' })
    res.json(ad)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE ads
router.delete('/:id', async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id)
    res.json({ message: 'Ads berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router