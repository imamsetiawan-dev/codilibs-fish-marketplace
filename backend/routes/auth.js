import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// POST Register
router.post('/register', async (req, res) => {
  try {
    const { nama, email, password, telepon } = req.body

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email sudah terdaftar' })

    const hashed = await bcrypt.hash(password, 10)
    const user = new User({ nama, email, password: hashed, telepon })
    await user.save()

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: { id: user._id, nama: user.nama, email: user.email, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Email tidak ditemukan' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ error: 'Password salah' })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: { id: user._id, nama: user.nama, email: user.email, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET Profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Unauthorized' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(401).json({ error: 'Token tidak valid' })
  }
})

export default router