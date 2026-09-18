<?php

header('Content-Type: application/json; charset=utf-8');

$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5175',
    'http://localhost:5176',
    'http://127.0.0.1:5176',
    'https://sdn1turi.my.id',
];
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
$isLocalOrigin = (bool) preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $requestOrigin);

if ($isLocalOrigin || in_array($requestOrigin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $requestOrigin");
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}

header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS gallery (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT, media_type ENUM('image', 'video') NOT NULL, media_url VARCHAR(500) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode(['error' => 'Tabel galeri belum siap. Jalankan schema.sql di database hosting.']);
    exit;
}

if ($method === 'GET') {
    $query = $pdo->query('SELECT id, title, description, media_type, media_url FROM gallery ORDER BY created_at DESC, id DESC');
    echo json_encode($query->fetchAll());
    exit;
}

requireAdmin();
$payload = str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data') ? $_POST : (json_decode(file_get_contents('php://input'), true) ?? []);
$id = (int) ($payload['id'] ?? 0);

if ($method === 'DELETE') {
    if ($id < 1) {
        http_response_code(422);
        echo json_encode(['error' => 'ID media wajib diisi']);
        exit;
    }

    $existing = $pdo->prepare('SELECT media_url FROM gallery WHERE id = ?');
    $existing->execute([$id]);
    $mediaUrl = (string) ($existing->fetchColumn() ?: '');
    $statement = $pdo->prepare('DELETE FROM gallery WHERE id = ?');
    $statement->execute([$id]);

    if ($statement->rowCount() > 0 && str_starts_with($mediaUrl, '/uploads/gallery/')) {
        $storedFile = __DIR__ . '/..' . $mediaUrl;
        if (is_file($storedFile)) unlink($storedFile);
    }

    echo json_encode(['deleted' => $statement->rowCount() > 0]);
    exit;
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method tidak diizinkan']);
    exit;
}

$title = trim($payload['title'] ?? '');
$description = trim($payload['description'] ?? '');
$mediaUrl = '';
$mediaType = '';

if ($id > 0) {
    $existing = $pdo->prepare('SELECT media_type, media_url FROM gallery WHERE id = ?');
    $existing->execute([$id]);
    $existingMedia = $existing->fetch();
    if (!$existingMedia) {
        http_response_code(404);
        echo json_encode(['error' => 'Media galeri tidak ditemukan']);
        exit;
    }
    $mediaType = $existingMedia['media_type'];
    $mediaUrl = $existingMedia['media_url'];
}

if (!empty($_FILES['media']) && $_FILES['media']['error'] !== UPLOAD_ERR_NO_FILE) {
    $media = $_FILES['media'];
    $allowedTypes = [
        'image/jpeg' => ['extension' => 'jpg', 'type' => 'image'],
        'image/png' => ['extension' => 'png', 'type' => 'image'],
        'image/webp' => ['extension' => 'webp', 'type' => 'image'],
        'video/mp4' => ['extension' => 'mp4', 'type' => 'video'],
        'video/webm' => ['extension' => 'webm', 'type' => 'video'],
        'video/quicktime' => ['extension' => 'mov', 'type' => 'video'],
    ];
    $fileType = mime_content_type($media['tmp_name']);

    if ($media['error'] !== UPLOAD_ERR_OK || !isset($allowedTypes[$fileType])) {
        http_response_code(422);
        echo json_encode(['error' => 'File harus berupa JPG, PNG, WebP, MP4, WebM, atau MOV']);
        exit;
    }

    $isVideo = $allowedTypes[$fileType]['type'] === 'video';
    $maxSize = $isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if ($media['size'] > $maxSize) {
        http_response_code(422);
        echo json_encode(['error' => $isVideo ? 'Video maksimal berukuran 50 MB' : 'Foto maksimal berukuran 5 MB']);
        exit;
    }

    $uploadDirectory = __DIR__ . '/../uploads/gallery';
    if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Folder upload galeri tidak dapat dibuat']);
        exit;
    }

    $filename = 'gallery-' . bin2hex(random_bytes(8)) . '.' . $allowedTypes[$fileType]['extension'];
    if (!move_uploaded_file($media['tmp_name'], $uploadDirectory . '/' . $filename)) {
        http_response_code(500);
        echo json_encode(['error' => 'File galeri gagal disimpan ke server']);
        exit;
    }

    if ($mediaUrl !== '' && str_starts_with($mediaUrl, '/uploads/gallery/')) {
        $oldFile = __DIR__ . '/..' . $mediaUrl;
        if (is_file($oldFile)) unlink($oldFile);
    }
    $mediaType = $allowedTypes[$fileType]['type'];
    $mediaUrl = '/uploads/gallery/' . $filename;
}

if ($title === '' || $mediaUrl === '' || $mediaType === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Judul dan file galeri wajib diisi']);
    exit;
}

if ($id > 0) {
    $statement = $pdo->prepare('UPDATE gallery SET title = ?, description = ?, media_type = ?, media_url = ? WHERE id = ?');
    $statement->execute([$title, $description, $mediaType, $mediaUrl, $id]);
} else {
    $statement = $pdo->prepare('INSERT INTO gallery (title, description, media_type, media_url) VALUES (?, ?, ?, ?)');
    $statement->execute([$title, $description, $mediaType, $mediaUrl]);
    $id = (int) $pdo->lastInsertId();
}

echo json_encode(['id' => $id, 'title' => $title, 'description' => $description, 'media_type' => $mediaType, 'media_url' => $mediaUrl]);
