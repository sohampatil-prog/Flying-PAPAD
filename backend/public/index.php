<?php

/**
 * index.php — Single Entry Point (Front Controller pattern)
 *
 * PHP Concept: All requests go through ONE file.
 * Apache/Nginx rewrites all URLs to this file via .htaccess.
 * We then parse the URL path and dispatch to the correct Controller.
 *
 * This is exactly what Laravel's public/index.php does under the hood.
 */

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

// Load .env manually (no external library needed for this small project)
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        [$key, $value] = array_map('trim', explode('=', $line, 2));
        $_ENV[$key] = $value;
        putenv("{$key}={$value}");
    }
}

use PapadUdd\Controllers\ScoreController;

// Handle CORS preflight (OPTIONS request from browser)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

// Simple router — parse the URI path
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = rtrim($uri, '/');
$method = $_SERVER['REQUEST_METHOD'];

$controller = new ScoreController();

// Route: POST /api/scores
if ($uri === '/api/scores' && $method === 'POST') {
    $controller->store();

// Route: GET /api/scores
} elseif ($uri === '/api/scores' && $method === 'GET') {
    $controller->index();

// Route: GET /api/scores/best
} elseif ($uri === '/api/scores/best' && $method === 'GET') {
    $controller->personalBest();

} else {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Route not found']);
}
