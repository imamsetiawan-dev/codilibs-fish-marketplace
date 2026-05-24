import express from 'express'
import Order from '../models/Order.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

// GET order milik user yang login
router.get('/my', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Unauthorized' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Cari order berdasarkan email customer
    const user = await import('../models/User.js').then(m => m.default.findById(decoded.id))
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' })

    const orders = await Order.find({
      'customer.email': user.email
    }).sort({ createdAt: -1 })

    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET semua order
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id })
    if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST buat order baru
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update status order
router.put('/:id/status', async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status: req.body.status },
      { new: true }
    )
    if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router