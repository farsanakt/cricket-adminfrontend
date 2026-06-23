import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { loginUser } from "../api/authApi"
import logo from "../assets/company-logo.png"

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)
  const [pwFocus, setPwFocus]       = useState(false)

  const validate = () => {
    const e = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email.'
    }
    if (!password) {
      e.password = 'Password is required.'
    }
    return e
  }

const handleSubmit = async () => {
  const errs = validate()
  setErrors(errs)

  if (Object.keys(errs).length) return

  setLoading(true)

  try {
    const data = await loginUser({ email, password })
    // ✅ STORE DATA
localStorage.setItem("token", data.token)
localStorage.setItem("userId", data.id)
localStorage.setItem("role", data.role)

    console.log("Login Success:", data)

    setSuccess(true)

    // 🔥 send FULL data to App
    onLogin(data)

  } catch (err) {
    console.error(err)
    alert(err.message || "Login failed")
  } finally {
    setLoading(false)
  }
}
  const inputStyle = (focused, hasErr) => ({
    width: '100%',
    padding: '11px 12px 11px 38px',
    border: `1.5px solid ${hasErr ? '#e53935' : focused ? '#2f9be0' : '#e8e8e8'}`,
    borderRadius: '9px',
    fontSize: '14px',
    color: '#222',
    background: '#fafafa',
    outline: 'none',
    boxShadow: focused && !hasErr
      ? '0 0 0 3px rgba(47, 155, 224,0.12)'
      : hasErr
      ? '0 0 0 3px rgba(229,57,53,0.08)'
      : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  })

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #123577 0%, #0d2a63 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Brand */}
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <img src={logo} alt="Palaestra" style={{ height: '50px', width: 'auto' }} />
        <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.72)', letterSpacing: '0.5px', marginTop: '12px' }}>Management Console</div>
      </div>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px 36px', border: '1px solid #e6e7eb', boxShadow: '0 18px 50px rgba(0,0,0,0.28)', width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: '#2f9be0', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(47, 155, 224,0.3)' }}>
            <Mail size={24} style={{ color: '#fff' }} />
          </div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '22px', fontWeight: '700', color: '#2f9be0', marginBottom: '4px' }}>Welcome back</div>
          <div style={{ fontSize: '13px', color: '#888' }}>Sign in to your account</div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: emailFocus ? '#2f9be0' : '#bbb', display: 'flex', pointerEvents: 'none' }}>
              <Mail size={15} />
            </span>
            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: '' })) }}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              style={inputStyle(emailFocus, !!errors.email)}
            />
          </div>
          {errors.email && <div style={{ fontSize: '12px', color: '#e53935', marginTop: '4px' }}>{errors.email}</div>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: pwFocus ? '#2f9be0' : '#bbb', display: 'flex', pointerEvents: 'none' }}>
              <Lock size={15} />
            </span>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              placeholder="Enter your password"
              onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: '' })) }}
              onFocus={() => setPwFocus(true)}
              onBlur={() => setPwFocus(false)}
              style={{ ...inputStyle(pwFocus, !!errors.password), paddingRight: '40px' }}
            />
            <button
              onClick={() => setShowPw(v => !v)}
              type="button"
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: showPw ? '#2f9be0' : '#bbb', display: 'flex', padding: 0 }}
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <div style={{ fontSize: '12px', color: '#e53935', marginTop: '4px' }}>{errors.password}</div>}
        </div>

        {/* Forgot */}
        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', color: '#2f9be0', fontWeight: '500', cursor: 'pointer' }}>
            Forgot password?
          </span>
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          type="button"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: success ? '#388e3c' : '#2f9be0',
            color: 'white',
            border: 'none',
            borderRadius: '9px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 3px 12px rgba(47, 155, 224,0.28)',
            transition: 'background 0.3s'
          }}
        >
          {loading ? 'Signing in…' : success ? '✓ Signed In' : 'Sign In'}
        </button>

        <div style={{ textAlign: 'center', fontSize: '13px', color: '#aaa', marginTop: '20px' }}>
          Don't have an account?{' '}
          <span style={{ color: '#2f9be0', fontWeight: '600', cursor: 'pointer' }}>
            Contact admin
          </span>
        </div>
      </div>
    </div>
  )
}