<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$hasPhotoColumn = (bool) $pdo->query("SHOW COLUMNS FROM teachers LIKE 'photo_url'")->fetch();

if (!$hasPhotoColumn && $method !== 'GET') {
    try {
        $pdo->exec('ALTER TABLE teachers ADD COLUMN photo_url TEXT NULL');
        $hasPhotoColumn = true;
    } catch (Throwable $error) {
        http_response_code(500);
        echo json_encode(['error' => 'Kolom foto guru belum tersedia. Jalankan ALTER TABLE teachers ADD COLUMN photo_url TEXT NULL di database.']);
        exit;
    }
}

if ($method === 'GET') {
    $columns = $hasPhotoColumn ? 'id, name, role, subject, photo_url' : "id, name, role, subject, '' AS photo_url";
    $query = $pdo->query("SELECT $columns FROM teachers ORDER BY id ASC");
    echo json_encode($query->fetchAll());
    exit;
}

$payload = str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data') ? $_POST : (json_decode(file_get_contents('php://input'), true) ?? []);
$id = (int) ($payload['id'] ?? 0);

requireAdmin();

if ($method === 'DELETE') {
    if ($id < 1) {
        http_response_code(422);
        echo json_encode(['error' => 'ID guru wajib diisi']);
        exit;
    }

    $statement = $pdo->prepare('DELETE FROM teachers WHERE id = ?');
    $statement->execute([$id]);
    echo json_encode(['deleted' => $statement->rowCount() > 0]);
    exit;
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method tidak diizinkan']);
    exit;
}

$name = trim($payload['name'] ?? '');
$role = trim($payload['role'] ?? '');
$subject = trim($payload['subject'] ?? '');
$photoUrl = trim($payload['photo_url'] ?? '');

if ($id > 0 && $hasPhotoColumn && $photoUrl === '') {
    $existing = $pdo->prepare('SELECT photo_url FROM teachers WHERE id = ?');
    $existing->execute([$id]);
    $photoUrl = (string) ($existing->fetchColumn() ?: '');
}

if (!empty($_FILES['photo']) && $_FILES['photo']['error'] !== UPLOAD_ERR_NO_FILE) {
    $photo = $_FILES['photo'];
    $allowedTypes = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    $fileType = mime_content_type($photo['tmp_name']);

    if ($photo['error'] !== UPLOAD_ERR_OK || !isset($allowedTypes[$fileType]) || $photo['size'] > 5 * 1024 * 1024) {
        http_response_code(422);
        echo json_encode(['error' => 'Foto harus JPG, PNG, atau WebP dengan ukuran maksimal 5 MB']);
        exit;
    }

    $uploadDirectory = __DIR__ . '/../uploads/teachers';
    if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Folder upload foto guru tidak dapat dibuat']);
        exit;
    }

    $filename = 'teacher-' . bin2hex(random_bytes(8)) . '.' . $allowedTypes[$fileType];
    if (!move_uploaded_file($photo['tmp_name'], $uploadDirectory . '/' . $filename)) {
        http_response_code(500);
        echo json_encode(['error' => 'Foto guru gagal disimpan ke server']);
        exit;
    }

    $photoUrl = '/uploads/teachers/' . $filename;
}

if ($name === '' || $role === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Nama dan jabatan guru wajib diisi']);
    exit;
}

if ($id > 0) {
    if ($hasPhotoColumn) {
        $statement = $pdo->prepare('UPDATE teachers SET name = ?, role = ?, subject = ?, photo_url = ? WHERE id = ?');
        $statement->execute([$name, $role, $subject, $photoUrl, $id]);
    } else {
        $statement = $pdo->prepare('UPDATE teachers SET name = ?, role = ?, subject = ? WHERE id = ?');
        $statement->execute([$name, $role, $subject, $id]);
    }
} else {
    if ($hasPhotoColumn) {
        $statement = $pdo->prepare('INSERT INTO teachers (name, role, subject, photo_url) VALUES (?, ?, ?, ?)');
        $statement->execute([$name, $role, $subject, $photoUrl]);
    } else {
        $statement = $pdo->prepare('INSERT INTO teachers (name, role, subject) VALUES (?, ?, ?)');
        $statement->execute([$name, $role, $subject]);
    }
    $id = (int) $pdo->lastInsertId();
}

echo json_encode(['id' => $id, 'name' => $name, 'role' => $role, 'subject' => $subject, 'photo_url' => $photoUrl]);
