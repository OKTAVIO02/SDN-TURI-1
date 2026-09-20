CREATE TABLE IF NOT EXISTS school_profile (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  npsn VARCHAR(30) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(60),
  email VARCHAR(180),
  vision TEXT,
  mission TEXT,
  history TEXT,
  principal_welcome TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE teachers
  ADD COLUMN photo_url TEXT NULL;

ALTER TABLE facilities
  ADD COLUMN condition_label VARCHAR(80) NOT NULL DEFAULT 'Baik',
  ADD COLUMN is_featured TINYINT(1) NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  year YEAR NOT NULL,
  level VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  article_date VARCHAR(60) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  tone ENUM('mint', 'yellow', 'coral') NOT NULL DEFAULT 'mint',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_type ENUM('image', 'video') NOT NULL,
  media_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  value TEXT NOT NULL,
  link_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO articles (category, article_date, title, excerpt, tone)
SELECT 'Kabar sekolah', '12 Juni 2024', 'Belajar dari lingkungan sekitar lewat Taman Belajar', 'Ruang terbuka sekolah menjadi tempat anak mengamati, berdiskusi, dan menemukan cara baru untuk belajar bersama.', 'mint'
WHERE NOT EXISTS (SELECT 1 FROM articles);

INSERT INTO articles (category, article_date, title, excerpt, tone)
SELECT 'Kegiatan siswa', '28 Mei 2024', 'Menumbuhkan percaya diri lewat kegiatan seni', 'Seni tari dan musik membuka ruang bagi siswa untuk berani tampil, menghargai proses, dan merayakan keberagaman bakat.', 'yellow'
WHERE (SELECT COUNT(*) FROM articles) = 1;

INSERT INTO articles (category, article_date, title, excerpt, tone)
SELECT 'Praktik baik', '08 Mei 2024', 'Kebiasaan kecil untuk sekolah yang lebih peduli', 'Dari memilah sampah sampai merawat tanaman, kepedulian tumbuh lewat kebiasaan yang dilakukan bersama setiap hari.', 'coral'
WHERE (SELECT COUNT(*) FROM articles) = 2;

INSERT INTO school_profile (name, npsn, address, phone, email, vision, mission, history, principal_welcome)
SELECT 'SD Negeri Turi 1', '20401234', 'Jl. Turi No.2, Area Persawahan, Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352', '+6285259805345', 'sdturi1panekan@gmail.com', 'Terwujudnya peserta didik yang berkarakter, berprestasi, dan peduli lingkungan.', 'Menyelenggarakan pembelajaran yang aktif, kreatif, dan menyenangkan.\nMenumbuhkan karakter berdasarkan nilai-nilai Pancasila.\nMengembangkan potensi akademik dan nonakademik setiap peserta didik.', 'Ditinjau dari letak geografis, Desa Turi khususnya di SD Negeri Turi 1 dekat dengan pegunungan. Letak geografis tersebut membentuk latar belakang sosial yang beragam. Masyarakat yang tinggal dekat persawahan mayoritas memiliki mata pencaharian sebagai petani, sedangkan masyarakat yang tinggal di pusat kecamatan sebagian besar bekerja di kantor swasta atau pemerintahan. Kondisi ini membentuk karakteristik murid yang beragam, baik dalam kemampuan kognitif maupun psikomotor. Mayoritas murid beragama Islam, namun tetap menghargai keragaman agama dan keyakinan. Desa Turi memiliki latar sosial budaya yang beragam dan diperkaya kebudayaan yang melekat sejak dahulu, termasuk banyaknya pondok pesantren yang menjadi kearifan lokal Kabupaten Magetan. Keragaman budaya serta letak geografis tersebut juga dapat menarik wisatawan asing untuk datang ke Desa Turi.', 'Selamat datang di SD Negeri Turi 1. Mari bersama-sama mendampingi anak-anak tumbuh menjadi pribadi yang berkarakter, mandiri, dan berprestasi.'
WHERE NOT EXISTS (SELECT 1 FROM school_profile);

UPDATE school_profile
SET address = 'Jl. Turi No.2, Area Persawahan, Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352',
    phone = '+6285259805345',
    email = 'sdturi1panekan@gmail.com'
WHERE name = 'SD Negeri Turi 1';

INSERT INTO contacts (label, value, link_url)
SELECT 'Telepon', '+6285259805345', 'tel:+6285259805345'
WHERE NOT EXISTS (SELECT 1 FROM contacts WHERE label = 'Telepon');

INSERT INTO contacts (label, value, link_url)
SELECT 'Email', 'sdturi1panekan@gmail.com', 'mailto:sdturi1panekan@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM contacts WHERE label = 'Email');

INSERT INTO contacts (label, value, link_url)
SELECT 'Instagram', '@sdturi1panekan', 'https://instagram.com/sdturi1panekan'
WHERE NOT EXISTS (SELECT 1 FROM contacts WHERE label = 'Instagram');

INSERT INTO contacts (label, value, link_url)
SELECT 'Facebook', 'sdturi1panekan', 'https://facebook.com/sdturi1panekan'
WHERE NOT EXISTS (SELECT 1 FROM contacts WHERE label = 'Facebook');

UPDATE contacts
SET value = '+6285259805345', link_url = 'tel:+6285259805345'
WHERE label = 'Telepon';

UPDATE contacts
SET value = 'sdturi1panekan@gmail.com', link_url = 'mailto:sdturi1panekan@gmail.com'
WHERE label = 'Email';

UPDATE contacts
SET value = '@sdturi1panekan', link_url = 'https://instagram.com/sdturi1panekan'
WHERE label = 'Instagram';

UPDATE contacts
SET value = 'sdturi1panekan', link_url = 'https://facebook.com/sdturi1panekan'
WHERE label = 'Facebook';