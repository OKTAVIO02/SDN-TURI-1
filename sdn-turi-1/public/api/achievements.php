<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    requireAdmin();
}

if ($method === 'GET') {
    $query = $pdo->query('SELECT id, title, year, level FROM achievements ORDER BY year DESC, id DESC');
    echo json_encode($query->fetchAll());
    exit;
}

if ($method !== 'POST') {
    if ($method === 'DELETE') {
        $payload = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = (int) ($payload['id'] ?? 0);

        if ($id < 1) {
            http_response_code(422);
            echo json_encode(['error' => 'ID prestasi wajib diisi']);
            exit;
        }

        $statement = $pdo->prepare('DELETE FROM achievements WHERE id = ?');
        $statement->execute([$id]);
        echo json_encode(['deleted' => $statement->rowCount() > 0]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method tidak diizinkan']);
    exit;
}

$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$title = trim($payload['title'] ?? '');
$year = (int) ($payload['year'] ?? 0);
$level = trim($payload['level'] ?? '');
$id = (int) ($payload['id'] ?? 0);

if ($title === '' || $year < 1900 || $level === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Judul, tahun, dan tingkat prestasi wajib diisi']);
    exit;
}

if ($id > 0) {
    $statement = $pdo->prepare('UPDATE achievements SET title = ?, year = ?, level = ? WHERE id = ?');
    $statement->execute([$title, $year, $level, $id]);
} else {
    $statement = $pdo->prepare('INSERT INTO achievements (title, year, level) VALUES (?, ?, ?)');
    $statement->execute([$title, $year, $level]);
    $id = (int) $pdo->lastInsertId();
}

echo json_encode(['id' => $id, 'title' => $title, 'year' => $year, 'level' => $level]);
