import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import midtransClient from 'midtrans-client'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import authRoutes from './routes/auth.js'
import uploadRoutes from './routes/upload.js'
import Order from './models/Order.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch(err => console.error('❌ MongoDB error:', err))

// Midtrans
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
})

// Routes
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)

// Create Transaction + Simpan Order ke DB
app.post('/create-transaction', async (req, res) => {
  try {
    const { order_id, customer, items, ongkir } = req.body

    const itemDetails = items.map(item => ({
      id: String(item.id),
      price: Math.round(item.price),
      quantity: item.qty,
      name: item.name,
    }))

    if (ongkir && ongkir.harga > 0) {
      itemDetails.push({
        id: 'ONGKIR',
        price: Math.round(ongkir.harga),
        quantity: 1,
        name: `Ongkos Kirim (${ongkir.label})`,
      })
    }

    const gross_amount = itemDetails.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    )

    const parameter = {
      transaction_details: { order_id, gross_amount },
      customer_details: {
        first_name: customer.nama,
        phone: customer.telepon,
        email: customer.email || '',
        shipping_address: {
          first_name: customer.nama,
          phone: customer.telepon,
          address: customer.alamat,
          city: customer.kota,
          postal_code: customer.kodePos,
        },
      },
      item_details: itemDetails,
    }

    const transaction = await snap.createTransaction(parameter)

    // Simpan order ke MongoDB
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0)
    const ongkirHarga = ongkir?.harga || 0

    await Order.create({
      orderId: order_id,
      customer: {
        nama: customer.nama,
        telepon: customer.telepon,
        email: customer.email || '',
        alamat: customer.alamat,
        kota: customer.kota,
        provinsi: customer.provinsi,
        kodePos: customer.kodePos,
        catatan: customer.catatan || '',
      },
      items: items.map(item => ({
        id: String(item.id),
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image || '',
      })),
      pengiriman: {
        label: ongkir?.label || '',
        harga: ongkirHarga,
        estimasi: ongkir?.estimasi || '',
      },
      subtotal,
      ongkir: ongkirHarga,
      total: gross_amount,
      snapToken: transaction.token,
      midtransOrderId: order_id,
    })

    res.json({ token: transaction.token })

  } catch (error) {
    console.error('Midtrans Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Webhook Midtrans
app.post('/webhook/midtrans', async (req, res) => {
  try {
    const { order_id, transaction_status, fraud_status } = req.body

    console.log('Webhook diterima:', req.body)

    let paymentStatus = 'pending'
    let orderStatus = 'pending'

    if (transaction_status === 'capture') {
      if (fraud_status === 'accept') {
        paymentStatus = 'success'
        orderStatus = 'processing'
      } else {
        paymentStatus = 'failed'
        orderStatus = 'cancelled'
      }
    } else if (transaction_status === 'settlement') {
      paymentStatus = 'success'
      orderStatus = 'processing'
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire'
    ) {
      paymentStatus = 'failed'
      orderStatus = 'cancelled'
    } else if (transaction_status === 'pending') {
      paymentStatus = 'pending'
      orderStatus = 'pending'
    }

    await Order.findOneAndUpdate(
      { orderId: order_id },
      { paymentStatus, status: orderStatus },
      { returnDocument: 'after' }
    )

    res.status(200).json({ message: 'Webhook processed' })

  } catch (err) {
    console.error('Webhook error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🐠 AquaShop API running!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Backend jalan di http://localhost:${PORT}`)
})