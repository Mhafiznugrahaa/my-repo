<?php

namespace app\controller\admin;

use app\model\Information;
use support\Request;
use support\Response;
use Webman\Http\UploadFile;

class InformationController
{
    // Ekstensi gambar yang diizinkan & ukuran maksimum (2 MB).
    private const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    private const MAX_SIZE = 2 * 1024 * 1024;

    public function index(Request $request): Response
    {
        $keyword = (string) $request->input('q', '');

        // Membangun query secara bertahap (query builder).
        $query = new Information();

        if ($keyword !== '') {
            $query = $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->whereOr('body', 'like', "%{$keyword}%");
            });
        }

        // paginate(10) -> 10 data per halaman (tombol halaman ada di view).
        $informations = $query->order('created_at', 'desc')->paginate(10);

        return view('admin/index', [
            'informations' => $informations,
            'keyword'      => $keyword,
            'admin_name'   => session('admin_name'),
        ]);
    }

    public function create(Request $request): Response
    {
        return view('admin/form', [
            'info'       => null,
            'errors'     => [],
            'admin_name' => session('admin_name'),
        ]);
    }

    // CREATE: simpan data baru. Method ini hanya bisa dipanggil via POST
    // dari form admin (sudah diproteksi middleware).
    public function store(Request $request): Response
    {
        $result = $this->validated($request);

        // Jika validasi gagal, tampilkan lagi form beserta pesan error
        // dan isian yang tadi diketik (biar tidak hilang).
        if ($result['errors'] !== []) {
            return view('admin/form', [
                'info'       => (object) $request->post(),
                'errors'     => $result['errors'],
                'admin_name' => session('admin_name'),
            ]);
        }

        $data = $result['data'];

        // Proses upload gambar (jika ada). Nilai berupa path publik atau null.
        $uploaded = $this->handleUpload($request);
        if ($uploaded !== null) {
            $data['image'] = $uploaded;
        }

        // validated() mengembalikan array data bersih -> langsung insert.
        Information::create($data);

        return redirect('/admin');
    }

    public function edit(Request $request, $id): Response
    {
        $info = Information::find($id);

        if (!$info) {
            return redirect('/admin');
        }

        return view('admin/form', [
            'info'       => $info,
            'errors'     => [],
            'admin_name' => session('admin_name'),
        ]);
    }

    public function update(Request $request, $id): Response
    {
        $info = Information::find($id);

        if (!$info) {
            return redirect('/admin');
        }

        $result = $this->validated($request);

        // Sama seperti store, tapi kalau gagal tampilkan form edit
        // dengan data lama (gabungan record + input baru).
        if ($result['errors'] !== []) {
            return view('admin/form', [
                'info'       => (object) array_merge($info->toArray(), $request->post()),
                'errors'     => $result['errors'],
                'admin_name' => session('admin_name'),
            ]);
        }

        $data = $result['data'];

        // Jika admin mencentang "hapus gambar", buang gambar lama.
        if ($request->post('remove_image') === '1' && $info->image) {
            $this->deleteImageFile($info->image);
            $data['image'] = null;
        }

        // Jika ada gambar baru diunggah, ganti yang lama.
        $uploaded = $this->handleUpload($request);
        if ($uploaded !== null) {
            if ($info->image) {
                $this->deleteImageFile($info->image);
            }
            $data['image'] = $uploaded;
        }

        // save() hanya mengubah field yang ada di $data (partial update aman).
        $info->save($data);

        return redirect('/admin');
    }

    public function delete(Request $request, $id): Response
    {
        $info = Information::find($id);

        if ($info) {
            // Hapus juga file gambar dari disk agar tidak menumpuk.
            if ($info->image) {
                $this->deleteImageFile($info->image);
            }
            $info->delete();
        }

        if ($request->expectsJson()) {
            return json(['code' => 0, 'msg' => 'Berhasil dihapus']);
        }

        return redirect('/admin');
    }

    private function validated(Request $request): array
    {
        $title    = trim((string) $request->post('title', ''));
        $category = trim((string) $request->post('category', ''));
        $body     = trim((string) $request->post('body', ''));
        $status   = (string) $request->post('status', 'published');

        $errors = [];

        if ($title === '') {
            $errors['title'] = 'Judul wajib diisi';
        }
        if ($body === '') {
            $errors['body'] = 'Isi informasi wajib diisi';
        }
        if (!in_array($status, ['published', 'draft'])) {
            $status = 'published';
        }

        // Validasi file gambar (jika diunggah).
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
            'title'    => $title,
            'category' => $category === '' ? 'Umum' : $category,
            'body'     => $body,
            'status'   => $status,
        ];

        return ['errors' => $errors, 'data' => $data];
    }

    /**
     * Simpan file yang diunggah ke public/uploads dan kembalikan path publiknya
     * (mis. "/uploads/abc123.jpg"). Mengembalikan null jika tidak ada file valid.
     */
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

        // Pastikan folder tujuan ada.
        $dir = public_path() . '/uploads';
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        // Nama file unik agar tidak bentrok / tertimpa.
        $filename = date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        $file->move($dir . '/' . $filename);

        // Path yang bisa diakses browser.
        return '/uploads/' . $filename;
    }

    /**
     * Hapus file gambar dari disk berdasarkan path publiknya.
     */
    private function deleteImageFile(string $imagePath): void
    {
        // Hanya izinkan menghapus di dalam folder uploads (keamanan).
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
