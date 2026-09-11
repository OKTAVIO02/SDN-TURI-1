import CardEkskul from '../components/CardEkskul'
import CardPrestasi from '../components/CardPrestasi'
import { achievements, extracurriculars } from '../data/schoolData'

function Akademik() {
  return <section className="container page"><div className="page-heading"><p className="eyebrow">BELAJAR DAN BERKARYA</p><h1>Akademik</h1><p className="lead">Pembelajaran di kelas berjalan beriringan dengan pengalaman, kolaborasi, dan ruang berekspresi.</p></div><h2>Ekstrakurikuler</h2><div className="card-grid">{extracurriculars.map((name) => <CardEkskul key={name} name={name} />)}</div><h2>Prestasi terbaru</h2><div className="card-grid">{achievements.map((achievement) => <CardPrestasi key={achievement.title} achievement={achievement} />)}</div></section>
}

export default Akademik
