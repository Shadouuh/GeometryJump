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
$input = json_decode(file_get_contents('php://input'), true) ?: [];
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';
if ($username === '' || $password === '') {
    echo json_encode(['success' => false, 'error' => 'Campos incompletos']);
    exit;
}
$stmt = $pdo->prepare('SELECT id, username, email, password FROM users WHERE username = ? OR email = ? LIMIT 1');
$stmt->execute([$username, $username]);
$user = $stmt->fetch();
if (!$user) {
    echo json_encode(['success' => false, 'error' => 'Usuario no encontrado']);
    exit;
}
if (!password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'error' => 'Credenciales inválidas']);
    exit;
}
echo json_encode(['success' => true, 'user' => ['id' => (int)$user['id'], 'username' => $user['username'], 'email' => $user['email']]]);
