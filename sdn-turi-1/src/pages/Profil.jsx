import { useEffect, useState } from 'react'
import CardGuru from '../components/CardGuru'
import { schoolInfo } from '../data/schoolData'

const teachersApiUrl = 'https://sdn1turi.my.id/api/teachers.php'

function Profil() {
  const [teachers, setTeachers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTeachers() {
      try {
        const response = await fetch(teachersApiUrl)

        if (!response.ok) {
          throw new Error('Data guru tidak dapat dimuat.')
        }

        setTeachers(await response.json())
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadTeachers()
  }, [])

  return <section className="container page"><div className="page-heading"><p className="eyebrow">TENTANG KAMI</p><h1>Profil sekolah</h1><p className="lead">Mengenal identitas, perjalanan, dan orang-orang yang membuat SD Negeri Turi 1 terus bertumbuh.</p></div><div className="two-column"><article><h2>Visi</h2><p>{schoolInfo.vision}</p><h2>Misi</h2><ul>{schoolInfo.mission.map((item) => <li key={item}>{item}</li>)}</ul></article><aside className="fact-panel"><span>NPSN</span><strong>{schoolInfo.npsn}</strong><span>BERDIRI DAN BERTUMBUH</span><p>{schoolInfo.history}</p></aside></div><h2>Guru dan staf</h2>{isLoading && <p className="lead">Memuat data guru...</p>}{error && <p className="lead">{error}</p>}{!isLoading && !error && <div className="card-grid">{teachers.map((teacher) => <CardGuru key={teacher.id} teacher={teacher} />)}</div>}</section>
}

export default Profil
