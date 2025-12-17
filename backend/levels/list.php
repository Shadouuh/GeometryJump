<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
require_once __DIR__ . '/../db.php';
try {
    $stmt = $pdo->query('SELECT id, name, author, created_at FROM levels ORDER BY created_at DESC');
    $levels = $stmt->fetchAll();
    echo json_encode(['success' => true, 'levels' => $levels]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'DB_ERROR']);
}

