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
    $pdo->exec("CREATE TABLE IF NOT EXISTS contact_messages (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(150) NOT NULL, email VARCHAR(180) NOT NULL, message TEXT NOT NULL, is_read TINYINT(1) NOT NULL DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode(['error' => 'Tabel pesan belum siap. Jalankan schema.sql di database hosting.']);
    exit;
}

if ($method === 'POST') {
    $payload = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($payload['name'] ?? '');
    $email = trim($payload['email'] ?? '');
    $message = trim($payload['message'] ?? '');

    if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(422);
        echo json_encode(['error' => 'Nama, email valid, dan pesan wajib diisi']);
        exit;
    }

    $statement = $pdo->prepare('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)');
    $statement->execute([$name, $email, $message]);
    echo json_encode(['id' => (int) $pdo->lastInsertId(), 'message' => 'Pesan berhasil dikirim']);
    exit;
}

requireAdmin();

if ($method === 'GET') {
    $query = $pdo->query('SELECT id, name, email, message, is_read, created_at FROM contact_messages ORDER BY created_at DESC, id DESC');
    echo json_encode($query->fetchAll());
    exit;
}

if ($method === 'DELETE') {
    $payload = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = (int) ($payload['id'] ?? 0);
    if ($id < 1) {
        http_response_code(422);
        echo json_encode(['error' => 'ID pesan wajib diisi']);
        exit;
    }

    $statement = $pdo->prepare('DELETE FROM contact_messages WHERE id = ?');
    $statement->execute([$id]);
    echo json_encode(['deleted' => $statement->rowCount() > 0]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method tidak diizinkan']);
