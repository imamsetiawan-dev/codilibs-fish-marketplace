import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import useAuthStore from '../store/authStore'
import { User, ShoppingBag, LogOut, MapPin, Phone, Mail, Package, Clock, CheckCircle, XCircle } from 'lucide-react'

const BASE_URL = 'https://codilibs-fish-marketplace-production.up.railway.app'

function Profile() {
  const navigate = useNavigate()
  const { user, token, logout } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')

  const formatRupiah = (num) =>
    'Rp ' + Number(num).toLocaleString('id-ID')

  useEffect(() => {
    if (!user || !token) {
      navigate('/login')
      return
    }
    fetchMyOrders()
  }, [user, token])

  const fetchMyOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'failed': return 'bg-red-100 text-red-700'
      case 'processing': return 'bg-blue-100 text-blue-700'
      case 'shipped': return 'bg-purple-100 text-purple-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
      case 'delivered': return <CheckCircle size={14} />
      case 'failed':
      case 'cancelled': return <XCircle size={14} />
      default: return <Clock size={14} />
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Menunggu Bayar',
      success: 'Pembayaran Sukses',
      failed: 'Pembayaran Gagal',
      processing: 'Diproses',
      shipped: 'Dikirim',
      delivered: 'Selesai',
      cancelled: 'Dibatalkan',
    }
    return labels[status] || status
  }

  if (!user) return null

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header Profile */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center shrink-0">
              <User size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{user.nama}</h1>
              <p className="text-green-100 text-sm">{user.email}</p>
              {user.telepon && (
                <p className="text-green-100 text-sm">{user.telepon}</p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-sm px-3 py-2 rounded-lg transition"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-primary">{orders.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total Order</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.paymentStatus === 'success').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Berhasil</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">
              {orders.filter(o => o.paymentStatus === 'pending').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Pending</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'orders'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
            }`}
          >
            <ShoppingBag size={16} />
            Riwayat Order
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'profile'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
            }`}
          >
            <User size={16} />
            Data Diri
          </button>
        </div>

        {/* Tab Orders */}
        {activeTab === 'orders' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-12 text-center">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-lg font-semibold text-gray-600 mb-2">
                  Belum ada order
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Yuk mulai belanja ikan hias impianmu!
                </p>
                <Link
                  to="/shop"
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  Mulai Belanja
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="bg-white rounded-2xl shadow p-4 md:p-5">

                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-mono text-xs text-gray-400 mb-1">
                          {order.orderId}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          getStatusColor(order.paymentStatus)
                        }`}>
                          {getStatusIcon(order.paymentStatus)}
                          {getStatusLabel(order.paymentStatus)}
                        </span>
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          getStatusColor(order.status)
                        }`}>
                          <Package size={12} />
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex gap-3 items-center">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-400">x{item.qty}</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-800 shrink-0">
                            {formatRupiah(item.price * item.qty)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Alamat */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-800">{order.customer?.nama}</p>
                          <p className="text-xs text-gray-500">
                            {order.customer?.alamat}, {order.customer?.kota}, {order.customer?.provinsi}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Footer */}
                    <div className="flex items-center justify-between border-t pt-3">
                      <div className="text-sm text-gray-500">
                        Pengiriman: {order.pengiriman?.label || '-'}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Total Bayar</p>
                        <p className="font-bold text-primary">
                          {formatRupiah(order.total)}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-gray-800 mb-4">Data Diri</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <User size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Nama Lengkap</p>
                  <p className="text-sm font-medium text-gray-800">{user.nama}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Mail size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-800">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Nomor Telepon</p>
                  <p className="text-sm font-medium text-gray-800">
                    {user.telepon || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Profile