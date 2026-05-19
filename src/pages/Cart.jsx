import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import useCartStore from '../store/cartStore'
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from 'lucide-react'

function Cart() {
  const { items, removeItem, updateQty, getTotalPrice } = useCartStore()

  const formatRupiah = (num) =>
    'Rp ' + num.toLocaleString('id-ID')

  const ongkir = getTotalPrice() >= 200000 ? 0 : 25000

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Keranjang kamu masih kosong
          </h2>
          <p className="text-gray-400 mb-6">
            Yuk mulai belanja ikan hias impianmu!
          </p>
          <Link
            to="/shop"
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Mulai Belanja
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/shop" className="text-gray-500 hover:text-primary">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Keranjang Belanja
          </h1>
          <span className="bg-primary text-white text-sm px-2 py-0.5 rounded-full">
            {items.length} item
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-4 flex gap-4 items-center"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg shrink-0"
                />

                {/* Info */}
                <div className="flex-1">
                  <p className="text-xs text-secondary font-medium mb-0.5">
                    {item.category}
                  </p>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-primary font-bold">
                    {formatRupiah(item.price)}
                  </p>
                </div>

                {/* Qty Control */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="px-2 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 text-sm font-medium">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="px-2 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Subtotal + Delete */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-800">
                    {formatRupiah(item.price * item.qty)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 mt-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatRupiah(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Ongkos Kirim</span>
                  <span className={ongkir === 0 ? 'text-primary font-medium' : ''}>
                    {ongkir === 0 ? 'GRATIS' : formatRupiah(ongkir)}
                  </span>
                </div>
                {ongkir > 0 && (
                  <p className="text-xs text-gray-400">
                    Belanja {formatRupiah(200000 - getTotalPrice())} lagi untuk gratis ongkir
                  </p>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-primary text-lg">
                    {formatRupiah(getTotalPrice() + ongkir)}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
              >
                <ShoppingBag size={18} />
                Lanjut ke Checkout
              </Link>

              <Link
                to="/shop"
                className="w-full mt-3 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold flex items-center justify-center hover:bg-gray-50 transition"
              >
                Lanjut Belanja
              </Link>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default Cart