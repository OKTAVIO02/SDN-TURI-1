<?php

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/auth.php';

echo json_encode([
    'authenticated' => !empty($_SESSION['admin_id']),
    'username' => $_SESSION['admin_username'] ?? null,
]);
