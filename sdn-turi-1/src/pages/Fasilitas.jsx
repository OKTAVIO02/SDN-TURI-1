import CardFasilitas from '../components/CardFasilitas'
import { facilities } from '../data/schoolData'

function Fasilitas() {
  return <section className="container page"><div className="page-heading"><p className="eyebrow">RUANG UNTUK BERTUMBUH</p><h1>Fasilitas sekolah</h1><p className="lead">Lingkungan yang aman, sehat, dan menyenangkan membantu setiap kegiatan belajar terasa lebih bermakna.</p></div><div className="facility-grid">{facilities.map((facility) => <CardFasilitas key={facility.name} facility={facility} />)}</div><div className="highlight"><span className="panel-number">*</span><div><h2>Fasilitas unggulan: Taman Belajar</h2><p>Ruang terbuka yang dirawat bersama untuk membaca, berdiskusi, dan mengenal lingkungan sekitar.</p></div></div></section>
}

export default Fasilitas
