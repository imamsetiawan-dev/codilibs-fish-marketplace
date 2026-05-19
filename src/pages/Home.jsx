import Layout from '../components/Layout'
import products from '../data/products'
import useCartStore from '../store/cartStore'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Waves, Droplets, Sparkles } from 'lucide-react'

function Home() {
  const addItem = useCartStore(state => state.addItem)

  const featured = products.filter(p => p.featured)
  const newest = products.filter(p => p.isNew)

  const categories = [
    { name: 'Ikan Laut', icon: Waves, color: 'bg-blue-100 text-blue-700' },
    { name: 'Ikan Air Tawar', icon: Droplets, color: 'bg-green-100 text-green-700' },
    { name: 'Ikan Koi', icon: Sparkles, color: 'bg-red-100 text-red-700' },
  ]

  const formatRupiah = (num) =>
    'Rp ' + num.toLocaleString('id-ID')

  return (
    <Layout>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Temukan Ikan Hias <br /> Impianmu!
            </h1>
            <p className="text-lg mb-6 text-green-100">
              Koleksi ikan hias terlengkap. Sehat, berkualitas, dan dikirim langsung ke rumahmu.
            </p>
            <div className="flex gap-3">
              <Link
                to="/shop"
                className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition"
              >
                Belanja Sekarang
              </Link>
              <Link
                to="/shop"
                className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-primary transition"
              >
                Lihat Koleksi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">500+</div>
            <div className="text-sm text-gray-500">Jenis Ikan</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">10rb+</div>
            <div className="text-sm text-gray-500">Pelanggan Puas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-sm text-gray-500">Ikan Sehat</div>
          </div>
        </div>
      </section>

      {/* Kategori */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Kategori</h2>
          <Link to="/shop" className="text-primary text-sm hover:underline">
            Lihat Semua →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.name}
                to={`/shop?category=${cat.name}`}
                className={`${cat.color} rounded-xl p-6 text-center font-semibold hover:opacity-80 transition`}
              >
                <Icon size={36} className="mx-auto mb-2" />
                <div>{cat.name}</div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Produk Unggulan */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Produk Unggulan</h2>
          <Link to="/shop" className="text-primary text-sm hover:underline">
            Lihat Semua →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <p className="text-xs text-secondary font-medium mb-1">
                  {product.category}
                </p>
                <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-500">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-primary font-bold text-sm">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="text-gray-400 line-through text-xs ml-2">
                    {formatRupiah(product.originalPrice)}
                  </span>
                </div>
                <button
                  onClick={() => addItem(product)}
                  className="w-full bg-primary text-white text-sm py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-1"
                >
                  <ShoppingCart size={14} />
                  Keranjang
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Banner Promo */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-secondary to-blue-400 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Promo Spesial Hari Ini!</h2>
          <p className="mb-4">Diskon hingga 30% untuk semua ikan koi. Stok terbatas!</p>
          <Link
            to="/shop?category=Ikan Koi"
            className="bg-white text-secondary font-semibold px-6 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            Lihat Promo
          </Link>
        </div>
      </section>

      {/* Produk Terbaru */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Baru Masuk</h2>
          <Link to="/shop" className="text-primary text-sm hover:underline">
            Lihat Semua →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {newest.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <span className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded-full font-medium">
                  BARU
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs text-secondary font-medium mb-1">
                  {product.category}
                </p>
                <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-500">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-primary font-bold text-sm">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="text-gray-400 line-through text-xs ml-2">
                    {formatRupiah(product.originalPrice)}
                  </span>
                </div>
                <button
                  onClick={() => addItem(product)}
                  className="w-full bg-primary text-white text-sm py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-1"
                >
                  <ShoppingCart size={14} />
                  Keranjang
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </Layout>
  )
}

export default Home