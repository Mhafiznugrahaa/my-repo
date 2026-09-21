<?php

namespace app\controller\api;

use app\model\Information;
use app\model\InformationImage;
use app\model\Portfolio;
use app\model\ProjectImage;
use app\model\Repository;
use app\model\TechStack;
use support\Request;
use support\Response;
use support\think\Db;

class AdminController
{
    private const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    private const MAX_SIZE = 2 * 1024 * 1024;
    private const TECH_CATEGORIES = ['backend', 'frontend', 'database', 'tools'];

    private function checkAuth(): bool
    {
        return AuthController::bearer(request()) !== null;
    }

    private function unauth(): Response
    {
        return json(['code' => 401, 'msg' => 'Unauthorized'])->withStatus(401);
    }

    // ==================== INFORMATION ====================

    public function infoIndex(Request $request): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $keyword = (string) $request->input('q', '');
        $page = (int) $request->input('page', 1);
        $query = new Information();
        if ($keyword !== '') {
            $query = $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")->whereOr('body', 'like', "%{$keyword}%");
            });
        }
        $total = $query->count();
        $items = $query->order('created_at', 'desc')->page($page, 10)->select();
        $data = [];
        foreach ($items as $item) {
            $data[] = $this->infoWithRelations($item);
        }
        return json(['data' => $data, 'total' => $total, 'page' => $page, 'last_page' => max(1, (int) ceil($total / 10))]);
    }

    public function infoStore(Request $request): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $title = trim((string) $request->post('title', ''));
        $category = trim((string) $request->post('category', 'Umum'));
        $body = trim((string) $request->post('body', ''));
        $status = (string) $request->post('status', 'published');
        if ($title === '' || $body === '') {
            return json(['code' => 1, 'msg' => 'Judul dan isi wajib diisi'])->withStatus(400);
        }
        $data = ['title' => $title, 'category' => $category, 'body' => $body, 'status' => $status];
        $uploaded = $this->handleUpload($request);
        if ($uploaded) $data['image'] = $uploaded;
        $info = Information::create($data);
        $this->storeInfoImages($info->id, $this->handleGalleryUpload($request));
        return json(['code' => 0, 'msg' => 'Berhasil disimpan', 'data' => $this->infoWithRelations($info)]);
    }

    public function infoUpdate(Request $request, $id): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $info = Information::find($id);
        if (!$info) return json(['code' => 404, 'msg' => 'Tidak ditemukan'])->withStatus(404);
        $title = trim((string) $request->post('title', ''));
        $body = trim((string) $request->post('body', ''));
        if ($title === '' || $body === '') {
            return json(['code' => 1, 'msg' => 'Judul dan isi wajib diisi'])->withStatus(400);
        }
        $data = [
            'title' => $title,
            'category' => trim((string) $request->post('category', 'Umum')),
            'body' => $body,
            'status' => (string) $request->post('status', 'published'),
        ];
        if ($request->post('remove_image') === '1' && $info->image) {
            $this->deleteImageFile($info->image);
            $data['image'] = null;
        }
        $uploaded = $this->handleUpload($request);
        if ($uploaded) {
            if ($info->image) $this->deleteImageFile($info->image);
            $data['image'] = $uploaded;
        }
        $info->save($data);
        $this->removeInfoImages($info->id, $request->post('remove_images', []));
        $this->storeInfoImages($info->id, $this->handleGalleryUpload($request));
        return json(['code' => 0, 'msg' => 'Berhasil diperbarui', 'data' => $this->infoWithRelations($info)]);
    }

    public function infoDelete(Request $request, $id): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $info = Information::find($id);
        if ($info) {
            if ($info->image) $this->deleteImageFile($info->image);
            $imgs = InformationImage::where('information_id', $info->id)->select();
            foreach ($imgs as $img) {
                if ($img->image_path) $this->deleteImageFile($img->image_path);
            }
            InformationImage::where('information_id', $info->id)->delete();
            $info->delete();
        }
        return json(['code' => 0, 'msg' => 'Berhasil dihapus']);
    }

    // ==================== PORTFOLIO ====================

    public function portfolioIndex(Request $request): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $keyword = (string) $request->input('q', '');
        $page = (int) $request->input('page', 1);
        $query = new Portfolio();
        if ($keyword !== '') {
            $query = $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")->whereOr('description', 'like', "%{$keyword}%");
            });
        }
        $total = $query->count();
        $items = $query->order('created_at', 'desc')->page($page, 10)->select();
        $data = [];
        foreach ($items as $item) {
            $data[] = $this->portfolioWithRelations($item);
        }
        return json(['data' => $data, 'total' => $total, 'page' => $page, 'last_page' => max(1, (int) ceil($total / 10))]);
    }

    public function portfolioStore(Request $request): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $title = trim((string) $request->post('title', ''));
        if ($title === '') return json(['code' => 1, 'msg' => 'Judul wajib diisi'])->withStatus(400);
        $data = [
            'title' => $title,
            'description' => trim((string) $request->post('description', '')),
            'category' => trim((string) $request->post('category', 'Umum')),
            'project_url' => trim((string) $request->post('project_url', '')),
        ];
        $uploaded = $this->handleUpload($request);
        if ($uploaded) $data['image'] = $uploaded;
        $item = Portfolio::create($data);
        $this->syncProjectTechStacks($item->id, $request->post('tech_stacks', []));
        $this->storeGalleryImages($item->id, $this->handleGalleryUpload($request));
        return json(['code' => 0, 'msg' => 'Berhasil disimpan', 'data' => $this->portfolioWithRelations($item)]);
    }

    public function portfolioUpdate(Request $request, $id): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $item = Portfolio::find($id);
        if (!$item) return json(['code' => 404, 'msg' => 'Tidak ditemukan'])->withStatus(404);
        $title = trim((string) $request->post('title', ''));
        if ($title === '') return json(['code' => 1, 'msg' => 'Judul wajib diisi'])->withStatus(400);
        $data = [
            'title' => $title,
            'description' => trim((string) $request->post('description', '')),
            'category' => trim((string) $request->post('category', 'Umum')),
            'project_url' => trim((string) $request->post('project_url', '')),
        ];
        if ($request->post('remove_image') === '1' && $item->image) {
            $this->deleteImageFile($item->image);
            $data['image'] = null;
        }
        $uploaded = $this->handleUpload($request);
        if ($uploaded) {
            if ($item->image) $this->deleteImageFile($item->image);
            $data['image'] = $uploaded;
        }
        $item->save($data);
        $this->syncProjectTechStacks($item->id, $request->post('tech_stacks', []));
        $this->removeProjectImages($item->id, $request->post('remove_images', []));
        $this->storeGalleryImages($item->id, $this->handleGalleryUpload($request));
        return json(['code' => 0, 'msg' => 'Berhasil diperbarui', 'data' => $this->portfolioWithRelations($item)]);
    }

    public function portfolioDelete(Request $request, $id): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $item = Portfolio::find($id);
        if ($item) {
            if ($item->image) $this->deleteImageFile($item->image);
            $gallery = ProjectImage::where('project_id', $item->id)->select();
            foreach ($gallery as $img) {
                if ($img->image_path) $this->deleteImageFile($img->image_path);
            }
            ProjectImage::where('project_id', $item->id)->delete();
            Db::table('project_tech_stack')->where('project_id', $item->id)->delete();
            $item->delete();
        }
        return json(['code' => 0, 'msg' => 'Berhasil dihapus']);
    }

    // ==================== TECH STACK ====================

    public function techStackIndex(Request $request): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $keyword = (string) $request->input('q', '');
        $page = (int) $request->input('page', 1);
        $query = new TechStack();
        if ($keyword !== '') {
            $query = $query->where('name', 'like', "%{$keyword}%");
        }
        $total = $query->count();
        $items = $query->order('name', 'asc')->page($page, 20)->select();
        return json(['data' => $items, 'total' => $total, 'page' => $page, 'last_page' => max(1, (int) ceil($total / 20))]);
    }

    public function techStackStore(Request $request): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $name = trim((string) $request->post('name', ''));
        if ($name === '') return json(['code' => 1, 'msg' => 'Nama wajib diisi'])->withStatus(400);
        $category = (string) $request->post('category', 'tools');
        if (!in_array($category, self::TECH_CATEGORIES)) $category = 'tools';
        $data = ['name' => $name, 'category' => $category];
        $uploaded = $this->handleUpload($request, 'icon');
        if ($uploaded) $data['icon'] = $uploaded;
        $item = TechStack::create($data);
        return json(['code' => 0, 'msg' => 'Berhasil disimpan', 'data' => $item]);
    }

    public function techStackUpdate(Request $request, $id): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $item = TechStack::find($id);
        if (!$item) return json(['code' => 404, 'msg' => 'Tidak ditemukan'])->withStatus(404);
        $name = trim((string) $request->post('name', ''));
        if ($name === '') return json(['code' => 1, 'msg' => 'Nama wajib diisi'])->withStatus(400);
        $category = (string) $request->post('category', 'tools');
        if (!in_array($category, self::TECH_CATEGORIES)) $category = 'tools';
        $data = ['name' => $name, 'category' => $category];
        if ($request->post('remove_icon') === '1' && $item->icon) {
            $this->deleteImageFile($item->icon);
            $data['icon'] = null;
        }
        $uploaded = $this->handleUpload($request, 'icon');
        if ($uploaded) {
            if ($item->icon) $this->deleteImageFile($item->icon);
            $data['icon'] = $uploaded;
        }
        $item->save($data);
        return json(['code' => 0, 'msg' => 'Berhasil diperbarui', 'data' => $item]);
    }

    public function techStackDelete(Request $request, $id): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $item = TechStack::find($id);
        if ($item) {
            if ($item->icon) $this->deleteImageFile($item->icon);
            Db::table('project_tech_stack')->where('tech_stack_id', $item->id)->delete();
            $item->delete();
        }
        return json(['code' => 0, 'msg' => 'Berhasil dihapus']);
    }

    // ==================== REPOSITORY ====================

    public function repoIndex(Request $request): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $keyword = (string) $request->input('q', '');
        $page = (int) $request->input('page', 1);
        $query = new Repository();
        if ($keyword !== '') {
            $query = $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")->whereOr('description', 'like', "%{$keyword}%");
            });
        }
        $total = $query->count();
        $items = $query->order('created_at', 'desc')->page($page, 10)->select();
        return json(['data' => $items, 'total' => $total, 'page' => $page, 'last_page' => max(1, (int) ceil($total / 10))]);
    }

    public function repoStore(Request $request): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $name = trim((string) $request->post('name', ''));
        if ($name === '') return json(['code' => 1, 'msg' => 'Nama wajib diisi'])->withStatus(400);
        $status = (string) $request->post('status', 'published');
        if (!in_array($status, ['published', 'draft'])) $status = 'published';
        $item = Repository::create([
            'name' => $name,
            'description' => trim((string) $request->post('description', '')),
            'language' => trim((string) $request->post('language', '')),
            'github_url' => trim((string) $request->post('github_url', '')),
            'stars' => (int) $request->post('stars', 0),
            'status' => $status,
        ]);
        return json(['code' => 0, 'msg' => 'Berhasil disimpan', 'data' => $item]);
    }

    public function repoUpdate(Request $request, $id): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $item = Repository::find($id);
        if (!$item) return json(['code' => 404, 'msg' => 'Tidak ditemukan'])->withStatus(404);
        $name = trim((string) $request->post('name', ''));
        if ($name === '') return json(['code' => 1, 'msg' => 'Nama wajib diisi'])->withStatus(400);
        $status = (string) $request->post('status', 'published');
        if (!in_array($status, ['published', 'draft'])) $status = 'published';
        $item->save([
            'name' => $name,
            'description' => trim((string) $request->post('description', '')),
            'language' => trim((string) $request->post('language', '')),
            'github_url' => trim((string) $request->post('github_url', '')),
            'stars' => (int) $request->post('stars', 0),
            'status' => $status,
        ]);
        return json(['code' => 0, 'msg' => 'Berhasil diperbarui', 'data' => $item]);
    }

    public function repoDelete(Request $request, $id): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $item = Repository::find($id);
        if ($item) $item->delete();
        return json(['code' => 0, 'msg' => 'Berhasil dihapus']);
    }

    public function repoImport(Request $request): Response
    {
        if (!$this->checkAuth()) return $this->unauth();
        $jsonContent = trim((string) $request->post('json_data', ''));
        if ($jsonContent === '') return json(['code' => 1, 'msg' => 'Data JSON tidak boleh kosong'])->withStatus(400);
        $data = json_decode($jsonContent, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return json(['code' => 1, 'msg' => 'Format JSON tidak valid'])->withStatus(400);
        }
        $items = $data['items'] ?? $data;
        $imported = 0;
        foreach ($items as $item) {
            $name = $item['title'] ?? $item['name'] ?? '';
            if ($name === '') continue;
            if (Repository::where('name', $name)->find()) continue;
            Repository::create([
                'name' => $name,
                'description' => $item['description'] ?? '',
                'language' => $item['metadata']['language'] ?? $item['language'] ?? '',
                'github_url' => $item['link'] ?? $item['github_url'] ?? '',
                'stars' => $item['metadata']['stars'] ?? $item['stars'] ?? 0,
                'status' => 'draft',
            ]);
            $imported++;
        }
        return json(['code' => 0, 'msg' => "Berhasil mengimpor {$imported} repository.", 'imported' => $imported]);
    }

    // ==================== HELPERS ====================

    private function handleUpload(Request $request, string $field = 'image'): ?string
    {
        $file = $request->file($field);
        if (!$file || !$file->isValid()) return null;
        $ext = strtolower($file->getUploadExtension());
        if (!in_array($ext, self::ALLOWED_EXT)) return null;
        $dir = public_path() . '/uploads';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $filename = date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        $file->move($dir . '/' . $filename);
        return '/uploads/' . $filename;
    }

    private function handleGalleryUpload(Request $request): array
    {
        $files = $request->file('images');
        if (!$files) return [];
        if (!is_array($files)) $files = [$files];

        $paths = [];
        $dir = public_path() . '/uploads';
        if (!is_dir($dir)) mkdir($dir, 0755, true);

        foreach ($files as $file) {
            if (!$file || !$file->isValid()) continue;
            $ext = strtolower($file->getUploadExtension());
            if (!in_array($ext, self::ALLOWED_EXT)) continue;
            if ($file->getSize() > self::MAX_SIZE) continue;
            $filename = date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
            $file->move($dir . '/' . $filename);
            $paths[] = '/uploads/' . $filename;
        }
        return $paths;
    }

    private function storeGalleryImages(int $projectId, array $paths): void
    {
        if ($paths === []) return;
        $startSort = (int) ProjectImage::where('project_id', $projectId)->max('sort_order');
        foreach ($paths as $index => $path) {
            ProjectImage::create([
                'project_id'  => $projectId,
                'image_path'  => $path,
                'sort_order'  => $startSort + $index + 1,
            ]);
        }
    }

    private function storeInfoImages(int $informationId, array $paths): void
    {
        if ($paths === []) return;
        $startSort = (int) InformationImage::where('information_id', $informationId)->max('sort_order');
        foreach ($paths as $index => $path) {
            InformationImage::create([
                'information_id' => $informationId,
                'image_path'     => $path,
                'sort_order'     => $startSort + $index + 1,
            ]);
        }
    }

    private function removeInfoImages(int $informationId, $imageIds): void
    {
        foreach ((array) $imageIds as $rawId) {
            $imageId = (int) $rawId;
            if ($imageId <= 0) continue;
            $img = InformationImage::where('id', $imageId)->where('information_id', $informationId)->find();
            if (!$img) continue;
            if ($img->image_path) $this->deleteImageFile($img->image_path);
            $img->delete();
        }
    }

    private function removeProjectImages(int $projectId, $imageIds): void
    {
        foreach ((array) $imageIds as $rawId) {
            $imageId = (int) $rawId;
            if ($imageId <= 0) continue;
            $img = ProjectImage::where('id', $imageId)->where('project_id', $projectId)->find();
            if (!$img) continue;
            if ($img->image_path) $this->deleteImageFile($img->image_path);
            $img->delete();
        }
    }

    private function syncProjectTechStacks(int $projectId, $techStackIds): void
    {
        $ids = array_values(array_unique(array_filter(array_map('intval', (array) $techStackIds))));
        Db::table('project_tech_stack')->where('project_id', $projectId)->delete();
        foreach ($ids as $id) {
            if (!TechStack::find($id)) continue;
            Db::table('project_tech_stack')->insert([
                'project_id'    => $projectId,
                'tech_stack_id' => $id,
            ]);
        }
    }

    private function portfolioWithRelations(Portfolio $item): array
    {
        $data = $item->toArray();
        $data['tech_stacks'] = $this->techStacksForProject($item->id);
        $data['images']      = $this->imagesForProject($item->id);
        return $data;
    }

    private function infoWithRelations(Information $info): array
    {
        $data = $info->toArray();
        $data['images'] = $this->imagesForInformation($info->id);
        return $data;
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

    private function deleteImageFile(string $imagePath): void
    {
        $imagePath = ltrim($imagePath, '/');
        if (strpos($imagePath, 'uploads/') !== 0) return;
        $full = public_path() . '/' . $imagePath;
        if (is_file($full)) @unlink($full);
    }
}
