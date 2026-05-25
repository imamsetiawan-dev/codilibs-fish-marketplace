import { Link, useLocation } from 'react-router-dom'
import { Home, Grid, ShoppingCart, User } from 'lucide-react'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'

function BottomNav() {
  const location = useLocation()
  const totalItems = useCartStore(state => state.getTotalItems())
  const user = useAuthStore(state => state.user)

  const isActive = (path) => location.pathname === path

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-bottom">
      <div className="flex items-center justify-around py-2">

        {/* Home */}
        <Link to="/" className={`flex flex-col items-center gap-0.5 px-4 py-1 ${
          isActive('/') ? 'text-primary' : 'text-gray-400'
        }`}>
          <Home size={22} strokeWidth={isActive('/') ? 2.5 : 1.5} />
          <span className="text-xs font-medium">Home</span>
        </Link>

        {/* Shop */}
        <Link to="/shop" className={`flex flex-col items-center gap-0.5 px-4 py-1 ${
          isActive('/shop') ? 'text-primary' : 'text-gray-400'
        }`}>
          <Grid size={22} strokeWidth={isActive('/shop') ? 2.5 : 1.5} />
          <span className="text-xs font-medium">Produk</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className={`flex flex-col items-center gap-0.5 px-4 py-1 relative ${
          isActive('/cart') ? 'text-primary' : 'text-gray-400'
        }`}>
          <div className="relative">
            <ShoppingCart size={22} strokeWidth={isActive('/cart') ? 2.5 : 1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-xs font-medium">Keranjang</span>
        </Link>

        {/* Profile */}
        <Link
          to={user ? '/profile' : '/login'}
          className={`flex flex-col items-center gap-0.5 px-4 py-1 ${
            isActive('/profile') || isActive('/login') ? 'text-primary' : 'text-gray-400'
          }`}
        >
          <User size={22} strokeWidth={isActive('/profile') ? 2.5 : 1.5} />
          <span className="text-xs font-medium">
            {user ? 'Akun' : 'Masuk'}
          </span>
        </Link>

      </div>
    </div>
  )
}

export default BottomNav