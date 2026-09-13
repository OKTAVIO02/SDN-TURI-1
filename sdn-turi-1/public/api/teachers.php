<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $query = $pdo->query('SELECT id, name, role, subject FROM teachers ORDER BY id ASC');
    echo json_encode($query->fetchAll());
    exit;
}

$payload = json_decode(file_get_contents('php://input'), true) ?? [];
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

if ($name === '' || $role === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Nama dan jabatan guru wajib diisi']);
    exit;
}

if ($id > 0) {
    $statement = $pdo->prepare('UPDATE teachers SET name = ?, role = ?, subject = ? WHERE id = ?');
    $statement->execute([$name, $role, $subject, $id]);
} else {
    $statement = $pdo->prepare('INSERT INTO teachers (name, role, subject) VALUES (?, ?, ?)');
    $statement->execute([$name, $role, $subject]);
    $id = (int) $pdo->lastInsertId();
}

echo json_encode(['id' => $id, 'name' => $name, 'role' => $role, 'subject' => $subject]);
