<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $query = $pdo->query('SELECT id, category, article_date, title, excerpt, tone FROM articles ORDER BY id DESC');
    echo json_encode($query->fetchAll());
    exit;
}

requireAdmin();
$payload = json_decode(file_get_contents('php://input'), true) ?? [];
$id = (int) ($payload['id'] ?? 0);

if ($method === 'DELETE') {
    if ($id < 1) {
        http_response_code(422);
        echo json_encode(['error' => 'ID artikel wajib diisi']);
        exit;
    }

    $statement = $pdo->prepare('DELETE FROM articles WHERE id = ?');
    $statement->execute([$id]);
    echo json_encode(['deleted' => $statement->rowCount() > 0]);
    exit;
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method tidak diizinkan']);
    exit;
}

$category = trim($payload['category'] ?? '');
$articleDate = trim($payload['article_date'] ?? '');
$title = trim($payload['title'] ?? '');
$excerpt = trim($payload['excerpt'] ?? '');
$tone = trim($payload['tone'] ?? 'mint');

if ($category === '' || $articleDate === '' || $title === '' || $excerpt === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Kategori, tanggal, judul, dan ringkasan wajib diisi']);
    exit;
}

if (!in_array($tone, ['mint', 'yellow', 'coral'], true)) {
    $tone = 'mint';
}

if ($id > 0) {
    $statement = $pdo->prepare('UPDATE articles SET category = ?, article_date = ?, title = ?, excerpt = ?, tone = ? WHERE id = ?');
    $statement->execute([$category, $articleDate, $title, $excerpt, $tone, $id]);
} else {
    $statement = $pdo->prepare('INSERT INTO articles (category, article_date, title, excerpt, tone) VALUES (?, ?, ?, ?, ?)');
    $statement->execute([$category, $articleDate, $title, $excerpt, $tone]);
    $id = (int) $pdo->lastInsertId();
}

echo json_encode(['id' => $id, 'category' => $category, 'article_date' => $articleDate, 'title' => $title, 'excerpt' => $excerpt, 'tone' => $tone]);