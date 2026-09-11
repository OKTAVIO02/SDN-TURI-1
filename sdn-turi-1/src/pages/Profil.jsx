import CardGuru from '../components/CardGuru'
import { schoolInfo, teachers } from '../data/schoolData'

function Profil() {
  return <section className="container page"><div className="page-heading"><p className="eyebrow">TENTANG KAMI</p><h1>Profil sekolah</h1><p className="lead">Mengenal identitas, perjalanan, dan orang-orang yang membuat SD Negeri Turi 1 terus bertumbuh.</p></div><div className="two-column"><article><h2>Visi</h2><p>{schoolInfo.vision}</p><h2>Misi</h2><ul>{schoolInfo.mission.map((item) => <li key={item}>{item}</li>)}</ul></article><aside className="fact-panel"><span>NPSN</span><strong>{schoolInfo.npsn}</strong><span>BERDIRI DAN BERTUMBUH</span><p>{schoolInfo.history}</p></aside></div><h2>Guru dan staf</h2><div className="card-grid">{teachers.map((teacher) => <CardGuru key={teacher.name} teacher={teacher} />)}</div></section>
}

export default Profil
