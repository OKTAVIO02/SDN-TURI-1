import { schoolInfo } from '../data/schoolData'

function Landing({ onEnter, leaving = false }) {
  return (
    <div className={`intro-screen${leaving ? ' is-leaving' : ''}`} aria-label="Pembuka SD Negeri Turi 1">
      <div className="intro-orbit intro-orbit-one" />
      <div className="intro-orbit intro-orbit-two" />
      <div className="intro-content">
        <img className="intro-logo" src="/logo%20sdn.svg" alt="Logo SD Negeri Turi 1" />
        <p className="intro-kicker">Selamat datang di</p>
        <h1 className="intro-title">{schoolInfo.name}</h1>
        <p className="intro-tagline">{schoolInfo.tagline}</p>
        <button className="intro-enter" type="button" onClick={onEnter}>
          Masuk ke Website <span>-&gt;</span>
        </button>
      </div>
    </div>
  )
}

export default Landing