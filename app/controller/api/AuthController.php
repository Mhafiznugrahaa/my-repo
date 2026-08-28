<?php

namespace app\controller\api;

use app\model\Admin;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use support\Request;
use support\Response;

class AuthController
{
    private function issueToken(Admin $admin): string
    {
        $config = config('jwt');
        $now = time();
        return JWT::encode([
            'iss'  => $config['issuer'],
            'iat'  => $now,
            'exp'  => $now + $config['ttl'],
            'sub'  => (string) $admin->id,
            'name' => $admin->username,
        ], $config['secret'], 'HS256');
    }

    public static function bearer(Request $request): ?array
    {
        $header = (string) $request->header('authorization', '');
        if (!preg_match('/^Bearer\s+(\S+)$/i', $header, $m)) {
            return null;
        }
        try {
            $config = config('jwt');
            $decoded = JWT::decode($m[1], new Key($config['secret'], 'HS256'));
            return (array) $decoded;
        } catch (\Throwable) {
            return null;
        }
    }

    public function login(Request $request): Response
    {
        $username = trim((string) $request->post('username', ''));
        $password = (string) $request->post('password', '');

        if ($username === '' || $password === '') {
            return json(['code' => 1, 'msg' => 'Username dan password wajib diisi'])->withStatus(400);
        }

        $admin = Admin::where('username', $username)->find();

        if (!$admin || !password_verify($password, $admin->password)) {
            return json(['code' => 1, 'msg' => 'Username atau password salah'])->withStatus(401);
        }

        return json([
            'code' => 0,
            'msg'  => 'Login berhasil',
            'data' => ['token' => $this->issueToken($admin), 'name' => $admin->username],
        ]);
    }

    public function check(Request $request): Response
    {
        $claims = self::bearer($request);

        if (!$claims) {
            return json(['code' => 1, 'msg' => 'Belum login atau token tidak valid'])->withStatus(401);
        }

        return json(['code' => 0, 'data' => ['id' => (int) $claims['sub'], 'name' => $claims['name']]]);
    }

    public function logout(): Response
    {
        return json(['code' => 0, 'msg' => 'Logout berhasil']);
    }
}
