import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import useCartStore from '../store/cartStore'
import { CreditCard, ArrowLeft, Loader } from 'lucide-react'

function Payment() {
  const location = useLocation()
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { form, pengiriman, total } = location.state || {}

  const formatRupiah = (num) =>
    'Rp ' + num.toLocaleString('id-ID')

  // Kalau akses langsung tanpa state, redirect ke cart
  useEffect(() => {
    if (!form || !total) {
      navigate('/cart')
    }
  }, [])

  const handleBayar = async () => {
    setLoading(true)
    setError(null)

    try {
      const order_id = 'AQUA-' + Date.now()

      const response = await fetch('http://localhost:5000/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            order_id,
            total,
            customer: form,
            ongkir: pengiriman,
            items: items.map(item => ({
              id: item._id || item.id,
              name: item.name,
              price: item.price,
              qty: item.qty,
              image: item.image || '',
            })),
          }),
      })

      const data = await response.json()

      if (!data.token) {
        throw new Error('Gagal mendapatkan token pembayaran')
      }

      // Buka popup Midtrans
      window.snap.pay(data.token, {
        onSuccess: (result) => {
          console.log('Pembayaran sukses:', result)
          clearCart()
          navigate('/success', { state: { order_id, total, form } })
        },
        onPending: (result) => {
          console.log('Menunggu pembayaran:', result)
          clearCart()
          navigate('/success', { state: { order_id, total, form, pending: true } })
        },
        onError: (result) => {
          console.log('Pembayaran gagal:', result)
          setError('Pembayaran gagal. Silakan coba lagi.')
        },
        onClose: () => {
          setLoading(false)
        },
      })

    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (!form || !total) return null

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/checkout" className="text-gray-500 hover:text-primary">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Pembayaran</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <span className="bg-primary text-white px-3 py-1 rounded-full font-medium">
            1. Keranjang
          </span>
          <span className="text-gray-400">→</span>
          <span className="bg-primary text-white px-3 py-1 rounded-full font-medium">
            2. Checkout
          </span>
          <span className="text-gray-400">→</span>
          <span className="bg-primary text-white px-3 py-1 rounded-full font-medium">
            3. Pembayaran
          </span>
        </div>

        {/* Ringkasan */}
        <div className="bg-white rounded-xl shadow p-6 mb-4">
          <h2 className="font-bold text-gray-800 mb-4">Ringkasan Pesanan</h2>

          {/* Items */}
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex gap-3 items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-gray-800 line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-gray-400">x{item.qty}</p>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {formatRupiah(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Ongkos Kirim ({pengiriman?.label})</span>
              <span>{formatRupiah(pengiriman?.harga || 0)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 pt-2 border-t">
              <span>Total Bayar</span>
              <span className="text-primary text-xl">
                {formatRupiah(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Alamat */}
        <div className="bg-white rounded-xl shadow p-6 mb-4">
          <h2 className="font-bold text-gray-800 mb-3">Dikirim ke</h2>
          <p className="text-sm font-medium text-gray-800">{form.nama}</p>
          <p className="text-sm text-gray-500">{form.telepon}</p>
          <p className="text-sm text-gray-500 mt-1">
            {form.alamat}, {form.kota}, {form.provinsi} {form.kodePos}
          </p>
          {form.catatan && (
            <p className="text-sm text-gray-400 mt-1 italic">
              Catatan: {form.catatan}
            </p>
          )}
        </div>

        {/* Metode Pembayaran Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-700 font-medium mb-1">
            Metode Pembayaran Tersedia:
          </p>
          <p className="text-xs text-blue-600">
            Transfer Bank, QRIS, GoPay, OVO, Dana, ShopeePay, Kartu Kredit, Alfamart, Indomaret
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Bayar Button */}
        <button
          onClick={handleBayar}
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <CreditCard size={20} />
              Bayar Sekarang {formatRupiah(total)}
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          Pembayaran diproses dengan aman oleh Midtrans
        </p>

      </div>
    </Layout>
  )
}

export default Payment