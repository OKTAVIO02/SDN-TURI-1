<?php

$isSecureRequest = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $isSecureRequest,
    'httponly' => true,
    'samesite' => $isSecureRequest ? 'None' : 'Lax',
]);
session_start();

$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5175',
    'http://localhost:5176',
    'http://127.0.0.1:5176',
    'https://sdn1turi.my.id',
];
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
$isLocalOrigin = (bool) preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $requestOrigin);

if ($isLocalOrigin || in_array($requestOrigin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $requestOrigin");
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}

header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function requireAdmin(): void
{
    global $requestOrigin, $allowedOrigins, $isLocalOrigin;

    if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'DELETE'], true) && $requestOrigin !== '' && !$isLocalOrigin && !in_array($requestOrigin, $allowedOrigins, true)) {
        http_response_code(403);
        echo json_encode(['error' => 'Origin request tidak diizinkan']);
        exit;
    }

    if (empty($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Autentikasi diperlukan']);
        exit;
    }
}
