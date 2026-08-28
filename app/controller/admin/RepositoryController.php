<?php

namespace app\controller\admin;

use app\model\Repository;
use support\Request;
use support\Response;

class RepositoryController
{
    public function index(Request $request): Response
    {
        $keyword = (string) $request->input('q', '');
        $query = new Repository();

        if ($keyword !== '') {
            $query = $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->whereOr('description', 'like', "%{$keyword}%")
                  ->whereOr('language', 'like', "%{$keyword}%");
            });
        }

        $repositories = $query->order('created_at', 'desc')->paginate(10);

        return view('admin/repository', [
            'repositories' => $repositories,
            'keyword'      => $keyword,
            'admin_name'   => session('admin_name'),
        ]);
    }

    public function create(Request $request): Response
    {
        return view('admin/repository_form', [
            'repository' => null,
            'errors'     => [],
            'admin_name' => session('admin_name'),
        ]);
    }

    public function store(Request $request): Response
    {
        $result = $this->validated($request);

        if ($result['errors'] !== []) {
            return view('admin/repository_form', [
                'repository' => (object) $request->post(),
                'errors'     => $result['errors'],
                'admin_name' => session('admin_name'),
            ]);
        }

        Repository::create($result['data']);

        return redirect('/admin/repository');
    }

    public function edit(Request $request, $id): Response
    {
        $repository = Repository::find($id);

        if (!$repository) {
            return redirect('/admin/repository');
        }

        return view('admin/repository_form', [
            'repository' => $repository,
            'errors'     => [],
            'admin_name' => session('admin_name'),
        ]);
    }

    public function update(Request $request, $id): Response
    {
        $repository = Repository::find($id);

        if (!$repository) {
            return redirect('/admin/repository');
        }

        $result = $this->validated($request);

        if ($result['errors'] !== []) {
            return view('admin/repository_form', [
                'repository' => (object) array_merge($repository->toArray(), $request->post()),
                'errors'     => $result['errors'],
                'admin_name' => session('admin_name'),
            ]);
        }

        $repository->save($result['data']);

        return redirect('/admin/repository');
    }

    public function delete(Request $request, $id): Response
    {
        $repository = Repository::find($id);

        if ($repository) {
            $repository->delete();
        }

        if ($request->expectsJson()) {
            return json(['code' => 0, 'msg' => 'Berhasil dihapus']);
        }

        return redirect('/admin/repository');
    }

    public function import(Request $request): Response
    {
        $jsonContent = trim((string) $request->post('json_data', ''));
        $errors = [];

        if ($jsonContent === '') {
            $errors['json_data'] = 'Data JSON tidak boleh kosong';
            return view('admin/repository', [
                'repositories' => (new Repository())->order('created_at', 'desc')->paginate(10),
                'keyword'      => '',
                'admin_name'   => session('admin_name'),
                'import_error' => 'Data JSON tidak boleh kosong',
            ]);
        }

        $data = json_decode($jsonContent, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return view('admin/repository', [
                'repositories' => (new Repository())->order('created_at', 'desc')->paginate(10),
                'keyword'      => '',
                'admin_name'   => session('admin_name'),
                'import_error' => 'Format JSON tidak valid: ' . json_last_error_msg(),
            ]);
        }

        $items = $data['items'] ?? $data;
        $imported = 0;

        foreach ($items as $item) {
            $name = $item['title'] ?? $item['name'] ?? '';
            if ($name === '') continue;

            $exists = Repository::where('name', $name)->find();
            if ($exists) continue;

            Repository::create([
                'name'        => $name,
                'description' => $item['description'] ?? '',
                'language'    => $item['metadata']['language'] ?? $item['language'] ?? '',
                'github_url'  => $item['link'] ?? $item['github_url'] ?? '',
                'stars'       => $item['metadata']['stars'] ?? $item['stars'] ?? 0,
                'status'      => 'draft',
            ]);

            $imported++;
        }

        $message = "Berhasil mengimpor {$imported} repository.";

        return view('admin/repository', [
            'repositories' => (new Repository())->order('created_at', 'desc')->paginate(10),
            'keyword'      => '',
            'admin_name'   => session('admin_name'),
            'import_success' => $message,
        ]);
    }

    private function validated(Request $request): array
    {
        $name        = trim((string) $request->post('name', ''));
        $description = trim((string) $request->post('description', ''));
        $language    = trim((string) $request->post('language', ''));
        $githubUrl   = trim((string) $request->post('github_url', ''));
        $stars       = (int) $request->post('stars', 0);
        $status      = (string) $request->post('status', 'published');

        $errors = [];

        if ($name === '') {
            $errors['name'] = 'Nama repository wajib diisi';
        }

        if (!in_array($status, ['published', 'draft'])) {
            $status = 'published';
        }

        $data = [
            'name'        => $name,
            'description' => $description,
            'language'    => $language,
            'github_url'  => $githubUrl,
            'stars'       => max(0, $stars),
            'status'      => $status,
        ];

        return ['errors' => $errors, 'data' => $data];
    }
}
