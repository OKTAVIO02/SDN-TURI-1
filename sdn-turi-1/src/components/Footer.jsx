import { Link } from 'react-router-dom'
import { schoolInfo } from '../data/schoolData'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <strong>{schoolInfo.name}</strong>
          <p>{schoolInfo.tagline}</p>
          <div className="footer-contact-list">
            <span>{schoolInfo.address}</span>
            <span>{schoolInfo.phone}</span>
            <span>{schoolInfo.email}</span>
          </div>
        </div>

        <div className="footer-column">
          <h4>Menu Cepat</h4>
          <ul>
            <li><Link to="/">Beranda</Link></li>
            <li><Link to="/profil">Profil Sekolah</Link></li>
            <li><Link to="/artikel">Berita &amp; Artikel</Link></li>
            <li><Link to="/akademik">Akademik</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Kontak Kami</h4>
          <ul>
            <li>{schoolInfo.address}</li>
            <li>{schoolInfo.phone}</li>
            <li>{schoolInfo.email}</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Hubungi Sekolah</h4>
          <p>Untuk informasi terbaru dan kebutuhan administrasi, silakan kirim email kepada kami.</p>
          <a className="footer-email-link" href={`mailto:${schoolInfo.email}`}>Kirim email <span>-&gt;</span></a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 {schoolInfo.name}. Semua hak dilindungi.</span>
        <span>Dibuat dengan sepenuh hati</span>
      </div>
    </footer>
  )
}

export default Footer
