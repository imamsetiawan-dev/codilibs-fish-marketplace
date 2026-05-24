import express from 'express'
import Product from '../models/Product.js'

const router = express.Router()

// GET semua produk
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query
    let query = {}

    if (category) query.category = category
    if (search) query.name = { $regex: search, $options: 'i' }

    let products = Product.find(query)

    if (sort === 'price-asc') products = products.sort({ price: 1 })
    if (sort === 'price-desc') products = products.sort({ price: -1 })
    if (sort === 'rating') products = products.sort({ rating: -1 })

    const result = await products
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET produk by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST tambah produk
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update produk
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE produk
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Produk berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router