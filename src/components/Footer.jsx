import { Link } from 'react-router-dom'
import { Fish, MapPin, Phone, Mail, Clock } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-white text-xl font-bold mb-3">
            <Fish size={24} />
            <span>AquaShop</span>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Toko ikan hias online terpercaya. Ikan sehat, pengiriman aman, harga terjangkau.
          </p>
          <div className="flex gap-3 text-sm">
            <a href="#" className="hover:text-white">Facebook</a>
            <a href="#" className="hover:text-white">Instagram</a>
            <a href="#" className="hover:text-white">WhatsApp</a>
          </div>
        </div>

        {/* Kategori */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm">Kategori</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/shop?category=Ikan Laut" className="hover:text-white">
                Ikan Laut
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Ikan Air Tawar" className="hover:text-white">
                Ikan Air Tawar
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Ikan Koi" className="hover:text-white">
                Ikan Koi
              </Link>
            </li>
          </ul>
        </div>

        {/* Informasi */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-sm">Informasi</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Tentang Kami</Link></li>
            <li><Link to="/" className="hover:text-white">Cara Pemesanan</Link></li>
            <li><Link to="/" className="hover:text-white">Kebijakan Pengiriman</Link></li>
            <li><Link to="/" className="hover:text-white">Kontak</Link></li>
          </ul>
        </div>

        {/* Kontak */}
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-white font-semibold mb-3 text-sm">Kontak Kami</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
              <span>Singaparna-Jawa Barat</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-primary shrink-0" />
              <span>+62 82316109080</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-primary shrink-0" />
              <span>hello@aquashop.id</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock size={15} className="text-primary shrink-0 mt-0.5" />
              <span>Senin - Sabtu, 08.00 - 20.00</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-700 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">Metode Pembayaran:</p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {['BCA', 'BNI', 'BRI', 'Mandiri', 'GoPay', 'OVO', 'Dana', 'QRIS', 'Alfamart', 'Indomaret'].map(method => (
              <span
                key={method}
                className="bg-gray-700 text-gray-300 px-2 py-1 rounded font-medium"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500 px-4">
        © 2026 AquaShop. All rights reserved. Made with Imam Setiawan
      </div>

    </footer>
  )
}

export default Footer