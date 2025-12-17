<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
require_once __DIR__ . '/../db.php';
$inputRaw = file_get_contents('php://input');
$input = json_decode($inputRaw, true);
if (!is_array($input)) {
    echo json_encode(['success' => false, 'error' => 'INVALID_JSON']);
    exit;
}
$name = trim($input['name'] ?? '');
$author = trim($input['author'] ?? '');
$json = $input['json'] ?? '';
$userId = isset($input['user_id']) ? (int)$input['user_id'] : null;
if ($name === '' || $json === '') {
    echo json_encode(['success' => false, 'error' => 'MISSING_FIELDS']);
    exit;
}
if ($author === '') {
    $author = 'Anónimo';
}
try {
    $stmt = $pdo->prepare('INSERT INTO levels (user_id, name, author, json, created_at) VALUES (?, ?, ?, ?, NOW())');
    $stmt->execute([$userId, $name, $author, $json]);
    $id = (int)$pdo->lastInsertId();
    echo json_encode(['success' => true, 'level' => ['id' => $id, 'name' => $name, 'author' => $author]]);
} catch (Throwable $e) {
    http_response_code(500);
    error_log('levels/save.php error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'DB_ERROR']);
}
