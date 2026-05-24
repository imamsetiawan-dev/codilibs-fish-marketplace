import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import useCartStore from '../store/cartStore'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Waves, Droplets, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { getProducts } from '../api/api'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

import guppy from '../assets/images/guppy.webp'
import cupang from '../assets/images/cupang.webp'
import molly from '../assets/images/molly.webp'
import heroBg from '../assets/images/hero-bg.webp'

function Home() {
  const addItem = useCartStore(state => state.addItem)
  const [featured, setFeatured] = useState([])
  const [newest, setNewest] = useState([])
  const [loading, setLoading] = useState(true)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  )

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  const categories = [
    { name: 'Ikan Laut', icon: Waves, color: 'bg-blue-100 text-blue-700' },
    { name: 'Ikan Air Tawar', icon: Droplets, color: 'bg-green-100 text-green-700' },
    { name: 'Ikan Koi', icon: Sparkles, color: 'bg-red-100 text-red-700' },
  ]

  const formatRupiah = (num) =>
    'Rp ' + num.toLocaleString('id-ID')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const all = await getProducts()
        setFeatured(all.filter(p => p.featured))
        setNewest(all.filter(p => p.isNewProduct))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Memuat produk...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white min-h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 text-center md:text-left">
            <span className="bg-white text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block shadow-sm">
              🐠 Toko Ikan Hias Terpercaya
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Temukan Ikan Hias <br />
              <span className="text-yellow-300">Impianmu!</span>
            </h1>
            <p className="text-base md:text-lg mb-6 text-green-100">
              Koleksi lengkap ikan hias air tawar & laut. Guppy, Koi, Arwana, Cupang, Molly, Discus dan masih banyak lagi!
            </p>
            <div className="flex gap-3 flex-wrap justify-center md:justify-start mb-5">
              <Link to="/shop" className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition text-sm shadow">
                Belanja Sekarang
              </Link>
              <Link to="/shop" className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-primary transition text-sm">
                Lihat Koleksi
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['Guppy', 'Koi', 'Cupang', 'Molly', 'Arwana', 'Discus', 'Louhan'].map(tag => (
                <Link
                  key={tag}
                  to="/shop"
                  className="bg-white bg-opacity-25 backdrop-blur-sm border border-white border-opacity-40 text-black text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white hover:text-primary transition"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:grid md:w-1/2 grid-cols-2 gap-3">
            <div className="space-y-3">
              <div className="overflow-hidden rounded-xl shadow-lg h-36">
                <img src={guppy} alt="Ikan Guppy" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>
              <div className="overflow-hidden rounded-xl shadow-lg h-48">
                <img src={cupang} alt="Ikan Cupang" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>
            </div>
            <div className="space-y-3 mt-8">
              <div className="overflow-hidden rounded-xl shadow-lg h-48">
                <img src={molly} alt="Ikan Molly" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>
              <div className="overflow-hidden rounded-xl shadow-lg h-36">
                <img src={guppy} alt="Ikan Guppy 2" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xl md:text-2xl font-bold text-primary">500+</div>
            <div className="text-xs md:text-sm text-gray-500">Jenis Ikan</div>
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold text-primary">10rb+</div>
            <div className="text-xs md:text-sm text-gray-500">Pelanggan Puas</div>
          </div>
          <div>
            <div className="text-xl md:text-2xl font-bold text-primary">100%</div>
            <div className="text-xs md:text-sm text-gray-500">Ikan Sehat</div>
          </div>
        </div>
      </section>

      {/* Ads Slot 1 — Banner Atas (728x90 leaderboard) */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="w-full h-20 bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-xs">
          {/* Ganti div ini dengan kode AdSense atau banner iklan lo */}
          📢 Slot Iklan — 728x90 Leaderboard
        </div>
      </section>

      {/* Kategori */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800">Kategori</h2>
          <Link to="/shop" className="text-primary text-sm hover:underline">Lihat Semua →</Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.name}
                to={`/shop?category=${cat.name}`}
                className={`${cat.color} rounded-xl p-4 md:p-6 text-center font-semibold hover:opacity-80 transition`}
              >
                <Icon size={28} className="mx-auto mb-2" />
                <div className="text-xs md:text-sm">{cat.name}</div>
              </Link>
            )
          })}
          <Link
            to="/shop?category=Pakan"
            className="bg-yellow-100 text-yellow-700 rounded-xl p-4 md:p-6 text-center font-semibold hover:opacity-80 transition"
          >
            <span className="text-3xl block mb-2">🦐</span>
            <div className="text-xs md:text-sm">Pakan</div>
          </Link>
          <Link
            to="/shop?category=Aksesoris"
            className="bg-purple-100 text-purple-700 rounded-xl p-4 md:p-6 text-center font-semibold hover:opacity-80 transition"
          >
            <span className="text-3xl block mb-2">🪴</span>
            <div className="text-xs md:text-sm">Aksesoris</div>
          </Link>
        </div>
      </section>

      {/* Produk Unggulan — Carousel */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800">Produk Unggulan</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={scrollPrev}
              className="p-2 bg-white border border-gray-200 rounded-full hover:bg-primary hover:text-white hover:border-primary transition shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              className="p-2 bg-white border border-gray-200 rounded-full hover:bg-primary hover:text-white hover:border-primary transition shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
            <Link to="/shop" className="text-primary text-sm hover:underline ml-2">
              Lihat Semua →
            </Link>
          </div>
        </div>

        {/* Embla Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {featured.map(product => (
              <div
                key={product._id}
                className="flex-none w-[calc(50%-8px)] md:w-[calc(25%-12px)] bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover hover:scale-105 transition duration-300"
                    />
                    {product.featured && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        ⭐ Unggulan
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-3">
                  <p className="text-xs text-secondary font-medium mb-1">{product.category}</p>
                  <Link to={`/product/${product._id}`}>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-primary">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">{product.rating} ({product.reviews})</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-primary font-bold text-xs md:text-sm">{formatRupiah(product.price)}</span>
                    <span className="text-gray-400 line-through text-xs ml-1">{formatRupiah(product.originalPrice)}</span>
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
        </div>
      </section>

      {/* Ads Slot 2 — Square / Rectangle (300x250) */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Ads kiri */}
          <div className="flex-1 h-32 bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-xs">
            📢 Slot Iklan Kiri — 300x250
          </div>
          {/* Ads kanan */}
          <div className="flex-1 h-32 bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-xs">
            📢 Slot Iklan Kanan — 300x250
          </div>
        </div>
      </section>

      {/* Banner Promo */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-gradient-to-r from-secondary to-blue-400 rounded-2xl p-6 md:p-8 text-white text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Promo Spesial Hari Ini!</h2>
          <p className="mb-4 text-sm md:text-base">Diskon hingga 30% untuk semua ikan koi. Stok terbatas!</p>
          <Link
            to="/shop?category=Ikan Koi"
            className="bg-white text-secondary font-semibold px-6 py-2 rounded-lg hover:bg-blue-50 transition text-sm inline-block"
          >
            Lihat Promo
          </Link>
        </div>
      </section>

      {/* Produk Terbaru */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800">Baru Masuk</h2>
          <Link to="/shop" className="text-primary text-sm hover:underline">Lihat Semua →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {newest.map(product => (
            <div key={product._id} className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
              <div className="relative">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-36 md:h-44 object-cover hover:scale-105 transition duration-300"
                  />
                </Link>
                <span className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  BARU
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs text-secondary font-medium mb-1">{product.category}</p>
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-xs md:text-sm font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-primary">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 mb-2">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-500">{product.rating} ({product.reviews})</span>
                </div>
                <div className="mb-2">
                  <span className="text-primary font-bold text-xs md:text-sm">{formatRupiah(product.price)}</span>
                  <span className="text-gray-400 line-through text-xs ml-1">{formatRupiah(product.originalPrice)}</span>
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
      </section>

      {/* Ads Slot 3 — Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 py-4 mb-8">
        <div className="w-full h-20 bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-xs">
          📢 Slot Iklan Footer — 728x90
        </div>
      </section>

    </Layout>
  )
}

export default Home