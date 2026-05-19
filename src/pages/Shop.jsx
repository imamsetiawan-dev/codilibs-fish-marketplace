import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import products from '../data/products'
import useCartStore from '../store/cartStore'
import { ShoppingCart, Star, SlidersHorizontal } from 'lucide-react'

function Shop() {
  const addItem = useCartStore(state => state.addItem)
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [sortBy, setSortBy] = useState('default')

  const categories = ['Semua', 'Ikan Laut', 'Ikan Air Tawar', 'Ikan Koi']

  const formatRupiah = (num) =>
    'Rp ' + num.toLocaleString('id-ID')

  let filtered = activeCategory === 'Semua'
    ? products
    : products.filter(p => p.category === activeCategory)

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)

  return (
    <Layout>
      <section className="bg-gray-50 border-b py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Semua Ikan Hias</h1>
          <p className="text-sm text-gray-500">Menampilkan {filtered.length} produk</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">

        {/* Sidebar */}
        <aside className="hidden md:block w-48 shrink-0">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center gap-2 font-semibold text-gray-700 mb-4">
              <SlidersHorizontal size={16} />
              Kategori
            </div>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition ${
                      activeCategory === cat
                        ? 'bg-primary text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 md:hidden overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition ${
                    activeCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="ml-auto border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="default">Urutkan</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="rating">Rating Terbaik</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-44 object-cover hover:scale-105 transition duration-300"
                    />
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded-full font-medium">
                        BARU
                      </span>
                    )}
                    {product.featured && (
                      <span className="absolute top-2 right-2 bg-secondary text-white text-xs px-2 py-1 rounded-full font-medium">
                        UNGGULAN
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-3">
                  <p className="text-xs text-secondary font-medium mb-1">
                    {product.category}
                  </p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-primary">
                      {product.name}
                    </h3>
                  </Link>
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

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">Produk tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Shop