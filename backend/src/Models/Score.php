<?php

namespace PapadUdd\Models;

use PapadUdd\Database\Connection;
use PDO;

/**
 * Score Model
 *
 * PHP Concepts covered here:
 *  - OOP: class, properties, constructor, typed parameters
 *  - PDO: prepared statements (NEVER interpolate user data into SQL)
 *  - Data validation inside the model
 *  - Return types + nullable types (?array)
 */
class Score
{
    private PDO $db;

    // PHP 8 Constructor Property Promotion would also work here,
    // but we're being explicit for learning purposes.
    public function __construct()
    {
        $this->db = Connection::getInstance()->getPdo();
    }

    /**
     * Save a new score to the database.
     *
     * PDO Concept: We use a named placeholder (:player_name, :score, :papad_type)
     * instead of string interpolation — this is a PREPARED STATEMENT.
     * The DB driver separates the SQL structure from the data, so a player
     * cannot inject SQL through their name.
     *
     * @throws \InvalidArgumentException if data is invalid
     */
    public function save(string $playerName, int $score, string $papadType): int
    {
        // Validation — always sanitise before touching the DB
        $playerName = trim($playerName);
        if (empty($playerName) || strlen($playerName) > 50) {
            throw new \InvalidArgumentException('Player name must be 1–50 characters.');
        }

        $allowed = ['raw', 'fried', 'baked'];
        if (!in_array($papadType, $allowed, true)) {
            throw new \InvalidArgumentException('Invalid papad type.');
        }

        if ($score < 0 || $score > 999999) {
            throw new \InvalidArgumentException('Score out of valid range.');
        }

        $sql = "INSERT INTO scores (player_name, score, papad_type, played_at)
                VALUES (:player_name, :score, :papad_type, NOW())";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':player_name' => $playerName,
            ':score'       => $score,
            ':papad_type'  => $papadType,
        ]);

        // Returns the auto-incremented ID of the new row
        return (int) $this->db->lastInsertId();
    }

    /**
     * Get top N scores (leaderboard).
     *
     * PHP Concept: PDO fetch modes — FETCH_ASSOC returns rows as associative
     * arrays (column name => value) instead of numeric index arrays.
     */
    public function getTopScores(int $limit = 10): array
    {
        $limit = max(1, min($limit, 100)); // clamp between 1 and 100

        $sql = "SELECT player_name, score, papad_type, played_at
                FROM scores
                ORDER BY score DESC
                LIMIT :limit";

        $stmt = $this->db->prepare($sql);

        // IMPORTANT: bindValue() needed for integer in LIMIT — execute([]) treats
        // all values as strings, which some MySQL configs reject in LIMIT clauses.
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Get personal best for a player name.
     * Returns null if player has no scores yet.
     */
    public function getPersonalBest(string $playerName): ?array
    {
        $sql = "SELECT player_name, score, papad_type, played_at
                FROM scores
                WHERE player_name = :player_name
                ORDER BY score DESC
                LIMIT 1";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':player_name' => trim($playerName)]);

        $result = $stmt->fetch(); // returns false if no row
        return $result !== false ? $result : null;
    }
}
