import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/profil', label: 'Profil' },
  { to: '/akademik', label: 'Akademik' },
  { to: '/fasilitas', label: 'Fasilitas' },
  { to: '/admin', label: 'Admin' },
]

function Navbar() {
  return (
    <header className="site-header">
      <div className="container navbar">
        <NavLink className="brand" to="/"><span className="brand-mark">T1</span><span>SD Negeri Turi 1</span></NavLink>
        <nav aria-label="Navigasi utama">
          {links.map((link) => <NavLink key={link.to} className="nav-link" to={link.to} end={link.to === '/'}>{link.label}</NavLink>)}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
