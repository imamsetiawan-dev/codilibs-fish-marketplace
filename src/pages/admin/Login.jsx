import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Fish, Lock, User } from 'lucide-react'

function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (form.username === 'admin' && form.password === 'aquashop123') {
      localStorage.setItem('isAdmin', 'true')
      navigate('/admin/dashboard')
    } else {
      setError('Username atau password salah!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-primary font-bold text-2xl mb-2">
            <Fish size={32} />
            AquaShop
          </div>
          <p className="text-gray-500 text-sm">Dashboard Admin</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="admin"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Masuk
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          AquaShop Admin Panel v1.0
        </p>
      </div>
    </div>
  )
}

export default AdminLogin