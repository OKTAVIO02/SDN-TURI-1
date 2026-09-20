<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

// Keep older deployments compatible with the current article fields.
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        article_date VARCHAR(60) NOT NULL,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT NOT NULL,
        tone VARCHAR(20) NOT NULL DEFAULT 'mint',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    $toneColumn = $pdo->query("SHOW COLUMNS FROM articles LIKE 'tone'")->fetch();
    if (!$toneColumn) {
        $pdo->exec("ALTER TABLE articles ADD COLUMN tone VARCHAR(20) NOT NULL DEFAULT 'mint'");
    }
} catch (Throwable $error) {
    if ($method === 'GET') {
        echo json_encode([]);
        exit;
    }
}

if ($method === 'GET') {
    try {
        $query = $pdo->query('SELECT id, category, article_date, title, excerpt, tone FROM articles ORDER BY id DESC');
    } catch (Throwable $error) {
        $query = $pdo->query("SELECT id, category, article_date, title, excerpt, 'mint' AS tone FROM articles ORDER BY id DESC");
    }

    $articles = $query->fetchAll();
    if (empty($articles)) {
        $fallbackArticles = [
            [
                'id' => 1,
                'category' => 'Seni & Literasi',
                'article_date' => '21 Sep 2026',
                'title' => 'Siswa SD Negeri Turi 1 Panekan Raih Prestasi di Bidang Seni dan Literasi',
                'excerpt' => 'Keberanian siswa tampil di depan umum menjadi bukti bahwa bakat dan semangat belajar tumbuh sejak dini di SD Negeri Turi 1 Panekan.',
                'tone' => 'mint',
            ],
            [
                'id' => 2,
                'category' => 'Olahraga',
                'article_date' => '21 Sep 2026',
                'title' => 'Semangat Bertanding, Siswa SD Negeri Turi 1 Panekan Ukir Prestasi di Bidang Olahraga',
                'excerpt' => 'Konsentrasi, strategi, dan semangat juang siswa SD Negeri Turi 1 Panekan terlihat jelas dalam prestasi catur dan atletik tingkat kecamatan.',
                'tone' => 'yellow',
            ],
            [
                'id' => 3,
                'category' => 'Cerdas Cermat PAI',
                'article_date' => '21 Sep 2026',
                'title' => 'Tim Cerdas Cermat PAI SD Negeri Turi 1 Panekan Raih Juara 2',
                'excerpt' => 'Kerja sama tim, semangat belajar, dan persiapan matang menjadi kunci keberhasilan tim cerdas cermat PAI SD Negeri Turi 1 Panekan.',
                'tone' => 'coral',
            ],
        ];
        echo json_encode($fallbackArticles);
        exit;
    }

    echo json_encode($articles);
    exit;
}

requireAdmin();
$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$id = (int) ($payload['id'] ?? 0);

if ($method === 'DELETE') {
    if ($id < 1) {
        http_response_code(422);
        echo json_encode(['error' => 'ID artikel wajib diisi']);
        exit;
    }

    $statement = $pdo->prepare('DELETE FROM articles WHERE id = ?');
    $statement->execute([$id]);
    echo json_encode(['deleted' => $statement->rowCount() > 0]);
    exit;
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method tidak diizinkan']);
    exit;
}

$category = trim($payload['category'] ?? '');
$articleDate = trim($payload['article_date'] ?? '');
$title = trim($payload['title'] ?? '');
$excerpt = trim($payload['excerpt'] ?? '');
$tone = trim($payload['tone'] ?? 'mint');

if ($category === '' || $articleDate === '' || $title === '' || $excerpt === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Kategori, tanggal, judul, dan ringkasan wajib diisi']);
    exit;
}

if (!in_array($tone, ['mint', 'yellow', 'coral'], true)) {
    $tone = 'mint';
}

if ($id > 0) {
    $statement = $pdo->prepare('UPDATE articles SET category = ?, article_date = ?, title = ?, excerpt = ?, tone = ? WHERE id = ?');
    $statement->execute([$category, $articleDate, $title, $excerpt, $tone, $id]);
} else {
    $statement = $pdo->prepare('INSERT INTO articles (category, article_date, title, excerpt, tone) VALUES (?, ?, ?, ?, ?)');
    $statement->execute([$category, $articleDate, $title, $excerpt, $tone]);
    $id = (int) $pdo->lastInsertId();
}

echo json_encode(['id' => $id, 'category' => $category, 'article_date' => $articleDate, 'title' => $title, 'excerpt' => $excerpt, 'tone' => $tone]);