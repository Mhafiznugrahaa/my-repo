<?php

use support\think\Db;
use think\Container;
use Webman\ThinkOrm\DbManager;
use Dotenv\Dotenv;

require_once __DIR__ . '/vendor/autoload.php';

// Load .env first
if (class_exists(Dotenv::class) && file_exists(__DIR__ . '/.env')) {
    if (method_exists(Dotenv::class, 'createUnsafeImmutable')) {
        Dotenv::createUnsafeImmutable(__DIR__)->load();
    } else {
        Dotenv::createMutable(__DIR__)->load();
    }
}

// Muat konfigurasi think-orm
$config = require __DIR__ . '/config/think-orm.php';
$type = $config['default'];
$conn = $config['connections'][$type];

if ($type === 'mysql') {
    // Buat database dulu jika belum ada
    $dsn = "mysql:host={$conn['hostname']};port={$conn['hostport']};charset={$conn['charset']}";
    $pdo = new PDO($dsn, $conn['username'], $conn['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $dbName = $conn['database'];
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET {$conn['charset']}");
    echo "Database `{$dbName}` siap.\n";
}

Container::getInstance()->bind('think\DbManager', DbManager::class);
Db::setConfig($config);

$sqlAdmins = $type === 'mysql'
    ? "CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    : "CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";

$sqlInfos = $type === 'mysql'
    ? "CREATE TABLE IF NOT EXISTS informations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'Umum',
        body TEXT NOT NULL,
        image VARCHAR(255) NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    : "CREATE TABLE IF NOT EXISTS informations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(200) NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'Umum',
        body TEXT NOT NULL,
        image VARCHAR(255) NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";

$sqlViews = $type === 'mysql'
    ? "CREATE TABLE IF NOT EXISTS page_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page VARCHAR(100) NOT NULL UNIQUE,
        views INT UNSIGNED NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    : "CREATE TABLE IF NOT EXISTS page_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        page VARCHAR(100) NOT NULL UNIQUE,
        views INTEGER UNSIGNED NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";

$sqlVisitors = $type === 'mysql'
    ? "CREATE TABLE IF NOT EXISTS page_visitors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page VARCHAR(100) NOT NULL,
        ip VARCHAR(45) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_page_ip (page, ip)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    : "CREATE TABLE IF NOT EXISTS page_visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        page VARCHAR(100) NOT NULL,
        ip VARCHAR(45) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";

Db::execute($sqlAdmins);
Db::execute($sqlInfos);
Db::execute($sqlViews);
Db::execute($sqlVisitors);

// Seed page_views for 'tentang' page if not exists
$exists = Db::table('page_views')->where('page', 'tentang')->count();
if ($exists == 0) {
    Db::table('page_views')->insert(['page' => 'tentang', 'views' => 0]);
}

// Seed admin default (username: admin, password: admin123)
$exists = Db::table('admins')->where('username', 'admin')->count();
if ($exists == 0) {
    Db::table('admins')->insert([
        'username' => 'admin',
        'password' => password_hash('admin123', PASSWORD_DEFAULT),
    ]);
    echo "Admin default dibuat: username=admin, password=admin123\n";
}

// Seed beberapa informasi contoh
$count = Db::table('informations')->count();
if ($count == 0) {
    Db::table('informations')->insert([
        'title'    => 'Selamat Datang di Website Informasi',
        'category' => 'Pengumuman',
        'body'     => 'Ini adalah website informasi sederhana. Halaman ini dapat dilihat oleh semua pengunjung.',
        'status'   => 'published',
    ]);
    Db::table('informations')->insert([
        'title'    => 'Cara Menjadi Admin',
        'category' => 'Panduan',
        'body'     => 'Hanya admin yang dapat mengelola (CRUD) data informasi melalui dashboard admin.',
        'status'   => 'published',
    ]);
    echo "Data informasi contoh ditambahkan.\n";
}

echo "Setup database selesai (driver: {$type}).\n";
