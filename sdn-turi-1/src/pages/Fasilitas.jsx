import { useEffect, useState } from 'react'
import CardFasilitas from '../components/CardFasilitas'

const facilitiesApiUrl = 'https://sdn1turi.my.id/api/facilities.php'

function Fasilitas() {
  const [facilities, setFacilities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadFacilities() {
      try {
        const response = await fetch(facilitiesApiUrl)

        if (!response.ok) {
          throw new Error('Data fasilitas tidak dapat dimuat.')
        }

        const data = await response.json()
        setFacilities(data)
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadFacilities()
  }, [])

  return <section className="container page"><div className="page-heading"><p className="eyebrow">RUANG UNTUK BERTUMBUH</p><h1>Fasilitas sekolah</h1><p className="lead">Lingkungan yang aman, sehat, dan menyenangkan membantu setiap kegiatan belajar terasa lebih bermakna.</p></div>{isLoading && <p className="lead">Memuat fasilitas...</p>}{error && <p className="lead">{error}</p>}{!isLoading && !error && <div className="facility-grid">{facilities.map((facility) => <CardFasilitas key={facility.id} facility={facility} />)}</div>}<div className="highlight"><span className="panel-number">*</span><div><h2>Fasilitas unggulan: Taman Belajar</h2><p>Ruang terbuka yang dirawat bersama untuk membaca, berdiskusi, dan mengenal lingkungan sekitar.</p></div></div></section>
}

export default Fasilitas
