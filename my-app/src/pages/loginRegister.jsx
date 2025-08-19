import React, { useState } from 'react'
import { apiPost } from '../services/api'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    mobile_number: '',
    user_type: '',
    roles: ''
  })

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
console.log("Form state on submit:", form);
    try {
      // 🟢 Step 1: Register the user
      await apiPost('/register', form)

      console.log('✅ Registration successful. Now logging in...')
console.log("Trying to login with:", {
  email: form.email,
  password: form.password
});
      // 🟢 Step 2: Login immediately with same credentials
      const loginRes = await apiPost('/login', {
        email: form.email,
        password: form.password
      })

      if (loginRes.data?.token) {
        // 🟢 Step 3: Save token in localStorage
        localStorage.setItem('token', loginRes.data.token)

        // 🟢 Step 4: Redirect to /institution
        navigate('/institution')
      } else {
        alert('Login failed after registration')
      }
    } catch (err) {
      console.error('❌ Registration/Login error:', err)
      alert('Registration or login failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full border rounded p-2"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border rounded p-2"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="mobile_number"
          value={form.mobile_number}
          onChange={handleChange}
          placeholder="Mobile Number"
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="user_type"
          value={form.user_type}
          onChange={handleChange}
          placeholder="User Type"
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="roles"
          value={form.roles}
          onChange={handleChange}
          placeholder="Roles"
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}

export default Register
