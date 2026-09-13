<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    requireAdmin();
}

if ($method === 'GET') {
    $query = $pdo->query('SELECT id, name, description FROM extracurriculars ORDER BY id ASC');
    echo json_encode($query->fetchAll());
    exit;
}

if ($method !== 'POST') {
    if ($method === 'DELETE') {
        $payload = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = (int) ($payload['id'] ?? 0);

        if ($id < 1) {
            http_response_code(422);
            echo json_encode(['error' => 'ID kegiatan wajib diisi']);
            exit;
        }

        $statement = $pdo->prepare('DELETE FROM extracurriculars WHERE id = ?');
        $statement->execute([$id]);
        echo json_encode(['deleted' => $statement->rowCount() > 0]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method tidak diizinkan']);
    exit;
}

$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$name = trim($payload['name'] ?? '');
$description = trim($payload['description'] ?? '');
$id = (int) ($payload['id'] ?? 0);

if ($name === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Nama kegiatan wajib diisi']);
    exit;
}

if ($id > 0) {
    $statement = $pdo->prepare('UPDATE extracurriculars SET name = ?, description = ? WHERE id = ?');
    $statement->execute([$name, $description, $id]);
} else {
    $statement = $pdo->prepare('INSERT INTO extracurriculars (name, description) VALUES (?, ?)');
    $statement->execute([$name, $description]);
    $id = (int) $pdo->lastInsertId();
}

echo json_encode(['id' => $id, 'name' => $name, 'description' => $description]);
