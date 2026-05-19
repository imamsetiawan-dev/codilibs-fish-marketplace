import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import useCartStore from '../store/cartStore'
import { ArrowLeft, MapPin, CreditCard, Truck } from 'lucide-react'

function Checkout() {
  const { items, getTotalPrice } = useCartStore()
  const [form, setForm] = useState({
    nama: '',
    telepon: '',
    alamat: '',
    kota: '',
    provinsi: '',
    kodePos: '',
    catatan: '',
  })
  const [pengiriman, setPengiriman] = useState('jne-reg')

  const formatRupiah = (num) =>
    'Rp ' + num.toLocaleString('id-ID')

  const ongkirOptions = [
    { id: 'jne-reg', label: 'JNE Reguler', estimasi: '2-3 hari', harga: 25000 },
    { id: 'jne-yes', label: 'JNE YES', estimasi: '1 hari', harga: 45000 },
    { id: 'sicepat', label: 'SiCepat Reguler', estimasi: '2-3 hari', harga: 22000 },
    { id: 'gosend', label: 'GoSend Same Day', estimasi: 'Hari ini', harga: 35000 },
  ]

  const selectedOngkir = ongkirOptions.find(o => o.id === pengiriman)
  const subtotal = getTotalPrice()
  const total = subtotal + (selectedOngkir?.harga || 0)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/cart" className="text-gray-500 hover:text-primary">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left - Form */}
          <div className="flex-1 space-y-4">

            {/* Alamat Pengiriman */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                <MapPin size={18} className="text-primary" />
                Alamat Pengiriman
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Nama Lengkap
                  </label>
                  <input
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    placeholder="Nama penerima"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Nomor Telepon
                  </label>
                  <input
                    name="telepon"
                    value={form.telepon}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 mb-1 block">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="alamat"
                    value={form.alamat}
                    onChange={handleChange}
                    placeholder="Jalan, nomor rumah, RT/RW, kelurahan..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Kota</label>
                  <input
                    name="kota"
                    value={form.kota}
                    onChange={handleChange}
                    placeholder="Kota / Kabupaten"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Provinsi</label>
                  <input
                    name="provinsi"
                    value={form.provinsi}
                    onChange={handleChange}
                    placeholder="Provinsi"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Kode Pos</label>
                  <input
                    name="kodePos"
                    value={form.kodePos}
                    onChange={handleChange}
                    placeholder="12345"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Catatan (opsional)
                  </label>
                  <input
                    name="catatan"
                    value={form.catatan}
                    onChange={handleChange}
                    placeholder="Catatan untuk kurir..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Pilih Pengiriman */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                <Truck size={18} className="text-primary" />
                Pilih Pengiriman
              </div>
              <div className="space-y-3">
                {ongkirOptions.map(opt => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition ${
                      pengiriman === opt.id
                        ? 'border-primary bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pengiriman"
                        value={opt.id}
                        checked={pengiriman === opt.id}
                        onChange={() => setPengiriman(opt.id)}
                        className="accent-primary"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {opt.label}
                        </p>
                        <p className="text-xs text-gray-400">
                          Estimasi {opt.estimasi}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {formatRupiah(opt.harga)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Right - Summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow p-6 sticky top-24">

              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Ringkasan Pesanan
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-medium text-gray-800 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-gray-400">x{item.qty}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {formatRupiah(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Ongkos Kirim ({selectedOngkir?.label})</span>
                  <span>{formatRupiah(selectedOngkir?.harga || 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary text-lg">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>

              {/* Bayar Button */}
              <Link
                to="/payment"
                state={{ form, pengiriman: selectedOngkir, total }}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
              >
                <CreditCard size={18} />
                Lanjut Pembayaran
              </Link>

            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}

export default Checkout