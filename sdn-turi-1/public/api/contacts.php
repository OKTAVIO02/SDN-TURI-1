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
    $pdo->exec("CREATE TABLE IF NOT EXISTS contacts (id INT AUTO_INCREMENT PRIMARY KEY, label VARCHAR(100) NOT NULL, value TEXT NOT NULL, link_url VARCHAR(500), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode(['error' => 'Tabel kontak belum siap. Jalankan schema.sql di database hosting.']);
    exit;
}

if ($method === 'GET') {
    $query = $pdo->query('SELECT id, label, value, link_url FROM contacts ORDER BY id ASC');
    echo json_encode($query->fetchAll());
    exit;
}

requireAdmin();
$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$id = (int) ($payload['id'] ?? 0);

if ($method === 'DELETE') {
    if ($id < 1) {
        http_response_code(422);
        echo json_encode(['error' => 'ID kontak wajib diisi']);
        exit;
    }

    $statement = $pdo->prepare('DELETE FROM contacts WHERE id = ?');
    $statement->execute([$id]);
    echo json_encode(['deleted' => $statement->rowCount() > 0]);
    exit;
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method tidak diizinkan']);
    exit;
}

$label = trim($payload['label'] ?? '');
$value = trim($payload['value'] ?? '');
$linkUrl = trim($payload['link_url'] ?? '');

if ($label === '' || $value === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Nama dan isi kontak wajib diisi']);
    exit;
}

if ($id > 0) {
    $statement = $pdo->prepare('UPDATE contacts SET label = ?, value = ?, link_url = ? WHERE id = ?');
    $statement->execute([$label, $value, $linkUrl, $id]);
} else {
    $statement = $pdo->prepare('INSERT INTO contacts (label, value, link_url) VALUES (?, ?, ?)');
    $statement->execute([$label, $value, $linkUrl]);
    $id = (int) $pdo->lastInsertId();
}

echo json_encode(['id' => $id, 'label' => $label, 'value' => $value, 'link_url' => $linkUrl]);
