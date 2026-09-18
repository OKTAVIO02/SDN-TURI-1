import { useEffect, useState } from 'react'

const contactsApiUrl = 'https://sdn1turi.my.id/api/contacts.php'
const fallbackContacts = [
  { label: 'Alamat', value: 'Jl. Turi No.2, Area Persawahan, Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352' },
  { label: 'Telepon', value: '(0274) 123456', link_url: 'tel:(0274)123456' },
  { label: 'Email', value: 'info@sdnturi1.sch.id', link_url: 'mailto:info@sdnturi1.sch.id' },
  { label: 'Jam pelayanan', value: 'Senin - Jumat, 07.00 - 13.30 WIB' },
]

function contactIcon(label) {
  const normalizedLabel = label.toLowerCase()
  if (normalizedLabel.includes('alamat')) return '⌖'
  if (normalizedLabel.includes('telepon')) return '⌕'
  if (normalizedLabel.includes('email')) return '✉'
  return '◷'
}

function Kontak() {
  const [contacts, setContacts] = useState(fallbackContacts)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(contactsApiUrl)
      .then((response) => response.ok ? response.json() : null)
      .then((nextContacts) => {
        if (Array.isArray(nextContacts) && nextContacts.length > 0) setContacts(nextContacts)
      })
      .catch(() => {})
  }, [])

  async function submitMessage(event) {
    event.preventDefault()
    setError('')
    try {
      const response = await fetch('https://sdn1turi.my.id/api/messages.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Pesan gagal dikirim.')
      setForm({ name: '', email: '', message: '' })
      setIsSent(true)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return <section className="container page contact-page"><div className="contact-page-heading"><p className="eyebrow">HUBUNGI KAMI</p><h1>Kontak sekolah</h1><p className="lead">Kami siap mendengar pertanyaan, saran, dan kabar baik dari keluarga besar SD Negeri Turi 1.</p></div><div className="contact-layout"><div className="contact-list">{contacts.map((contact) => <article className="contact-card" key={contact.id || contact.label}><span className="contact-card-icon" aria-hidden="true">{contactIcon(contact.label)}</span><div><span className="contact-card-label">{contact.label}</span>{contact.link_url ? <a href={contact.link_url}>{contact.value}</a> : <p>{contact.value}</p>}</div></article>)}</div><form className="contact-form" onSubmit={submitMessage}><p className="eyebrow">PESAN UNTUK SEKOLAH</p><h2>Kirim pesan</h2><label>Nama<input required value={form.name} placeholder="Nama lengkap" onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Email<input required type="email" value={form.email} placeholder="nama@email.com" onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Pesan<textarea required value={form.message} placeholder="Tulis pesan Anda..." onChange={(event) => setForm({ ...form, message: event.target.value })} /></label><button className="button" type="submit">Kirim pesan</button>{isSent && <p className="contact-form-status">Pesan berhasil dikirim.</p>}{error && <p className="contact-form-error">{error}</p>}</form></div></section>
}

export default Kontak
