import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Search, Fish, Menu, X } from 'lucide-react'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'

function Navbar() {
  const totalItems = useCartStore(state => state.getTotalItems())
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Semua Ikan', to: '/shop' },
    { label: 'Ikan Laut', to: '/shop?category=Ikan Laut' },
    { label: 'Ikan Air Tawar', to: '/shop?category=Ikan Air Tawar' },
    { label: 'Ikan Koi', to: '/shop?category=Ikan Koi' },
    { label: 'Pakan', to: '/shop?category=Pakan' },
    { label: 'Aksesoris', to: '/shop?category=Aksesoris' },
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white text-xs py-2 px-4 text-center">
        Gratis ongkir untuk pembelian di atas Rp 200.000! 🐠
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl shrink-0">
          <Fish size={26} strokeWidth={2} />
          <span>AquaShop</span>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-4">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari ikan hias, pakan, aksesoris..."
            className="w-full border border-gray-300 rounded-l-lg px-4 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-green-700 flex items-center"
          >
            <Search size={16} />
          </button>
        </form>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Search Icon Mobile */}
          <button
            className="md:hidden text-gray-700 hover:text-primary"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={22} />
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative text-gray-700 hover:text-primary">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Account - Desktop */}
          {user ? (
  <div className="hidden md:flex items-center gap-2">
    <Link
      to="/profile"
      className="text-sm text-gray-700 font-medium hover:text-primary"
    >
      Hi, {user.nama.split(' ')[0]}!
    </Link>
    <button
      onClick={handleLogout}
      className="text-xs text-red-500 hover:text-red-700 font-medium"
    >
      Keluar
    </button>
  </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1 text-gray-700 hover:text-primary"
            >
              <User size={22} />
            </Link>
          )}

          {/* Hamburger Mobile */}
          <button
            className="md:hidden text-gray-700 hover:text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Search Mobile */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-full border border-gray-300 rounded-l-lg px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-green-700 flex items-center"
            >
              <Search size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Bottom Nav Desktop */}
      <div className="hidden md:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-6 text-sm font-medium text-gray-600 overflow-x-auto">
          {navLinks.map(link => (
            <Link
              key={link.label}
              to={link.to}
              className="hover:text-primary whitespace-nowrap transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-medium text-gray-700 hover:text-primary border-b border-gray-50"
            >
              {link.label}
            </Link>
          ))}

          {/* User Info Mobile */}
          {user ? (
            <div className="pt-2">
              <p className="text-sm font-medium text-gray-700 py-2">
                👤 Hi, {user.nama.split(' ')[0]}!
              </p>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 text-sm font-medium text-red-500 hover:text-red-700"
              >
                Keluar
              </button>
            </div>
          ) : (
            <div className="pt-2 space-y-1">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-medium text-primary hover:text-green-700"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-medium text-gray-700 hover:text-primary"
              >
                Daftar
              </Link>
            </div>
          )}

          <Link
            to="/admin"
            onClick={() => setMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gray-400 hover:text-primary"
          >
            Admin
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar