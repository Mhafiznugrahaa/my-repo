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

$sqlTechStacks = $type === 'mysql'
    ? "CREATE TABLE IF NOT EXISTS tech_stacks (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(500) DEFAULT NULL,
        category VARCHAR(20) NOT NULL DEFAULT 'tools',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    : "CREATE TABLE IF NOT EXISTS tech_stacks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(500) DEFAULT NULL,
        category VARCHAR(20) NOT NULL DEFAULT 'tools',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";

$sqlProjectTechStack = $type === 'mysql'
    ? "CREATE TABLE IF NOT EXISTS project_tech_stack (
        project_id INT UNSIGNED NOT NULL,
        tech_stack_id INT UNSIGNED NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (project_id, tech_stack_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    : "CREATE TABLE IF NOT EXISTS project_tech_stack (
        project_id INTEGER NOT NULL,
        tech_stack_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (project_id, tech_stack_id)
    )";

$sqlProjectImages = $type === 'mysql'
    ? "CREATE TABLE IF NOT EXISTS project_images (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        project_id INT UNSIGNED NOT NULL,
        image_path VARCHAR(500) NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY idx_project_id (project_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    : "CREATE TABLE IF NOT EXISTS project_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        image_path VARCHAR(500) NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";

$sqlInfoImages = $type === 'mysql'
    ? "CREATE TABLE IF NOT EXISTS information_images (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        information_id INT UNSIGNED NOT NULL,
        image_path VARCHAR(500) NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY idx_information_id (information_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    : "CREATE TABLE IF NOT EXISTS information_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        information_id INTEGER NOT NULL,
        image_path VARCHAR(500) NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";

Db::execute($sqlAdmins);
Db::execute($sqlInfos);
Db::execute($sqlViews);
Db::execute($sqlVisitors);
Db::execute($sqlTechStacks);
Db::execute($sqlProjectTechStack);
Db::execute($sqlProjectImages);
Db::execute($sqlInfoImages);

// Migration: tambahkan kolom category di tech_stacks jika belum ada (untuk DB lama)
if ($type === 'mysql') {
    $colExists = Db::query("SELECT COUNT(*) AS c FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tech_stacks' AND COLUMN_NAME = 'category'");
    if (!$colExists || (int) $colExists[0]['c'] === 0) {
        Db::execute("ALTER TABLE tech_stacks ADD COLUMN category VARCHAR(20) NOT NULL DEFAULT 'tools' AFTER icon");
        echo "Kolom category ditambahkan ke tech_stacks.\n";
    }
} else {
    $cols = Db::query("PRAGMA table_info(tech_stacks)");
    $hasCategory = false;
    if ($cols) foreach ($cols as $col) {
        if (($col['name'] ?? '') === 'category') { $hasCategory = true; break; }
    }
    if (!$hasCategory) {
        Db::execute("ALTER TABLE tech_stacks ADD COLUMN category VARCHAR(20) NOT NULL DEFAULT 'tools'");
        echo "Kolom category ditambahkan ke tech_stacks.\n";
    }
}

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

// Seed tech stack contoh (jika belum ada)
$techCount = Db::table('tech_stacks')->count();
if ($techCount == 0) {
    $seedTechStacks = [
        ['name' => 'Python',      'category' => 'backend'],
        ['name' => 'TypeScript',  'category' => 'frontend'],
        ['name' => 'Java',        'category' => 'backend'],
        ['name' => 'C++',         'category' => 'backend'],
        ['name' => 'Dart',        'category' => 'frontend'],
        ['name' => 'Flutter',     'category' => 'frontend'],
        ['name' => 'Laravel',     'category' => 'backend'],
        ['name' => 'Blade',       'category' => 'frontend'],
        ['name' => 'React',       'category' => 'frontend'],
        ['name' => 'Node.js',     'category' => 'backend'],
        ['name' => 'JavaScript',  'category' => 'frontend'],
        ['name' => 'HTML',        'category' => 'frontend'],
        ['name' => 'CSS',         'category' => 'frontend'],
        ['name' => 'Tailwind CSS','category' => 'frontend'],
        ['name' => 'MySQL',       'category' => 'database'],
        ['name' => 'Git',         'category' => 'tools'],
        ['name' => 'Docker',      'category' => 'tools'],
        ['name' => 'Figma',       'category' => 'tools'],
    ];
    foreach ($seedTechStacks as $ts) {
        Db::table('tech_stacks')->insert($ts);
    }
    echo 'Data tech stack contoh ditambahkan (' . count($seedTechStacks) . " item).\n";
}

// Kategorikan tech stack bawaan yang masih ber-kategori default 'tools'
// (idempotent: hanya menyentuh nama yang dikenal & belum diberi kategori lain)
$techCategoryMap = [
    'Python' => 'backend', 'Java' => 'backend', 'C++' => 'backend',
    'Laravel' => 'backend', 'Node.js' => 'backend', 'TypeScript' => 'frontend',
    'Dart' => 'frontend', 'Flutter' => 'frontend', 'Blade' => 'frontend',
    'React' => 'frontend', 'JavaScript' => 'frontend', 'HTML' => 'frontend',
    'CSS' => 'frontend', 'Tailwind CSS' => 'frontend', 'MySQL' => 'database',
    'Git' => 'tools', 'Docker' => 'tools', 'Figma' => 'tools',
];
$categorized = 0;
$allStacks = Db::table('tech_stacks')->select();
if ($allStacks) foreach ($allStacks as $st) {
    $name = $st['name'] ?? '';
    $cat = $techCategoryMap[$name] ?? null;
    if ($cat && ($st['category'] ?? '') === 'tools') {
        Db::table('tech_stacks')->where('id', $st['id'])->update(['category' => $cat]);
        $categorized++;
    }
}
if ($categorized > 0) {
    echo "Kategori tech stack bawaan disesuaikan ({$categorized} item).\n";
}

echo "Setup database selesai (driver: {$type}).\n";
