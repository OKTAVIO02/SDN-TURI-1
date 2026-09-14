import { useEffect, useState } from 'react'
import CardGuru from '../components/CardGuru'
import { schoolInfo } from '../data/schoolData'

const apiBaseUrl = 'https://sdn1turi.my.id/api'

function Profil() {
  const [profile, setProfile] = useState(schoolInfo)
  const [teachers, setTeachers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTeachers() {
      try {
        const [profileResponse, teachersResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/school-profile.php`),
          fetch(`${apiBaseUrl}/teachers.php`),
        ])

        if (!profileResponse.ok || !teachersResponse.ok) {
          throw new Error('Data guru tidak dapat dimuat.')
        }

        setProfile(await profileResponse.json() || schoolInfo)
        setTeachers(await teachersResponse.json())
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadTeachers()
  }, [])

  const mission = Array.isArray(profile.mission)
    ? profile.mission.filter(Boolean)
    : profile.mission?.split('\n').filter(Boolean) || schoolInfo.mission
  return <section className="container page"><div className="page-heading"><p className="eyebrow">TENTANG KAMI</p><h1>Profil sekolah</h1><p className="lead">Mengenal identitas, perjalanan, dan orang-orang yang membuat {profile.name} terus bertumbuh.</p></div><div className="two-column"><article><h2>Visi</h2><p>{profile.vision}</p><h2>Misi</h2><ul>{mission.map((item) => <li key={item}>{item}</li>)}</ul></article><aside className="fact-panel"><span>NPSN</span><strong>{profile.npsn}</strong><span>BERDIRI DAN BERTUMBUH</span><p>{profile.history}</p></aside></div><h2>Guru dan staf</h2>{isLoading && <p className="lead">Memuat data guru...</p>}{error && <p className="lead">{error}</p>}{!isLoading && !error && <div className="card-grid">{teachers.map((teacher) => <CardGuru key={teacher.id} teacher={teacher} />)}</div>}</section>
}

export default Profil
