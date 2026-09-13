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

ALTER TABLE facilities
  ADD COLUMN condition_label VARCHAR(80) NOT NULL DEFAULT 'Baik',
  ADD COLUMN is_featured TINYINT(1) NOT NULL DEFAULT 0;

INSERT INTO school_profile (name, npsn, address, phone, email, vision, mission, history, principal_welcome)
SELECT 'SD Negeri Turi 1', '20401234', 'Jl. Pendidikan No. 1, Turi, Sleman, Yogyakarta', '(0274) 123456', 'info@sdnturi1.sch.id', 'Terwujudnya peserta didik yang berkarakter, berprestasi, dan peduli lingkungan.', 'Menyelenggarakan pembelajaran yang aktif, kreatif, dan menyenangkan.\nMenumbuhkan karakter berdasarkan nilai-nilai Pancasila.\nMengembangkan potensi akademik dan nonakademik setiap peserta didik.', 'SD Negeri Turi 1 hadir sebagai ruang belajar yang dekat dengan keluarga dan masyarakat.', 'Selamat datang di SD Negeri Turi 1. Mari bersama-sama mendampingi anak-anak tumbuh menjadi pribadi yang berkarakter, mandiri, dan berprestasi.'
WHERE NOT EXISTS (SELECT 1 FROM school_profile);
