import { useLocation, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { CheckCircle, Clock, Home, ShoppingBag } from 'lucide-react'

function Success() {
  const location = useLocation()
  const { order_id, total, form, pending } = location.state || {}

  const formatRupiah = (num) =>
    'Rp ' + num.toLocaleString('id-ID')

  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-16 text-center">

        {pending ? (
          <Clock size={80} className="mx-auto text-yellow-400 mb-4" />
        ) : (
          <CheckCircle size={80} className="mx-auto text-primary mb-4" />
        )}

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {pending ? 'Menunggu Pembayaran' : 'Pesanan Berhasil!'}
        </h1>

        <p className="text-gray-500 mb-6">
          {pending
            ? 'Silakan selesaikan pembayaran sesuai instruksi yang dikirim.'
            : 'Terima kasih! Pesanan kamu sedang diproses.'}
        </p>

        <div className="bg-white rounded-xl shadow p-6 text-left mb-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-semibold text-gray-800">{order_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Bayar</span>
              <span className="font-bold text-primary">
                {total ? formatRupiah(total) : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Dikirim ke</span>
              <span className="font-semibold text-gray-800">
                {form?.nama}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Alamat</span>
              <span className="font-semibold text-gray-800 text-right max-w-xs">
                {form?.kota}, {form?.provinsi}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to="/"
            className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
          >
            <Home size={18} />
            Ke Beranda
          </Link>
          <Link
            to="/shop"
            className="flex-1 border border-primary text-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-50 transition"
          >
            <ShoppingBag size={18} />
            Belanja Lagi
          </Link>
        </div>

      </div>
    </Layout>
  )
}

export default Success