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
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    echo json_encode(['success' => false, 'error' => 'INVALID_ID']);
    exit;
}
try {
    $stmt = $pdo->prepare('SELECT id, name, author, json, created_at FROM levels WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $level = $stmt->fetch();
    if (!$level) {
        echo json_encode(['success' => false, 'error' => 'NOT_FOUND']);
        exit;
    }
    echo json_encode(['success' => true, 'level' => $level]);
} catch (Throwable $e) {
    http_response_code(500);
    error_log('levels/get.php error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'DB_ERROR']);
}

