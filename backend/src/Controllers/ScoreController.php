<?php

namespace PapadUdd\Controllers;

use PapadUdd\Models\Score;

/**
 * ScoreController
 *
 * PHP Concepts:
 *  - MVC: Controller receives HTTP request → calls Model → sends JSON response
 *  - HTTP methods: GET vs POST
 *  - php://input for reading JSON request body (Next.js sends JSON, not form data)
 *  - Proper HTTP status codes (201 Created, 400 Bad Request, 405 Method Not Allowed)
 */
class ScoreController
{
    private Score $scoreModel;

    public function __construct()
    {
        $this->scoreModel = new Score();
    }

    /**
     * POST /api/scores — save a new score
     * Body: { "player_name": "Soham", "score": 42, "papad_type": "fried" }
     */
    public function store(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->jsonResponse(['error' => 'Method not allowed'], 405);
            return;
        }

        // Read raw JSON body — Next.js fetch() sends JSON, not form-encoded data
        $body = file_get_contents('php://input');
        $data = json_decode($body, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->jsonResponse(['error' => 'Invalid JSON body'], 400);
            return;
        }

        $playerName = $data['player_name'] ?? '';
        $score      = isset($data['score']) ? (int) $data['score'] : -1;
        $papadType  = $data['papad_type'] ?? '';

        try {
            $id = $this->scoreModel->save($playerName, $score, $papadType);
            $this->jsonResponse([
                'success' => true,
                'id'      => $id,
                'message' => 'Score saved! Ek baar aur kheliyo 🫓',
            ], 201);
        } catch (\InvalidArgumentException $e) {
            $this->jsonResponse(['error' => $e->getMessage()], 400);
        } catch (\Exception $e) {
            // Log internally, never expose DB errors to client
            error_log('[PapadUdd] Score save error: ' . $e->getMessage());
            $this->jsonResponse(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * GET /api/scores — fetch leaderboard
     * Optional query param: ?limit=10
     */
    public function index(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->jsonResponse(['error' => 'Method not allowed'], 405);
            return;
        }

        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;

        try {
            $scores = $this->scoreModel->getTopScores($limit);
            $this->jsonResponse([
                'success' => true,
                'scores'  => $scores,
            ]);
        } catch (\Exception $e) {
            error_log('[PapadUdd] Scores fetch error: ' . $e->getMessage());
            $this->jsonResponse(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * GET /api/scores/best?name=Soham — personal best
     */
    public function personalBest(): void
    {
        $playerName = $_GET['name'] ?? '';

        try {
            $best = $this->scoreModel->getPersonalBest($playerName);
            $this->jsonResponse([
                'success' => true,
                'best'    => $best,
            ]);
        } catch (\Exception $e) {
            $this->jsonResponse(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * PHP Concept: Helper method — DRY (Don't Repeat Yourself).
     * Sets headers and encodes the response as JSON.
     */
    private function jsonResponse(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: http://localhost:3000'); // Next.js dev server
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        echo json_encode($data);
    }
}
