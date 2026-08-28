<?php

namespace app\controller\admin;

use app\model\Portfolio;
use support\Request;
use support\Response;
use Webman\Http\UploadFile;

class PortfolioController
{
    private const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    private const MAX_SIZE = 2 * 1024 * 1024;

    public function index(Request $request): Response
    {
        $keyword = (string) $request->input('q', '');
        $query = new Portfolio();

        if ($keyword !== '') {
            $query = $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->whereOr('description', 'like', "%{$keyword}%");
            });
        }

        $portfolios = $query->order('created_at', 'desc')->paginate(10);

        return view('admin/portofolio', [
            'portfolios'  => $portfolios,
            'keyword'     => $keyword,
            'admin_name'  => session('admin_name'),
        ]);
    }

    public function create(Request $request): Response
    {
        return view('admin/portfolio_form', [
            'portfolio'  => null,
            'errors'     => [],
            'admin_name' => session('admin_name'),
        ]);
    }

    public function store(Request $request): Response
    {
        $result = $this->validated($request);

        if ($result['errors'] !== []) {
            return view('admin/portfolio_form', [
                'portfolio'  => (object) $request->post(),
                'errors'     => $result['errors'],
                'admin_name' => session('admin_name'),
            ]);
        }

        $data = $result['data'];

        $uploaded = $this->handleUpload($request);
        if ($uploaded !== null) {
            $data['image'] = $uploaded;
        }

        Portfolio::create($data);

        return redirect('/admin/portofolio');
    }

    public function edit(Request $request, $id): Response
    {
        $portfolio = Portfolio::find($id);

        if (!$portfolio) {
            return redirect('/admin/portofolio');
        }

        return view('admin/portfolio_form', [
            'portfolio'  => $portfolio,
            'errors'     => [],
            'admin_name' => session('admin_name'),
        ]);
    }

    public function update(Request $request, $id): Response
    {
        $portfolio = Portfolio::find($id);

        if (!$portfolio) {
            return redirect('/admin/portofolio');
        }

        $result = $this->validated($request);

        if ($result['errors'] !== []) {
            return view('admin/portfolio_form', [
                'portfolio'  => (object) array_merge($portfolio->toArray(), $request->post()),
                'errors'     => $result['errors'],
                'admin_name' => session('admin_name'),
            ]);
        }

        $data = $result['data'];

        if ($request->post('remove_image') === '1' && $portfolio->image) {
            $this->deleteImageFile($portfolio->image);
            $data['image'] = null;
        }

        $uploaded = $this->handleUpload($request);
        if ($uploaded !== null) {
            if ($portfolio->image) {
                $this->deleteImageFile($portfolio->image);
            }
            $data['image'] = $uploaded;
        }

        $portfolio->save($data);

        return redirect('/admin/portofolio');
    }

    public function delete(Request $request, $id): Response
    {
        $portfolio = Portfolio::find($id);

        if ($portfolio) {
            if ($portfolio->image) {
                $this->deleteImageFile($portfolio->image);
            }
            $portfolio->delete();
        }

        if ($request->expectsJson()) {
            return json(['code' => 0, 'msg' => 'Berhasil dihapus']);
        }

        return redirect('/admin/portofolio');
    }

    private function validated(Request $request): array
    {
        $title       = trim((string) $request->post('title', ''));
        $description = trim((string) $request->post('description', ''));
        $category    = trim((string) $request->post('category', ''));
        $projectUrl  = trim((string) $request->post('project_url', ''));

        $errors = [];

        if ($title === '') {
            $errors['title'] = 'Judul proyek wajib diisi';
        }

        $file = $request->file('image');
        if ($file && $file->isValid()) {
            $ext = strtolower($file->getUploadExtension());
            if (!in_array($ext, self::ALLOWED_EXT)) {
                $errors['image'] = 'Format gambar harus: ' . implode(', ', self::ALLOWED_EXT);
            } elseif ($file->getSize() > self::MAX_SIZE) {
                $errors['image'] = 'Ukuran gambar maksimal 2 MB';
            }
        }

        $data = [
            'title'       => $title,
            'description' => $description,
            'category'    => $category === '' ? 'Umum' : $category,
            'project_url' => $projectUrl,
        ];

        return ['errors' => $errors, 'data' => $data];
    }

    private function handleUpload(Request $request): ?string
    {
        $file = $request->file('image');
        if (!$file || !$file->isValid()) {
            return null;
        }

        $ext = strtolower($file->getUploadExtension());
        if (!in_array($ext, self::ALLOWED_EXT)) {
            return null;
        }

        $dir = public_path() . '/uploads';
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $filename = date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        $file->move($dir . '/' . $filename);

        return '/uploads/' . $filename;
    }

    private function deleteImageFile(string $imagePath): void
    {
        $imagePath = ltrim($imagePath, '/');
        if (strpos($imagePath, 'uploads/') !== 0) {
            return;
        }
        $full = public_path() . '/' . $imagePath;
        if (is_file($full)) {
            @unlink($full);
        }
    }
}
