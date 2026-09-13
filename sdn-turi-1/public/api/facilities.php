<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$hasMetadataColumns = (bool) $pdo->query("SHOW COLUMNS FROM facilities LIKE 'condition_label'")->fetch();

if ($method === 'GET') {
    $columns = $hasMetadataColumns ? 'id, name, description, condition_label, is_featured' : "id, name, description, 'Baik' AS condition_label, 0 AS is_featured";
    $query = $pdo->query("SELECT $columns FROM facilities ORDER BY id DESC");
    echo json_encode($query->fetchAll());
    exit;
}

$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$id = (int) ($payload['id'] ?? 0);

requireAdmin();

if ($method === 'DELETE') {
    if ($id < 1) {
        http_response_code(422);
        echo json_encode(['error' => 'ID fasilitas wajib diisi']);
        exit;
    }

    $statement = $pdo->prepare('DELETE FROM facilities WHERE id = ?');
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
$description = trim($payload['description'] ?? '');
$conditionLabel = trim($payload['condition_label'] ?? 'Baik');
$isFeatured = !empty($payload['is_featured']) ? 1 : 0;

if ($name === '' || $description === '' || $conditionLabel === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Nama dan deskripsi fasilitas wajib diisi']);
    exit;
}

if ($id > 0) {
    if ($hasMetadataColumns) {
        $statement = $pdo->prepare('UPDATE facilities SET name = ?, description = ?, condition_label = ?, is_featured = ? WHERE id = ?');
        $statement->execute([$name, $description, $conditionLabel, $isFeatured, $id]);
    } else {
        $statement = $pdo->prepare('UPDATE facilities SET name = ?, description = ? WHERE id = ?');
        $statement->execute([$name, $description, $id]);
    }
} else {
    if ($hasMetadataColumns) {
        $statement = $pdo->prepare('INSERT INTO facilities (name, description, condition_label, is_featured) VALUES (?, ?, ?, ?)');
        $statement->execute([$name, $description, $conditionLabel, $isFeatured]);
    } else {
        $statement = $pdo->prepare('INSERT INTO facilities (name, description) VALUES (?, ?)');
        $statement->execute([$name, $description]);
    }
    $id = (int) $pdo->lastInsertId();
}

echo json_encode(['id' => $id, 'name' => $name, 'description' => $description, 'condition_label' => $conditionLabel, 'is_featured' => $isFeatured]);
