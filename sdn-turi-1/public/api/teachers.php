<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/config.php';

$query = $pdo->query(
    'SELECT id, name, role, subject FROM teachers ORDER BY id ASC'
);

echo json_encode($query->fetchAll());
