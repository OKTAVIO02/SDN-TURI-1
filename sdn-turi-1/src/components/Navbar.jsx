import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/profil', label: 'Profil' },
  { to: '/akademik', label: 'Akademik' },
  { to: '/fasilitas', label: 'Fasilitas' },
  { to: '/artikel', label: 'Artikel' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container navbar">
        <NavLink className="brand" to="/">
          <img className="brand-logo" src="/logo%20sdn.svg" alt="Logo SD Negeri Turi 1" />
          <span className="brand-name">SD Negeri Turi 1</span>
        </NavLink>
        <button className="menu-toggle" type="button" aria-expanded={isMenuOpen} aria-controls="main-navigation" onClick={() => setIsMenuOpen((open) => !open)}>
          <span />
          <span />
          <span />
          <span className="sr-only">Buka menu navigasi</span>
        </button>
        <nav id="main-navigation" className={isMenuOpen ? 'is-open' : ''} aria-label="Navigasi utama">
          {links.map((link) => <NavLink key={link.to} className="nav-link" to={link.to} end={link.to === '/'} onClick={() => setIsMenuOpen(false)}>{link.label}</NavLink>)}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
