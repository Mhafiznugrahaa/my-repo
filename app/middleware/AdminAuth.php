<?php

namespace app\middleware;

use Webman\MiddlewareInterface;
use Webman\Http\Request;
use Webman\Http\Response;

class AdminAuth implements MiddlewareInterface
{
    public function process(Request $request, callable $handler): Response
    {
        // Cek "kunci" login: apakah session admin_id sudah ada?
        $adminId = session('admin_id');

        if (!$adminId) {
            // Belum login -> tolak. Kalau request AJAX/JSON, balas 401,
            // kalau biasa (browser), arahkan ke halaman login.
            if ($request->expectsJson()) {
                return json(['code' => 401, 'msg' => 'Anda harus login sebagai admin']);
            }
            return redirect('/admin/login');
        }

        // Sudah login -> lanjutkan ke controller tujuan ($handler).
        return $handler($request);
    }
}
