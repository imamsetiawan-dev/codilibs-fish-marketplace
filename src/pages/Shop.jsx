import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import useCartStore from '../store/cartStore'
import { ShoppingCart, Star, SlidersHorizontal } from 'lucide-react'
import { getProducts } from '../api/api'

function Shop() {
  const addItem = useCartStore(state => state.addItem)
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') || 'Semua'
  )
  const [sortBy, setSortBy] = useState('default')

  const categories = ['Semua', 'Ikan Laut', 'Ikan Air Tawar', 'Ikan Koi', 'Pakan', 'Aksesoris']

  const formatRupiah = (num) =>
    'Rp ' + num.toLocaleString('id-ID')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = {}
        if (activeCategory !== 'Semua') params.category = activeCategory
        if (sortBy !== 'default') params.sort = sortBy
        const data = await getProducts(params)
        setProducts(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [activeCategory, sortBy])

  return (
    <Layout>

      {/* Header */}
      <section className="bg-gray-50 border-b py-5 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
            Semua Ikan Hias
          </h1>
          <p className="text-sm text-gray-500">
            Menampilkan {products.length} produk
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-5">

        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-44 shrink-0">
          <div className="bg-white rounded-xl shadow p-4 sticky top-24">
            <div className="flex items-center gap-2 font-semibold text-gray-700 mb-4 text-sm">
              <SlidersHorizontal size={15} />
              Kategori
            </div>
            <ul className="space-y-1">
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
        <div className="flex-1 min-w-0">

          {/* Filter Bar */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex gap-2 md:hidden overflow-x-auto pb-1 flex-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition shrink-0 ${
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
              className="border border-gray-300 rounded-lg px-3 py-2 text-xs md:text-sm outline-none focus:border-primary shrink-0"
            >
              <option value="default">Urutkan</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="rating">Rating Terbaik</option>
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Product Grid */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {products.map(product => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
                >
                  <Link to={`/product/${product._id}`}>
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-36 md:h-44 object-cover hover:scale-105 transition duration-300"
                      />
                      {product.isNewProduct && (
                        <span className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          BARU
                        </span>
                      )}
                      {product.featured && (
                        <span className="absolute top-2 right-2 bg-secondary text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          UNGGULAN
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <p className="text-xs text-secondary font-medium mb-1">
                      {product.category}
                    </p>
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-xs md:text-sm font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-primary">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 mb-2">
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-500">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-primary font-bold text-xs md:text-sm">
                        {formatRupiah(product.price)}
                      </span>
                      <span className="text-gray-400 line-through text-xs ml-1">
                        {formatRupiah(product.originalPrice)}
                      </span>
                    </div>
                    <button
                      onClick={() => addItem(product)}
                      className="w-full bg-primary text-white text-xs py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-1"
                    >
                      <ShoppingCart size={12} />
                      Keranjang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && products.length === 0 && (
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