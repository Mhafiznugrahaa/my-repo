<?php

namespace app\controller\api;

use app\model\Information;
use app\model\InformationImage;
use app\model\Portfolio;
use app\model\ProjectImage;
use app\model\Repository;
use app\model\TechStack;
use support\Request;
use support\think\Db;

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
            'portfolios'   => $this->attachRelations($portfolios),
            'informations' => $informations,
        ]);
    }

    public function techStacks(Request $request): \support\Response
    {
        $keyword = (string) $request->input('q', '');
        $kategori = (string) $request->input('kategori', '');
        $query = new TechStack();
        if ($keyword !== '') {
            $query = $query->where('name', 'like', "%{$keyword}%");
        }
        if ($kategori !== '') {
            $query = $query->where('category', $kategori);
        }
        $items = $query->order('name', 'asc')->select();
        return json($items);
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

        $data = $info->toArray();
        $data['images'] = $this->imagesForInformation((int) $info->id);

        return json($data);
    }

    public function portofolio(Request $request): \support\Response
    {
        $portfolios = Portfolio::order('created_at', 'desc')->select();
        return json($this->attachRelations($portfolios));
    }

    public function portofolioShow(Request $request, $id): \support\Response
    {
        $portfolio = Portfolio::find($id);

        if (!$portfolio) {
            return json(['code' => 404, 'msg' => 'Tidak ditemukan'])->withStatus(404);
        }

        $data = $portfolio->toArray();
        $data['tech_stacks'] = $this->techStacksForProject((int) $portfolio->id);
        $data['images']      = $this->imagesForProject((int) $portfolio->id);

        return json($data);
    }

    public function tentang(Request $request): \support\Response
    {
        $repositories = Repository::where('status', 'published')->order('stars', 'desc')->limit(6)->select();

        $profile = [
            'name'        => 'M. Hafiz Nugrahaa',
            'username'    => 'Mhafiznugrahaa',
            'role'        => 'software engineer',
            'bio'         => 'Mahasiswa Teknik Informatika yang antusias dalam pengembangan web, AI Agent, dan mobile apps.',
            'avatar'      => 'https://avatars.githubusercontent.com/u/188332725?v=4',
            'email'       => 'afiznugraha890@gmail.com',
            'github'      => 'https://github.com/Mhafiznugrahaa',
            'linkedin'    => 'https://linkedin.com/in/mhafiznugrahaa',
            'instagram'   => 'https://instagram.com/mhafiznugrahaa',
        ];

        return json([
            'profile'      => $profile,
            'repositories' => $repositories,
        ]);
    }

    public function viewIncrement(Request $request): \support\Response
    {
        $page = (string) $request->input('page', 'tentang');
        $ip = $this->getClientIp($request);

        $visitor = \support\think\Db::table('page_visitors')
            ->where('page', $page)
            ->where('ip', $ip)
            ->find();

        if (!$visitor) {
            \support\think\Db::table('page_visitors')->insert([
                'page' => $page,
                'ip' => $ip,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
            $this->incrementTotal($page);
        }

        $row = \support\think\Db::table('page_views')->where('page', $page)->find();
        return json(['views' => $row ? (int) $row['views'] : 0]);
    }

    private function incrementTotal(string $page): void
    {
        $row = \support\think\Db::table('page_views')->where('page', $page)->find();
        if (!$row) {
            \support\think\Db::table('page_views')->insert(['page' => $page, 'views' => 1]);
        } else {
            \support\think\Db::table('page_views')
                ->where('page', $page)
                ->update(['views' => (int) $row['views'] + 1]);
        }
    }

    public function viewCount(Request $request): \support\Response
    {
        $page = (string) $request->input('page', 'tentang');
        $row = \support\think\Db::table('page_views')->where('page', $page)->find();
        return json(['views' => $row ? (int) $row['views'] : 0]);
    }

    private function getClientIp(Request $request): string
    {
        return $request->getRealIp() ?: '127.0.0.1';
    }

    private function attachRelations($portfolios): array
    {
        $items = [];
        foreach ($portfolios as $portfolio) {
            $arr = $portfolio->toArray();
            $arr['tech_stacks'] = $this->techStacksForProject((int) $portfolio->id);
            $items[] = $arr;
        }
        return $items;
    }

    private function techStacksForProject(int $projectId): array
    {
        $rows = Db::table('project_tech_stack')
            ->alias('pts')
            ->join('tech_stacks ts', 'ts.id = pts.tech_stack_id')
            ->where('pts.project_id', $projectId)
            ->order('ts.name', 'asc')
            ->field('ts.id, ts.name, ts.icon, ts.category')
            ->select();
        return $rows ? $rows->toArray() : [];
    }

    private function imagesForProject(int $projectId): array
    {
        $rows = ProjectImage::where('project_id', $projectId)
            ->order('sort_order', 'asc')
            ->order('id', 'asc')
            ->select();
        return $rows ? $rows->toArray() : [];
    }

    private function imagesForInformation(int $informationId): array
    {
        $rows = InformationImage::where('information_id', $informationId)
            ->order('sort_order', 'asc')
            ->order('id', 'asc')
            ->select();
        return $rows ? $rows->toArray() : [];
    }
}
