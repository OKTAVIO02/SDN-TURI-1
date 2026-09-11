import { Link } from 'react-router-dom'
import { schoolInfo } from '../data/schoolData'

function Home() {
  return <section className="container page home-page"><div className="hero-copy"><p className="eyebrow">SELAMAT DATANG DI</p><h1>{schoolInfo.name}</h1><p className="hero-tagline">{schoolInfo.tagline}</p><p className="lead">Sekolah dasar yang menumbuhkan rasa ingin tahu, karakter baik, dan keberanian untuk terus belajar.</p><Link className="button" to="/profil">Kenali sekolah kami <span>{'->'}</span></Link><div className="hero-facts"><span><strong>6+</strong> kegiatan belajar</span><span><strong>1</strong> keluarga sekolah</span></div></div><div className="hero-art" aria-label="Ilustrasi suasana belajar yang ceria"><span className="sun" /><span className="cloud cloud-one" /><span className="cloud cloud-two" /><div className="hill hill-back" /><div className="hill hill-front" /><div className="storybook"><span /><span /></div><div className="mascot"><i className="ear ear-left" /><i className="ear ear-right" /><div className="face"><b className="eye eye-left" /><b className="eye eye-right" /><em /></div><div className="scarf" /></div><span className="spark spark-one">+</span><span className="spark spark-two">*</span><div className="welcome-note"><span className="panel-number">01</span><p>Setiap anak memiliki cahaya.</p><small>Sambutan keluarga besar sekolah</small></div></div></section>
}

export default Home
