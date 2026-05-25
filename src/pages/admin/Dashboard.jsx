import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Fish, LayoutDashboard, Package, LogOut,
  Plus, Pencil, Trash2, X, Save, Menu,
  ImagePlus, Star, ShoppingBag, TrendingUp,
  DollarSign, AlertCircle
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts'
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImages, getOrders } from '../../api/api'
import { getAllAds, createAd, updateAd, deleteAd } from '../../api/api'
import { Megaphone } from 'lucide-react'

// Data dummy grafik — nanti diganti data real dari order
const dummyChartData = [
  { bulan: 'Jan', pendapatan: 1200000, order: 8 },
  { bulan: 'Feb', pendapatan: 1900000, order: 12 },
  { bulan: 'Mar', pendapatan: 1500000, order: 10 },
  { bulan: 'Apr', pendapatan: 2800000, order: 18 },
  { bulan: 'Mei', pendapatan: 2200000, order: 15 },
  { bulan: 'Jun', pendapatan: 3100000, order: 22 },
]

function Dashboard() {
  const navigate = useNavigate()
  const [productList, setProductList] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [showModal, setShowModal] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [form, setForm] = useState({
    name: '', category: '', price: '', originalPrice: '',
    stock: '', rating: '', reviews: '', image: '',
    images: [], description: '', care: '', specification: '',
    featured: false, isNewProduct: false,
  })

  const [ads, setAds] = useState([])
const [showAdModal, setShowAdModal] = useState(false)
const [editAd, setEditAd] = useState(null)
const [adForm, setAdForm] = useState({
  title: '',
  slot: 'leaderboard-top',
  type: 'image',
  imageUrl: '',
  linkUrl: '',
  adsenseCode: '',
  customCode: '',
  isActive: true,
})

  const categories = ['Ikan Laut', 'Ikan Air Tawar', 'Ikan Koi', 'Pakan', 'Aksesoris']

  const formatRupiah = (num) =>
    'Rp ' + Number(num).toLocaleString('id-ID')

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await getProducts()
      setProductList(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const data = await getOrders()
      setOrders(data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchAds = async () => {
    try {
      const data = await getAllAds()
      setAds(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchOrders()
    fetchAds()
  }, [])

  // Hitung statistik dari orders
  const totalPendapatan = orders
    .filter(o => o.paymentStatus === 'success')
    .reduce((sum, o) => sum + o.total, 0)

  const totalOrder = orders.length
  const orderPending = orders.filter(o => o.status === 'pending').length
  const orderSuccess = orders.filter(o => o.paymentStatus === 'success').length

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    navigate('/admin')
  }

  const openAddModal = () => {
    setEditProduct(null)
    setForm({
      name: '', category: '', price: '', originalPrice: '',
      stock: '', rating: '', reviews: '', image: '',
      images: [], description: '', care: '', specification: '',
      featured: false, isNewProduct: false,
    })
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditProduct(product)
    setForm({
      ...product,
      images: product.images || [],
      care: product.care || '',
      specification: product.specification || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin mau hapus produk ini?')) return
    try {
      await deleteProduct(id)
      await fetchProducts()
    } catch (err) {
      alert('Gagal menghapus produk!')
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    const currentImages = form.images || []
    if (currentImages.length + files.length > 5) {
      alert('Maksimal 5 gambar!')
      return
    }
    setUploadingImages(true)
    try {
      const uploaded = await uploadImages(files)
      const newUrls = uploaded.map(u => u.url)
      const updatedImages = [...currentImages, ...newUrls]
      setForm({ ...form, images: updatedImages, image: updatedImages[0] })
    } catch (err) {
      alert('Gagal upload gambar!')
    } finally {
      setUploadingImages(false)
    }
  }

  const handleRemoveImage = (index) => {
    const updatedImages = form.images.filter((_, i) => i !== index)
    setForm({ ...form, images: updatedImages, image: updatedImages[0] || '' })
  }

  const handleSetMainImage = (index) => {
    const updatedImages = [...(form.images || [])]
    const [selected] = updatedImages.splice(index, 1)
    updatedImages.unshift(selected)
    setForm({ ...form, images: updatedImages, image: updatedImages[0] })
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      alert('Nama, kategori, dan harga wajib diisi!')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || Number(form.price),
        stock: Number(form.stock) || 0,
        rating: Number(form.rating) || 5,
        reviews: Number(form.reviews) || 0,
        image: form.images?.[0] || form.image || '',
      }
      if (editProduct) {
        await updateProduct(editProduct._id, payload)
      } else {
        await createProduct(payload)
      }
      await fetchProducts()
      setShowModal(false)
    } catch (err) {
      alert('Gagal menyimpan produk!')
    } finally {
      setSaving(false)
    }
  }

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 text-primary font-bold text-lg p-5 border-b">
        <Fish size={24} />
        AquaShop
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <button
          onClick={() => { setActiveMenu('dashboard'); setShowSidebar(false) }}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeMenu === 'dashboard' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </button>
        <button
          onClick={() => { setActiveMenu('produk'); setShowSidebar(false) }}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeMenu === 'produk' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Package size={16} />
          Produk
        </button>
        <button
          onClick={() => { setActiveMenu('orders'); setShowSidebar(false) }}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeMenu === 'orders' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ShoppingBag size={16} />
          Orders
          {orderPending > 0 && (
            <span className="ml-auto bg-accent text-white text-xs px-1.5 py-0.5 rounded-full">
              {orderPending}
            </span>
          )}
        </button>
        <button
          onClick={() => { setActiveMenu('ads'); setShowSidebar(false) }}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeMenu === 'ads' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Megaphone size={16} />
          Iklan
        </button>
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-56 bg-white shadow-md flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setShowSidebar(false)} />
          <aside className="relative w-56 bg-white shadow-xl flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0">

        {/* Mobile Top Bar */}
        <div className="md:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <button onClick={() => setShowSidebar(true)} className="text-gray-700 hover:text-primary">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2 text-primary font-bold">
            <Fish size={20} />
            AquaShop Admin
          </div>
          <div className="w-6" />
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-auto">

          {/* ===== DASHBOARD VIEW ===== */}
          {activeMenu === 'dashboard' && (
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">Dashboard</h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                <div className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">Total Produk</p>
                    <Package size={16} className="text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-primary">{productList.length}</p>
                  <p className="text-xs text-gray-400 mt-1">{categories.length} kategori</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">Total Order</p>
                    <ShoppingBag size={16} className="text-secondary" />
                  </div>
                  <p className="text-2xl font-bold text-secondary">{totalOrder}</p>
                  <p className="text-xs text-gray-400 mt-1">{orderSuccess} berhasil</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">Pendapatan</p>
                    <DollarSign size={16} className="text-green-500" />
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    {formatRupiah(totalPendapatan)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">dari order sukses</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">Pending</p>
                    <AlertCircle size={16} className="text-accent" />
                  </div>
                  <p className="text-2xl font-bold text-accent">{orderPending}</p>
                  <p className="text-xs text-gray-400 mt-1">menunggu bayar</p>
                </div>
              </div>

              {/* Grafik Pendapatan */}
              <div className="bg-white rounded-xl shadow p-5 mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-primary" />
                  <h2 className="font-bold text-gray-800">Grafik Pendapatan</h2>
                  <span className="text-xs text-gray-400 ml-auto">6 bulan terakhir</span>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={dummyChartData}>
                    <defs>
                      <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2e7d32" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={v => `${v / 1000000}jt`}
                    />
                    <Tooltip
                      formatter={(value) => [formatRupiah(value), 'Pendapatan']}
                    />
                    <Area
                      type="monotone"
                      dataKey="pendapatan"
                      stroke="#2e7d32"
                      strokeWidth={2}
                      fill="url(#colorPendapatan)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Grafik Order */}
              <div className="bg-white rounded-xl shadow p-5 mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag size={18} className="text-secondary" />
                  <h2 className="font-bold text-gray-800">Grafik Order</h2>
                  <span className="text-xs text-gray-400 ml-auto">6 bulan terakhir</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dummyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => [value, 'Order']} />
                    <Bar dataKey="order" fill="#00acc1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Produk Terbaru */}
              <div className="bg-white rounded-xl shadow p-4 md:p-5">
                <h2 className="font-bold text-gray-800 mb-4">Produk Terbaru</h2>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-gray-500 text-left">
                        <th className="pb-3">Nama Produk</th>
                        <th className="pb-3">Kategori</th>
                        <th className="pb-3">Harga</th>
                        <th className="pb-3">Stok</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productList.slice(0, 5).map(p => (
                        <tr key={p._id} className="border-b last:border-0">
                          <td className="py-3 font-medium text-gray-800">{p.name}</td>
                          <td className="py-3 text-gray-500">{p.category}</td>
                          <td className="py-3 text-primary font-semibold">{formatRupiah(p.price)}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              p.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {p.stock} ekor
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-3">
                  {productList.slice(0, 5).map(p => (
                    <div key={p._id} className="flex items-center gap-3 border-b pb-3 last:border-0">
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.category}</p>
                        <p className="text-xs text-primary font-semibold">{formatRupiah(p.price)}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                        p.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {p.stock}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== ORDERS VIEW ===== */}
{activeMenu === 'orders' && (
  <div>
    <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">
      Manajemen Order
    </h1>

    {orders.length === 0 ? (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Belum ada order masuk</p>
      </div>
    ) : (
      <>
        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-500 text-left">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Pelanggan</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Pembayaran</th>
                <th className="px-4 py-3">Status Order</th>
                <th className="px-4 py-3">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {order.orderId?.slice(0, 18)}...
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{order.customer?.nama}</p>
                    <p className="text-xs text-gray-400">{order.customer?.telepon}</p>
                    <p className="text-xs text-gray-400">{order.customer?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-primary font-semibold">
                    {formatRupiah(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'success' ? 'bg-green-100 text-green-700' :
                      order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={async (e) => {
                        try {
                          await fetch(`http://localhost:5000/api/orders/${order.orderId}/status`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              status: e.target.value,
                              paymentStatus: e.target.value === 'delivered' || e.target.value === 'processing'
                                ? 'success'
                                : e.target.value === 'cancelled'
                                ? 'failed'
                                : order.paymentStatus
                            })
                          })
                          await fetchOrders()
                        } catch (err) {
                          alert('Gagal update status!')
                        }
                      }}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-xs outline-none focus:border-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Dikirim</option>
                      <option value="delivered">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-mono text-xs text-gray-400">
                    {order.orderId?.slice(0, 15)}...
                  </p>
                  <p className="font-semibold text-gray-800 mt-1">
                    {order.customer?.nama}
                  </p>
                  <p className="text-xs text-gray-400">{order.customer?.email}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  order.paymentStatus === 'success' ? 'bg-green-100 text-green-700' :
                  order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-1 mb-3">
                {order.items?.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded shrink-0" />
                    )}
                    <p className="text-xs text-gray-600 line-clamp-1">{item.name} x{item.qty}</p>
                  </div>
                ))}
                {order.items?.length > 2 && (
                  <p className="text-xs text-gray-400">+{order.items.length - 2} item lainnya</p>
                )}
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-primary font-bold text-sm">
                  {formatRupiah(order.total)}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString('id-ID')}
                </span>
              </div>

              {/* Update Status */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Status:</span>
                <select
                  value={order.status}
                  onChange={async (e) => {
                    try {
                      await fetch(`http://localhost:5000/api/orders/${order.orderId}/status`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          status: e.target.value,
                          paymentStatus: e.target.value === 'delivered' || e.target.value === 'processing'
                            ? 'success'
                            : e.target.value === 'cancelled'
                            ? 'failed'
                            : order.paymentStatus
                        })
                      })
                      await fetchOrders()
                    } catch (err) {
                      alert('Gagal update status!')
                    }
                  }}
                  className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Dikirim</option>
                  <option value="delivered">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
)}

          {/* ===== PRODUK VIEW ===== */}
          {activeMenu === 'produk' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Manajemen Produk</h1>
                <button
                  onClick={openAddModal}
                  className="bg-primary text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium flex items-center gap-1 md:gap-2 hover:bg-green-700 transition"
                >
                  <Plus size={15} />
                  <span className="hidden md:inline">Tambah Produk</span>
                  <span className="md:hidden">Tambah</span>
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr className="text-gray-500 text-left">
                          <th className="px-4 py-3">Produk</th>
                          <th className="px-4 py-3">Kategori</th>
                          <th className="px-4 py-3">Harga</th>
                          <th className="px-4 py-3">Stok</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productList.map(p => (
                          <tr key={p._id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                                <span className="font-medium text-gray-800 line-clamp-1">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-500">{p.category}</td>
                            <td className="px-4 py-3 text-primary font-semibold">{formatRupiah(p.price)}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                p.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {p.stock} ekor
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {p.featured && <span className="bg-secondary text-white text-xs px-2 py-0.5 rounded-full">Unggulan</span>}
                                {p.isNewProduct && <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">Baru</span>}
                                {!p.featured && !p.isNewProduct && <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">Normal</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => openEditModal(p)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                                  <Pencil size={14} />
                                </button>
                                <button onClick={() => handleDelete(p._id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden space-y-3">
                    {productList.map(p => (
                      <div key={p._id} className="bg-white rounded-xl shadow p-3 flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.category}</p>
                          <p className="text-xs text-primary font-bold">{formatRupiah(p.price)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            p.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            Stok: {p.stock}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button onClick={() => openEditModal(p)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(p._id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

       


      {/* ===== ADS VIEW ===== */}
{activeMenu === 'ads' && (
  <div>
    <div className="flex items-center justify-between mb-5">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800">
        Manajemen Iklan
      </h1>

      <button
        onClick={() => {
          setEditAd(null)
          setAdForm({
            title: '',
            slot: 'leaderboard-top',
            type: 'image',
            imageUrl: '',
            linkUrl: '',
            adsenseCode: '',
            customCode: '',
            isActive: true,
          })
          setShowAdModal(true)
        }}
        className="bg-primary text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium flex items-center gap-2 hover:bg-green-700 transition"
      >
        <Plus size={15} />
        Tambah Iklan
      </button>
    </div>

    {/* SLOT STATUS */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      {[
        {
          slot: 'leaderboard-top',
          label: 'Leaderboard Atas',
          size: '728x90',
        },
        {
          slot: 'rectangle-left',
          label: 'Rectangle Kiri',
          size: '300x250',
        },
        {
          slot: 'rectangle-right',
          label: 'Rectangle Kanan',
          size: '300x250',
        },
        {
          slot: 'footer',
          label: 'Footer Banner',
          size: '728x90',
        },
      ].map((s) => {
        const activeAd = ads.find(
          (a) => a.slot === s.slot && a.isActive
        )

        return (
          <div
            key={s.slot}
            className={`rounded-xl p-3 border-2 transition ${
              activeAd
                ? 'border-primary bg-green-50'
                : 'border-dashed border-gray-300 bg-gray-50'
            }`}
          >
            <p className="text-xs font-semibold text-gray-700">
              {s.label}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              {s.size}
            </p>

            <div className="mt-2">
              {activeAd ? (
                <span className="text-xs font-medium text-primary">
                  ✅ Aktif
                </span>
              ) : (
                <span className="text-xs font-medium text-gray-400">
                  ⭕ Kosong
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>

    {/* EMPTY STATE */}
    {ads.length === 0 ? (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <Megaphone
          size={52}
          className="mx-auto text-gray-300 mb-4"
        />

        <h2 className="text-lg font-semibold text-gray-700 mb-1">
          Belum ada iklan
        </h2>

        <p className="text-sm text-gray-400">
          Tambahkan banner atau kode AdSense untuk mulai monetisasi
        </p>
      </div>
    ) : (
      <>
        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Slot</th>
                <th className="px-4 py-3">Tipe</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {ads.map((ad) => (
                <tr
                  key={ad._id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {ad.imageUrl ? (
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="w-14 h-10 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="w-14 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Megaphone
                            size={16}
                            className="text-gray-400"
                          />
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-gray-800">
                          {ad.title}
                        </p>

                        {ad.linkUrl && (
                          <p className="text-xs text-gray-400 truncate max-w-[180px]">
                            {ad.linkUrl}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      {ad.slot}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                      {ad.type}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        ad.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {ad.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditAd(ad)
                          setAdForm({ ...ad })
                          setShowAdModal(true)
                        }}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={async () => {
                          if (!confirm('Hapus iklan ini?')) return

                          await deleteAd(ad._id)
                          await fetchAds()
                        }}
                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD */}
        <div className="md:hidden space-y-3">
          {ads.map((ad) => (
            <div
              key={ad._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex items-start gap-3">
                {ad.imageUrl ? (
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-16 h-14 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-16 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Megaphone
                      size={18}
                      className="text-gray-400"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {ad.title}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    {ad.slot}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-full">
                      {ad.type}
                    </span>

                    <span
                      className={`text-[10px] px-2 py-1 rounded-full ${
                        ad.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {ad.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setEditAd(ad)
                      setAdForm({ ...ad })
                      setShowAdModal(true)
                    }}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    onClick={async () => {
                      if (!confirm('Hapus iklan ini?')) return

                      await deleteAd(ad._id)
                      await fetchAds()
                    }}
                    className="p-2 bg-red-50 text-red-500 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
)}
 </div>
    </main>
    
{/* Modal Ads */}
{showAdModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 md:p-6">

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800">
          {editAd ? 'Edit Iklan' : 'Tambah Iklan Baru'}
        </h2>
        <button onClick={() => setShowAdModal(false)} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Judul Iklan</label>
          <input
            value={adForm.title}
            onChange={e => setAdForm({ ...adForm, title: e.target.value })}
            placeholder="Contoh: Banner Promo Maret"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Slot Iklan</label>
          <select
            value={adForm.slot}
            onChange={e => setAdForm({ ...adForm, slot: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="leaderboard-top">Leaderboard Atas (728x90)</option>
            <option value="rectangle-left">Rectangle Kiri (300x250)</option>
            <option value="rectangle-right">Rectangle Kanan (300x250)</option>
            <option value="footer">Footer Banner (728x90)</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Tipe Iklan</label>
          <select
            value={adForm.type}
            onChange={e => setAdForm({ ...adForm, type: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="image">Gambar (Image)</option>
            <option value="adsense">Google AdSense</option>
            <option value="custom">Custom HTML</option>
          </select>
        </div>

        {adForm.type === 'image' && (
          <>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">URL Gambar</label>
              <input
                value={adForm.imageUrl}
                onChange={e => setAdForm({ ...adForm, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
              />
              {adForm.imageUrl && (
                <img
                  src={adForm.imageUrl}
                  alt="preview"
                  className="mt-2 w-full h-24 object-cover rounded-lg"
                  onError={e => e.target.style.display = 'none'}
                />
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">URL Tujuan (klik)</label>
              <input
                value={adForm.linkUrl}
                onChange={e => setAdForm({ ...adForm, linkUrl: e.target.value })}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </>
        )}

        {adForm.type === 'adsense' && (
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Kode AdSense</label>
            <textarea
              value={adForm.adsenseCode}
              onChange={e => setAdForm({ ...adForm, adsenseCode: e.target.value })}
              placeholder="Paste kode AdSense di sini..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none font-mono"
            />
          </div>
        )}

        {adForm.type === 'custom' && (
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Custom HTML</label>
            <textarea
              value={adForm.customCode}
              onChange={e => setAdForm({ ...adForm, customCode: e.target.value })}
              placeholder="Paste kode HTML iklan di sini..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none font-mono"
            />
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={adForm.isActive}
            onChange={e => setAdForm({ ...adForm, isActive: e.target.checked })}
            className="accent-primary"
          />
          Aktifkan Iklan
        </label>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setShowAdModal(false)}
          className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition text-sm"
        >
          Batal
        </button>
        <button
          onClick={async () => {
            if (!adForm.title || !adForm.slot) {
              alert('Judul dan slot wajib diisi!')
              return
            }
            if (editAd) {
              await updateAd(editAd._id, adForm)
            } else {
              await createAd(adForm)
            }
            await fetchAds()
            setShowAdModal(false)
          }}
          className="flex-1 bg-primary text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition text-sm"
        >
          <Save size={15} />
          {editAd ? 'Simpan' : 'Tambah'}
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  )
}

export default Dashboard