-- Tabel untuk data Portofolio / Karya Proyek
CREATE TABLE IF NOT EXISTS `portfolios` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `image` VARCHAR(500) DEFAULT NULL,
    `project_url` VARCHAR(500) DEFAULT NULL,
    `category` VARCHAR(100) DEFAULT 'Umum',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk Repository GitHub (bisa diisi manual atau via import JSON)
CREATE TABLE IF NOT EXISTS `repositories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `language` VARCHAR(100) DEFAULT NULL,
    `github_url` VARCHAR(500) DEFAULT NULL,
    `stars` INT DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'published',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tambahkan kolom status jika tabel sudah ada (jalankan manual jika tabel exist)
-- ALTER TABLE `repositories` ADD `status` VARCHAR(20) NOT NULL DEFAULT 'published';
