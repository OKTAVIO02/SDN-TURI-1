<?php

header('Content-Type: application/json; charset=utf-8');

try {
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/auth.php';
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode(['error' => 'Konfigurasi database belum benar di hosting.']);
    exit;
}

$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$username = trim($payload['username'] ?? '');
$password = $payload['password'] ?? '';
$now = time();
$attemptWindow = 10 * 60;
$attempts = $_SESSION['login_attempts'] ?? ['started_at' => $now, 'count' => 0];

if (($now - (int) ($attempts['started_at'] ?? $now)) > $attemptWindow) {
    $attempts = ['started_at' => $now, 'count' => 0];
}

if ((int) ($attempts['count'] ?? 0) >= 5) {
    http_response_code(429);
    echo json_encode(['error' => 'Terlalu banyak percobaan login. Coba lagi dalam 10 menit.']);
    exit;
}

if ($username === '' || $password === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Username dan password wajib diisi']);
    exit;
}

try {
    $statement = $pdo->prepare('SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1');
    $statement->execute([$username]);
    $admin = $statement->fetch();
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode(['error' => 'Tabel admins atau koneksi database belum siap.']);
    exit;
}

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    $_SESSION['login_attempts'] = [
        'started_at' => (int) $attempts['started_at'],
        'count' => (int) $attempts['count'] + 1,
    ];
    http_response_code(401);
    echo json_encode(['error' => 'Username atau password salah']);
    exit;
}

unset($_SESSION['login_attempts']);
session_regenerate_id(true);
$_SESSION['admin_id'] = (int) $admin['id'];
$_SESSION['admin_username'] = $admin['username'];

echo json_encode(['authenticated' => true, 'username' => $admin['username']]);
