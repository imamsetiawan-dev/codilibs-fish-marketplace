import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import useCartStore from '../store/cartStore'
import { ShoppingCart, Star, Search as SearchIcon } from 'lucide-react'
import { getProducts } from '../api/api'

function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const addItem = useCartStore(state => state.addItem)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const formatRupiah = (num) =>
    'Rp ' + num.toLocaleString('id-ID')

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const data = await getProducts({ search: query })
        setProducts(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (query) fetchResults()
    else setLoading(false)
  }, [query])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <SearchIcon size={16} />
            <span>Hasil pencarian untuk:</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            "{query}"
          </h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-1">
              Ditemukan {products.length} produk
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && query && products.length === 0 && (
          <div className="text-center py-20">
            <SearchIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Produk tidak ditemukan
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Coba kata kunci lain atau lihat semua produk kami
            </p>
            <Link
              to="/shop"
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Lihat Semua Produk
            </Link>
          </div>
        )}

        {/* No Query */}
        {!loading && !query && (
          <div className="text-center py-20">
            <SearchIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400">Masukkan kata kunci untuk mencari produk</p>
          </div>
        )}

        {/* Results */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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

      </div>
    </Layout>
  )
}

export default Search