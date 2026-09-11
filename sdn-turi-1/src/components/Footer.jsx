import { schoolInfo } from '../data/schoolData'

function Footer() {
  return <footer className="site-footer"><div className="container footer-content"><strong>{schoolInfo.name}</strong><span>{schoolInfo.address}</span><span>{schoolInfo.email}</span></div></footer>
}

export default Footer
