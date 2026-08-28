<?php

return [
    'default' => getenv('DB_CONNECTION') ?: 'mysql',
    'connections' => [
        'mysql' => [
            'type'     => 'mysql',
            'hostname' => getenv('DB_HOST') ?: '127.0.0.1',
            'database' => getenv('DB_NAME') ?: 'webman_info',
            'username' => getenv('DB_USER') ?: 'root',
            'password' => getenv('DB_PASS') ?: '',
            'hostport' => getenv('DB_PORT') ?: '3306',
            'params'   => [
                \PDO::ATTR_TIMEOUT => 3,
            ],
            'charset' => 'utf8mb4',
            'prefix'  => '',
            'break_reconnect' => true,
        ],
        'sqlite' => [
            'type'     => 'sqlite',
            'database' => base_path() . '/database/information.sqlite',
            'charset'  => 'utf8',
            'prefix'   => '',
            'break_reconnect' => true,
        ],
    ],
    'paginator' =>  '',
];
