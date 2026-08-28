<?php

namespace app\controller;

use app\model\Repository;
use support\Request;

class HomeController
{
    public function index(Request $request)
    {
        $spaFile = public_path() . '/index.html';
        if (is_file($spaFile)) {
            return response(file_get_contents($spaFile))->withHeader('Content-Type', 'text/html; charset=utf-8');
        }

        return view('home/index', [
            'portfolios'   => [],
            'informations' => [],
            'repositories' => Repository::where('status', 'published')->order('stars', 'desc')->limit(6)->select(),
            'is_admin'     => (bool) session('admin_id'),
        ]);
    }
}
