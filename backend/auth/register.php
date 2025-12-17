<?php
header('Content-Type: application/json');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
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
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
if ($username === '' || $email === '' || $password === '') {
    echo json_encode(['success' => false, 'error' => 'Campos incompletos']);
    exit;
}
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'error' => 'La contraseña debe tener al menos 6 caracteres']);
    exit;
}
$stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1');
$stmt->execute([$username, $email]);
$existing = $stmt->fetch();
if ($existing) {
    echo json_encode(['success' => false, 'error' => 'Usuario o email ya existe']);
    exit;
}
$hash = password_hash($password, PASSWORD_BCRYPT);
$stmt = $pdo->prepare('INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())');
$stmt->execute([$username, $email, $hash]);
$id = (int)$pdo->lastInsertId();
echo json_encode(['success' => true, 'user' => ['id' => $id, 'username' => $username, 'email' => $email]]);
