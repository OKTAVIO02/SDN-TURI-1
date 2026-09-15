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
SELECT 'SD Negeri Turi 1', '20401234', 'Jl. Pendidikan No. 1, Turi, Sleman, Yogyakarta', '(0274) 123456', 'info@sdnturi1.sch.id', 'Terwujudnya peserta didik yang berkarakter, berprestasi, dan peduli lingkungan.', 'Menyelenggarakan pembelajaran yang aktif, kreatif, dan menyenangkan.\nMenumbuhkan karakter berdasarkan nilai-nilai Pancasila.\nMengembangkan potensi akademik dan nonakademik setiap peserta didik.', 'SD Negeri Turi 1 hadir sebagai ruang belajar yang dekat dengan keluarga dan masyarakat.', 'Selamat datang di SD Negeri Turi 1. Mari bersama-sama mendampingi anak-anak tumbuh menjadi pribadi yang berkarakter, mandiri, dan berprestasi.'
WHERE NOT EXISTS (SELECT 1 FROM school_profile);

UPDATE school_profile
SET address = 'Jl. Turi No.2, Area Persawahan, Turi, Panekan, Kabupaten Magetan, Jawa Timur 63352'
WHERE name = 'SD Negeri Turi 1';
