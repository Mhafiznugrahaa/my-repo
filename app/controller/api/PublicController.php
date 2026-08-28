<?php

namespace app\controller\api;

use app\model\Information;
use app\model\Portfolio;
use app\model\Repository;
use support\Request;

class PublicController
{
    public function home(Request $request): \support\Response
    {
        $repositories = Repository::where('status', 'published')->order('stars', 'desc')->limit(6)->select();
        $portfolios = Portfolio::order('created_at', 'desc')->limit(3)->select();
        $informations = Information::where('status', 'published')
            ->order('created_at', 'desc')->limit(3)->select();

        return json([
            'repositories' => $repositories,
            'portfolios'   => $portfolios,
            'informations' => $informations,
        ]);
    }

    public function informasi(Request $request): \support\Response
    {
        $keyword = (string) $request->input('q', '');
        $category = (string) $request->input('category', '');
        $page = (int) $request->input('page', 1);

        $query = Information::where('status', 'published');

        if ($keyword !== '') {
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->whereOr('body', 'like', "%{$keyword}%");
            });
        }

        if ($category !== '') {
            $query->where('category', $category);
        }

        $total = $query->count();
        $informations = $query->order('created_at', 'desc')->page($page, 12)->select();

        $categories = Information::where('status', 'published')
            ->distinct('category')
            ->column('category');

        return json([
            'data'       => $informations,
            'categories' => $categories,
            'total'      => $total,
            'page'       => $page,
            'per_page'   => 12,
            'last_page'  => max(1, (int) ceil($total / 12)),
        ]);
    }

    public function infoShow(Request $request, $id): \support\Response
    {
        $info = Information::where('id', $id)
            ->where('status', 'published')
            ->find($id);

        if (!$info) {
            return json(['code' => 404, 'msg' => 'Tidak ditemukan'])->withStatus(404);
        }

        return json($info);
    }

    public function portofolio(Request $request): \support\Response
    {
        $portfolios = Portfolio::order('created_at', 'desc')->select();
        return json($portfolios);
    }

    public function portofolioShow(Request $request, $id): \support\Response
    {
        $portfolio = Portfolio::find($id);

        if (!$portfolio) {
            return json(['code' => 404, 'msg' => 'Tidak ditemukan'])->withStatus(404);
        }

        return json($portfolio);
    }

    public function tentang(Request $request): \support\Response
    {
        $repositories = Repository::where('status', 'published')->order('stars', 'desc')->limit(6)->select();

        $profile = [
            'name'        => 'M. Hafiz Nugrahaa',
            'username'    => 'Mhafiznugrahaa',
            'role'        => 'Learning, Coding, Sleeping Everywhere',
            'bio'         => 'Mahasiswa Teknologi Informasi yang antusias dalam pengembangan web, AI Agent, dan mobile apps.',
            'avatar'      => 'https://avatars.githubusercontent.com/u/188332725?v=4',
            'email'       => 'mhafiznugrahaa@gmail.com',
            'github'      => 'https://github.com/Mhafiznugrahaa',
            'linkedin'    => 'https://linkedin.com/in/mhafiznugrahaa',
            'instagram'   => 'https://instagram.com/mhafiznugrahaa',
        ];

        return json([
            'profile'      => $profile,
            'repositories' => $repositories,
        ]);
    }
}
