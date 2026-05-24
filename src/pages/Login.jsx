import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Fish, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { login } from '../api/api'
import useAuthStore from '../store/authStore'

function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(state => state.setAuth)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi!')
      return
    }

    setLoading(true)
    try {
      const data = await login(form)
      if (data.error) {
        setError(data.error)
        return
      }
      setAuth(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError('Terjadi kesalahan, coba lagi!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center gap-2 text-primary font-bold text-2xl mb-2">
            <Fish size={32} />
            AquaShop
          </Link>
          <p className="text-gray-500 text-sm">Masuk ke akun kamu</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg pl-9 pr-10 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : 'Masuk'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Daftar Sekarang
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login