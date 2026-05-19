import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import products from '../data/products'
import useCartStore from '../store/cartStore'
import { ShoppingCart, ArrowLeft, Star, Package, Shield, Truck } from 'lucide-react'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find(p => p.id === parseInt(id))
  const addItem = useCartStore(state => state.addItem)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const formatRupiah = (num) =>
    'Rp ' + num.toLocaleString('id-ID')

  const related = products.filter(
    p => p.category === product?.category && p.id !== product?.id
  )

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem(product)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBeliSekarang = () => {
    for (let i = 0; i < qty; i++) {
      addItem(product)
    }
    navigate('/checkout')
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Produk tidak ditemukan</p>
          <Link to="/shop" className="text-primary hover:underline mt-2 inline-block">
            Kembali ke Shop
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <span className="text-gray-800 line-clamp-1">{product.name}</span>
        </div>

        {/* Back */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6"
        >
          <ArrowLeft size={16} />
          Kembali ke Shop
        </Link>

        {/* Main Product */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-8 mb-10">

          {/* Image */}
          <div className="md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-cover rounded-xl"
            />
          </div>

          {/* Info */}
          <div className="md:w-1/2">
            <span className="text-xs bg-secondary text-white px-3 py-1 rounded-full font-medium">
              {product.category}
            </span>

            <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 fill-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({product.reviews} ulasan)
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="text-3xl font-bold text-primary">
                {formatRupiah(product.price)}
              </span>
              <span className="text-gray-400 line-through text-lg ml-3">
                {formatRupiah(product.originalPrice)}
              </span>
              <span className="ml-2 text-xs bg-accent text-white px-2 py-1 rounded-full">
                HEMAT {formatRupiah(product.originalPrice - product.price)}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {product.description}
            </p>

            {/* Stock */}
            <p className="text-sm text-gray-500 mb-4">
              Stok tersedia:
              <span className="font-semibold text-gray-800 ml-1">
                {product.stock} ekor
              </span>
            </p>

            {/* Qty */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-gray-600">Jumlah:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-primary text-white hover:bg-green-700'
              }`}
            >
              <ShoppingCart size={18} />
              {added ? 'Berhasil Ditambahkan!' : 'Tambah ke Keranjang'}
            </button>

            <button
              onClick={handleBeliSekarang}
              className="w-full mt-3 border-2 border-primary text-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-50 transition"
            >
              Beli Sekarang
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <Truck size={20} className="mx-auto text-primary mb-1" />
                <p className="text-xs text-gray-600">Pengiriman Aman</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <Shield size={20} className="mx-auto text-primary mb-1" />
                <p className="text-xs text-gray-600">Garansi Hidup</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <Package size={20} className="mx-auto text-primary mb-1" />
                <p className="text-xs text-gray-600">Packing Khusus</p>
              </div>
            </div>
          </div>
        </div>

        {/* Produk Terkait */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
                >
                  <Link to={`/product/${p.id}`}>
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-36 object-cover hover:scale-105 transition duration-300"
                    />
                  </Link>
                  <div className="p-3">
                    <Link to={`/product/${p.id}`}>
                      <h3 className="text-sm font-semibold text-gray-800 hover:text-primary line-clamp-2 mb-1">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-500">{p.rating}</span>
                    </div>
                    <span className="text-primary font-bold text-sm">
                      {formatRupiah(p.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </Layout>
  )
}

export default ProductDetail