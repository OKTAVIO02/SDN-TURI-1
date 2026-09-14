import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const loginUrl = 'https://sdn1turi.my.id/api/login.php'

function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const responseBody = await response.text()
      let result

      try {
        result = JSON.parse(responseBody)
      } catch {
        throw new Error('API login belum mengembalikan JSON. Periksa config.php dan file login.php di hosting.')
      }

      if (!response.ok) throw new Error(result.error || 'Login gagal.')
      navigate('/admin', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return <main className="admin-login-page"><div className="admin-login-card"><div className="admin-login-brand"><img className="admin-brand-logo" src="/logo%20sdn.svg" alt="" /><div><strong>Admin Panel</strong><small>SD Negeri Turi 1</small></div></div><p className="eyebrow">AREA TERBATAS</p><h1>Masuk ke dashboard.</h1><p className="admin-login-intro">Kelola profil, guru, kegiatan, prestasi, dan fasilitas sekolah dari satu tempat.</p><form onSubmit={submit}><label>Username<input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} /></label><label>Password<input autoComplete="current-password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="admin-login-error">{error}</p>}<button className="admin-action" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Memeriksa...' : 'Masuk ke Admin'}</button></form></div></main>
}

export default AdminLogin
