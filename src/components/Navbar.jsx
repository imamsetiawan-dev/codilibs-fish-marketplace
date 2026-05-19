import { Link } from 'react-router-dom'
import { ShoppingCart, User, Search, Fish } from 'lucide-react'
import useCartStore from '../store/cartStore'

function Navbar() {
  const totalItems = useCartStore(state => state.getTotalItems())

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white text-sm py-2 px-4 text-center">
        Gratis ongkir untuk pembelian di atas Rp 200.000!
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
          <Fish size={28} strokeWidth={2} />
          <span>AquaShop</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 mx-8">
          <input
            type="text"
            placeholder="Cari ikan hias..."
            className="w-full border border-gray-300 rounded-l-lg px-4 py-2 outline-none focus:border-primary"
          />
          <button className="bg-primary text-white px-4 py-2 rounded-r-lg hover:bg-green-700 flex items-center">
            <Search size={18} />
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link to="/cart" className="relative text-gray-700 hover:text-primary">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link to="/login" className="hidden md:flex text-gray-700 hover:text-primary">
            <User size={24} />
          </Link>
        </div>
      </div>

      {/* Bottom Nav Menu */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-6 text-sm font-medium text-gray-600 overflow-x-auto">
          <Link to="/" className="hover:text-primary whitespace-nowrap">Home</Link>
          <Link to="/shop" className="hover:text-primary whitespace-nowrap">Semua Ikan</Link>
          <Link to="/shop?category=Ikan Laut" className="hover:text-primary whitespace-nowrap">Ikan Laut</Link>
          <Link to="/shop?category=Ikan Air Tawar" className="hover:text-primary whitespace-nowrap">Ikan Air Tawar</Link>
          <Link to="/shop?category=Ikan Koi" className="hover:text-primary whitespace-nowrap">Ikan Koi</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar