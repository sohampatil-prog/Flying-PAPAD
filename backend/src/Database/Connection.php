<?php

namespace PapadUdd\Database;

use PDO;
use PDOException;

/**
 * Database Connection — Singleton pattern
 * 
 * PHP Concept: Singleton ensures only ONE DB connection exists
 * across the entire request lifecycle. We use PDO (PHP Data Objects)
 * instead of mysqli — it's database-agnostic and uses prepared statements
 * natively, which prevents SQL injection.
 */
class Connection
{
    private static ?Connection $instance = null;
    private PDO $pdo;

    // private constructor = nobody can do `new Connection()` from outside
    private function __construct()
    {
        $host   = $_ENV['DB_HOST']     ?? 'localhost';
        $db     = $_ENV['DB_NAME']     ?? 'papad_udd';
        $user   = $_ENV['DB_USER']     ?? 'root';
        $pass   = $_ENV['DB_PASSWORD'] ?? '';
        $port   = $_ENV['DB_PORT']     ?? '3306';

        $dsn = "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";

        try {
            $this->pdo = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            // Never expose raw DB errors to the client
            throw new \RuntimeException('Database connection failed: ' . $e->getMessage());
        }
    }

    /**
     * PHP Concept: Static method — called on the class, not an instance.
     * Returns the single shared PDO connection.
     */
    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getPdo(): PDO
    {
        return $this->pdo;
    }

    // Prevent cloning or unserializing the singleton
    private function __clone() {}
    public function __wakeup(): void
    {
        throw new \RuntimeException('Cannot unserialize a singleton.');
    }
}
