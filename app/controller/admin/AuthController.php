<?php

namespace app\controller\admin;

use app\model\Admin;
use support\Request;
use support\Response;

class AuthController
{
    public function loginForm(Request $request): Response
    {
        if (session('admin_id')) {
            return redirect('/admin');
        }

        return view('admin/login', ['error' => session('login_error')]);
    }

    public function login(Request $request): Response
    {
        $username = trim((string) $request->post('username', ''));
        $password = (string) $request->post('password', '');

        if ($username === '' || $password === '') {
            return view('admin/login', ['error' => 'Username dan password wajib diisi']);
        }

        $admin = Admin::where('username', $username)->find();

        // password_verify wajib dipakai karena password disimpan pakai password_hash().
        // Jangan pakai perbandingan == langsung ke database.
        if (!$admin || !password_verify($password, $admin->password)) {
            return view('admin/login', ['error' => 'Username atau password salah']);
        }

        // Simpan identitas admin ke session. Inilah "kunci" yang dicek
        // oleh middleware AdminAuth untuk mengizinkan akses area admin.
        session(['admin_id' => $admin->id, 'admin_name' => $admin->username]);

        return redirect('/admin');
    }

    public function logout(Request $request): Response
    {
        session()->forget(['admin_id', 'admin_name']);
        session()->flush();

        return redirect('/admin/login');
    }
}
