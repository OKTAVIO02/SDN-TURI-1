<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $query = $pdo->query('SELECT id, name, npsn, address, phone, email, vision, mission, history, principal_welcome FROM school_profile ORDER BY id ASC LIMIT 1');
    $profile = $query->fetch();
    echo json_encode($profile ?: null);
    exit;
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method tidak diizinkan']);
    exit;
}

requireAdmin();

$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$id = (int) ($payload['id'] ?? 0);
$fields = ['name', 'npsn', 'address', 'phone', 'email', 'vision', 'mission', 'history', 'principal_welcome'];
$values = [];

foreach ($fields as $field) {
    $values[$field] = trim($payload[$field] ?? '');
}

if ($values['name'] === '' || $values['npsn'] === '' || $values['address'] === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Nama sekolah, NPSN, dan alamat wajib diisi']);
    exit;
}

if ($id > 0) {
    $statement = $pdo->prepare('UPDATE school_profile SET name = ?, npsn = ?, address = ?, phone = ?, email = ?, vision = ?, mission = ?, history = ?, principal_welcome = ? WHERE id = ?');
    $statement->execute([...array_values($values), $id]);
} else {
    $statement = $pdo->prepare('INSERT INTO school_profile (name, npsn, address, phone, email, vision, mission, history, principal_welcome) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $statement->execute(array_values($values));
    $id = (int) $pdo->lastInsertId();
}

echo json_encode(['id' => $id, ...$values]);
