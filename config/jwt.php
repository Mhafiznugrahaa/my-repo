<?php

return [
    'secret' => getenv('JWT_SECRET') ?: 'b9f3c1a7e2d84f6a0c5b3e9d7f1a4c8e2b6d0f9a3c7e5b1d8f4a2c6e0b3d7f9',
    'ttl'    => 7 * 24 * 3600,
    'issuer' => 'webman-api',
];
