<?php
require_once __DIR__ . '/../config/config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

$filename = isset($_GET['filename']) ? $_GET['filename'] : null;

if (!$filename) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Filename is required']);
    exit;
}

$filename = basename($filename);
$filepath = UPLOADS_PATH . $filename;

if (!file_exists($filepath)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Font not found']);
    exit;
}

header('Content-Type: font/ttf');
header('Content-Length: ' . filesize($filepath));

readfile($filepath);
exit;