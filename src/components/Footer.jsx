import { Link } from 'react-router-dom'
import { Fish, MapPin, Phone, Mail, Clock } from 'lucide-react'
function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 text-white text-xl font-bold mb-3">
            <Fish size={24} />
            <span>AquaShop</span>
          </div>
          <p className="text-sm text-gray-400">
            Toko ikan hias online terpercaya. Ikan sehat, pengiriman aman, harga terjangkau.
          </p>
          <div className="flex gap-3 mt-4 text-sm">
             <a href="#" className="hover:text-white">Facebook</a>
             <a href="#" className="hover:text-white">Instagram</a>
             <a href="#" className="hover:text-white">WhatsApp</a>
            </div>
        </div>

        {/* Kategori */}
        <div>
          <h3 className="text-white font-semibold mb-3">Kategori</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop?category=Ikan Laut" className="hover:text-white">Ikan Laut</Link></li>
            <li><Link to="/shop?category=Ikan Air Tawar" className="hover:text-white">Ikan Air Tawar</Link></li>
            <li><Link to="/shop?category=Ikan Koi" className="hover:text-white">Ikan Koi</Link></li>
          </ul>
        </div>

        {/* Informasi */}
        <div>
          <h3 className="text-white font-semibold mb-3">Informasi</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Tentang Kami</Link></li>
            <li><Link to="/" className="hover:text-white">Cara Pemesanan</Link></li>
            <li><Link to="/" className="hover:text-white">Kebijakan Pengiriman</Link></li>
            <li><Link to="/" className="hover:text-white">Kontak</Link></li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h3 className="text-white font-semibold mb-3">Kontak Kami</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-primary shrink-0" />
              Singaparna, Indonesia
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-primary shrink-0" />
              0812-3456-7890
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-primary shrink-0" />
              hello@aquashop.id
            </li>
            <li className="flex items-center gap-2">
              <Clock size={16} className="text-primary shrink-0" />
              Senin - Sabtu, 08.00 - 20.00
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © 2026 AquaShop. All rights reserved. by Imam Setiawan
      </div>
    </footer>
  )
}

export default Footer