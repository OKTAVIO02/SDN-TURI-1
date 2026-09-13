import { useEffect, useState } from 'react'
import CardEkskul from '../components/CardEkskul'
import CardPrestasi from '../components/CardPrestasi'

const apiBaseUrl = 'https://sdn1turi.my.id/api'

function Akademik() {
  const [extracurriculars, setExtracurriculars] = useState([])
  const [achievements, setAchievements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadAcademicData() {
      try {
        const [extracurricularResponse, achievementResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/extracurriculars.php`),
          fetch(`${apiBaseUrl}/achievements.php`),
        ])

        if (!extracurricularResponse.ok || !achievementResponse.ok) {
          throw new Error('Data akademik tidak dapat dimuat.')
        }

        setExtracurriculars(await extracurricularResponse.json())
        setAchievements(await achievementResponse.json())
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadAcademicData()
  }, [])

  return <section className="container page"><div className="page-heading"><p className="eyebrow">BELAJAR DAN BERKARYA</p><h1>Akademik</h1><p className="lead">Pembelajaran di kelas berjalan beriringan dengan pengalaman, kolaborasi, dan ruang berekspresi.</p></div>{isLoading && <p className="lead">Memuat data akademik...</p>}{error && <p className="lead">{error}</p>}{!isLoading && !error && <><h2>Ekstrakurikuler</h2><div className="card-grid">{extracurriculars.map((item) => <CardEkskul key={item.id} name={item.name} description={item.description} />)}</div><h2>Prestasi terbaru</h2><div className="card-grid">{achievements.map((achievement) => <CardPrestasi key={achievement.id} achievement={achievement} />)}</div></>}</section>
}

export default Akademik
